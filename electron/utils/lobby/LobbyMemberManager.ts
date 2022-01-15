import WebsocketLobbyListener, { LobbyMember, LobbyCreate } from './WebsocketLobbyListener';

export default class LobbyMemberManager {
    private _lobbyMember: Array<LobbyMember> = [];

    public constructor(websocketLobbyListener: WebsocketLobbyListener) {
        websocketLobbyListener.LobbyCreateEvent.on((data) => data ? this.lobbyCreateListener(data) : {});
        websocketLobbyListener.LobbyMemberEvent.on((data) => data ? this.lobbyMemberListener(data) : {});
        websocketLobbyListener.LobbyDeleteEvent.on(() => this.lobbyDeleteListener());
    }

    private lobbyCreateListener(data: LobbyCreate) {
        this._lobbyMember = data.members;
    }

    private lobbyMemberListener(data: Array<LobbyMember>) {
        this._lobbyMember = data;
    }

    private lobbyDeleteListener() {
        this._lobbyMember = [];
    }

    public get lobbyMember() {
        return this._lobbyMember;
    }
}