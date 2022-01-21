import { MatchParticipant } from "./RiotApiFetchHelper";

const { ipcMain } = require('electron');

export default class IpcMatchHandler {
    private sender: Electron.IpcMainEvent["sender"] | undefined;

    constructor() {
        console.log("Handling IPC");
        ipcMain.on('mainWindowReady', (event, arg) => {
            console.log("Main window ready");
            this.sender = event.sender;
        });
    }

    public sendStartFetchEvent() {
        if(this.sender === undefined) {
            console.log("Sender is undefined, dropping message");
            return
        }
        console.log("sending start fetch event");
        this.sender.send('tilttool/match/startfetch');
    }

    public sendPlayerMatchData(playerInfo: {}) {
        if(this.sender === undefined) {
            console.log("Sender is undefined, dropping message");
            return
        }
        console.log("sending player match data");
        this.sender.send('tilttool/match/playerinfo', playerInfo);
    }

    public sendQuitChampSelectEvent() {
        if(this.sender === undefined) {
            console.log("Sender is undefined, dropping message");
            return
        }
        console.log("sending quit champ select event");
        this.sender.send('tilttool/match/quitchampselect');
    }
}