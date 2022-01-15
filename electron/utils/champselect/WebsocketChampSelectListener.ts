import ApiDataHelper from "../ApiDataHelper";
import WebsocketApiHelper from "../WebSocketApiHelper";
import LiteEvent from "../events/LiteEvent";


export interface TeamMember {
    assignedPosition: string,
    cellId: number,
    championId: number,
    championPickIntent: number,
    entitledFeatureType: string,
    selectedSkinId: number,
    spell1Id: number,
    spell2Id: number,
    summonerId: number,
    team: number,
    wardSkinId: number
}

export default class WebsocketChampSelectListener {
    private readonly websocketApiHelper: WebsocketApiHelper;
    private readonly champSelectUpdate = new LiteEvent<any>();

    constructor(dataHelper: ApiDataHelper) {
        this.websocketApiHelper = new WebsocketApiHelper(dataHelper);
        this.websocketApiHelper.start();

        this.websocketApiHelper.DeleteEvent.on("/lol-login/v1/session", (data) => this.logoutListener(data));
        this.websocketApiHelper.UpdateEvent.on("/lol-champ-select/v1/session", (data) => this.sessionUpdate(data));
    }

    private logoutListener(data: any) {
        console.log("=== [DELETE] /lol-login/v1/session ===");
        console.log(data);
    }

    private sessionUpdate(data: any) {
        console.log("=== [UPDATE] /lol-champ-select/v1/session ===");
        this.champSelectUpdate.trigger(data);
    }

    public get ChampSelectUpdate() {
        return this.champSelectUpdate.expose();
    }
}