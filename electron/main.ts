import ApiDataHelper, { ApiData } from './utils/ApiDataHelper';
import WebSocketApiHelper from './utils/WebSocketApiHelper';
import LocalApiFetchHelper from './utils/LocalApiFetchHelper';
import RiotApiFetchHelper, { Region } from './utils/RiotApiFetchHelper';
import { ClientInfo } from './utils/structs/ClientInfo';
import WebsocketLobbyListener from './utils/lobby/WebsocketLobbyListener';
import LobbyMemberManager from './utils/lobby/LobbyMemberManager';
import MatchHandler from './utils/MatchHandler';
import process from 'process';
import DataDragonHelper from './static/DataDragonHelper';
import StaticDataProtocol from './static/StaticDataProtocol';
import { protocol } from 'electron';

const { app, BrowserWindow, ipcMain } = require('electron');
const dotenv = require('dotenv').config({ path: "electron.env" });
const path = require('path');

StaticDataProtocol.initializeProtocolPriviliges();

async function setupDataHelper(): Promise<ApiDataHelper> {
  return ApiDataHelper.build();
}

async function setupLocalApiFetchHelper(dataHelper: ApiDataHelper) {
  let localApiFetchHelper = new LocalApiFetchHelper(dataHelper);
  registerFetchHandler(localApiFetchHelper);
  return localApiFetchHelper;
}

async function setupRiotApiFetchHelper(localApiFetchHelper: LocalApiFetchHelper) {
  let riotApiFetchHelper = await RiotApiFetchHelper.build(await createClientInfo(localApiFetchHelper), process.env.RIOT_API_KEY);
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

  // api debug
  // let match_id = 'EUW1_5667715751';
  // console.log(await riotApiFetchHelper.getMatchesByPuuid(await riotApiFetchHelper.getPuuidBySummonerName("goandsteponlego")));
  // console.log(await riotApiFetchHelper.getMatchInfoByMatchId(match_id));


  ipcMain.on('custom', async (event, arg) => {
    switch (arg.cmd) {
      case 'set-region':
        console.log("set-region was called");
        return (riotApiFetchHelper.region = arg.region);
    }
  });

  ipcMain.handle('riot/summoner', async (event, arg) => {
    switch (arg.cmd) {
      case 'by-account':
        return riotApiFetchHelper.getSummonerByAccountId(arg.account_id);
      case 'by-name':
        return riotApiFetchHelper.getSummonerBySummonerName(arg.summoner_name);
      case 'by-puuid':
        return riotApiFetchHelper.getSummonerByPuuid(arg.puuid);
    }
  });

  ipcMain.handle('riot/champion-mastery', async (event, arg) => {
    switch (arg.cmd) {
      case 'champion-mastery':
        return riotApiFetchHelper.getChampionMasteriesBySummonerId(arg.summoner_id);
      case 'champion-mastery/score':
        return riotApiFetchHelper.getChampionMasteryScoresBySummonerId(arg.summoner_id);
    }
  });

  ipcMain.handle('riot/match', async (event, arg) => {
    switch (arg.cmd) {
      case 'by-puuid':
        return riotApiFetchHelper.getMatchesByPuuid(arg.puuid);
      case 'by-name':
        return riotApiFetchHelper.getMatchesBySummonerName(arg.summoner_name);
      case 'info':
        return riotApiFetchHelper.getMatchInfoByMatchId(arg.match_id);
      case 'info/participants':
        return riotApiFetchHelper.getParticipantsByMatchId(arg.match_id)
    }
  })
}
function createWindow() {

  //@ts-ignore
  process.on('unhandledRejection', (reason: {stack: any}, p) => {
    // console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
    // console.log(reason?.stack);
  });


  (async () => {
    // setup local api data helper
    let dataHelper = await setupDataHelper();

    // setup and register local api fetcher
    let localApiFetchHelper = await setupLocalApiFetchHelper(dataHelper);

    // setup and register external riot api fetcher
    let riotApiFetchHelper = await setupRiotApiFetchHelper(localApiFetchHelper);

    // setup Match Handler for client logic
    let matchHandler = new MatchHandler(dataHelper, localApiFetchHelper, riotApiFetchHelper);

    let ddHelper = await DataDragonHelper.init();
    console.log("Help: ", ddHelper.getRolesForChampion(1));
    StaticDataProtocol.registerStaticDataProtocol();
  })()
    .then(() => {
      // Create the browser window.
      const mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        frame: false,
        transparent: true,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
      });

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
    })
    .catch((e) => console.log(e));


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