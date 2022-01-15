import ApiDataHelper from './ApiDataHelper';
import LobbyMemberManager from './lobby/LobbyMemberManager';
import WebsocketLobbyListener from './lobby/WebsocketLobbyListener';
import WebSocketChampSelectListener from './champselect/WebsocketChampSelectListener';

export default class MatchHandler {
    private readonly lobbyMemberManager: LobbyMemberManager;
    private readonly webSocketApiHelper: WebsocketLobbyListener;
    private readonly webSocketChampSelectListener: WebSocketChampSelectListener;

    public constructor(dataHelper: ApiDataHelper) {
        this.webSocketApiHelper = new WebsocketLobbyListener(dataHelper);
        this.lobbyMemberManager = new LobbyMemberManager(this.webSocketApiHelper);
        this.webSocketChampSelectListener = new WebSocketChampSelectListener(dataHelper);

        this.webSocketChampSelectListener.ChampSelectUpdate.on((data) => this.champSelectUpdateListener(data));
    }

    private champSelectUpdateListener(data: any) {
        console.log("TeamMember: ", this.lobbyMemberManager.lobbyMember.map(e => e.summonerName));
    }
}