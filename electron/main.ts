import ApiDataHelper, { ApiData } from './utils/ApiDataHelper';
import WebSocketApiHelper from './utils/WebSocketApiHelper';
import LocalApiFetchHelper from './utils/LocalApiFetchHelper';
import RiotApiFetchHelper, { Region } from './utils/RiotApiFetchHelper';
import { ClientInfo } from './utils/structs/ClientInfo';

const { app, BrowserWindow, ipcMain } = require('electron');
const dotenv = require('dotenv').config({ path: "electron.env" });
const path = require('path');

async function setupDataHelper(): Promise<ApiDataHelper> {
  return ApiDataHelper.build();
}

async function setupLocalApiFetchHelper(dataHelper: ApiDataHelper) {
  let localApiFetchHelper = new LocalApiFetchHelper(dataHelper);
  registerFetchHandler(localApiFetchHelper);
  return localApiFetchHelper;
}

async function setupWebsocketApiHelper(dataHelper: ApiDataHelper) {
  let websocketApiHelper = new WebSocketApiHelper(dataHelper);
  websocketApiHelper.start();
  return websocketApiHelper;
}

async function setupRiotApiFetchHelper(localApiFetchHelper: LocalApiFetchHelper) {
  let riotApiFetchHelper = await RiotApiFetchHelper.build(await createClientInfo(localApiFetchHelper));
  registerRiotApiFetchHandler(riotApiFetchHelper);
  return riotApiFetchHelper;
}

async function createClientInfo(localApiFetchHelper: LocalApiFetchHelper): Promise<ClientInfo> {
  return { region: Region[(await localApiFetchHelper.getRegion()) as unknown as keyof typeof Region] }; // ¯\_(ツ)_/¯
}

async function registerFetchHandler(localApiFetchHelper: LocalApiFetchHelper) {
  ipcMain.on('summoner', async function (event: any, arg: any) {
    console.log(arg);
    console.log(arg.cmd);
    switch (arg.cmd) {
      case 'current-summoner':
        console.log(await localApiFetchHelper.getCurrentSummoner());
    }
  });
}

async function registerRiotApiFetchHandler(riotApiFetchHelper: RiotApiFetchHelper) {
  // riot api documentation (https://developer.riotgames.com/apis)
  ipcMain.on('custom', async (event, arg) => {
    switch (arg.cmd) {
      case 'set-region':
        console.log("set-region was called");
        return (riotApiFetchHelper.region = arg.region);
    }
  });

  ipcMain.handle('riot-summoner', async (event, arg) => {
    switch (arg.cmd) {
      case 'me':
        console.log("@ipcMain.handle('riot-summoner): ", process.env.RIOT_API_KEY);
        return riotApiFetchHelper.test(process.env.RIOT_API_KEY)
    }
  });
}


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  (async () => {
    // setup local api data helper
    let dataHelper = await setupDataHelper();

    // setup and register local api fetcher
    let localApiFetchHelper = await setupLocalApiFetchHelper(dataHelper);

    // setup websocket api helper
    let WebSocketApiHelper = await setupWebsocketApiHelper(dataHelper);

    // setup and register external riot api fetcher
    let riotApiFetchHelper = await setupRiotApiFetchHelper(localApiFetchHelper);
  })()
    .catch((e) => console.log(e));

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'development') {
    console.log("development");
    mainWindow.loadURL('http://localhost:3000');
  } else if (process.env.NODE_ENV === 'production') {
    console.log("production");
    mainWindow.loadFile('build/index.html');
  }

  // DEBUG LOGS
  //console.log("process.env: ", process.env);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.