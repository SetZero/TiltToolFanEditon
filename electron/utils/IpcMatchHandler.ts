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

    public sendPlayerMatchData(playerInfo: Array<MatchParticipant>) {
        if(this.sender === undefined) {
            console.log("Sender is undefined, dropping message");
            return
        }
        console.log("sending player match data");
        this.sender.send('tilttool/match/playerinfo', playerInfo);
    }
}