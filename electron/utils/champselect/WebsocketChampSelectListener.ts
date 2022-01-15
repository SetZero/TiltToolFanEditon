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

export interface ChampSelect {
    myTeam: Array<TeamMember>,
    theirTeam: Array<TeamMember>,
}

export default class WebsocketChampSelectListener {
    private readonly websocketApiHelper: WebsocketApiHelper;
    private readonly champSelectUpdate = new LiteEvent<any>();
    private readonly champSelectQuit = new LiteEvent<{}>();
    private readonly champSelectEnter = new LiteEvent<ChampSelect>();

    constructor(dataHelper: ApiDataHelper) {
        this.websocketApiHelper = new WebsocketApiHelper(dataHelper);
        this.websocketApiHelper.start();

        this.websocketApiHelper.DeleteEvent.on("/lol-login/v1/session", (data) => this.logoutListener(data));
        this.websocketApiHelper.UpdateEvent.on("/lol-champ-select/v1/session", (data) => this.sessionUpdate(data));
        this.websocketApiHelper.DeleteEvent.on("/lol-champ-select/v1/session", () => this.sessionDelete());
        this.websocketApiHelper.CreateEvent.on("/lol-champ-select/v1/session", (data) => this.sessionCreate(data));
    }

    private logoutListener(data: any) {
        console.log("=== [DELETE] /lol-login/v1/session ===");
        console.log(data);
    }

    private sessionUpdate(data: any) {
        console.log("=== [UPDATE] /lol-champ-select/v1/session ===");
        this.champSelectUpdate.trigger(data);
    }

    private sessionDelete() {
        console.log("=== [DELETE] /lol-champ-select/v1/session ===");
        this.champSelectQuit.trigger({});
    }

    private sessionCreate(data: ChampSelect) {
        console.log("=== [CREATE] /lol-champ-select/v1/session ===");
        this.champSelectEnter.trigger(data);
    }

    public get ChampSelectUpdate() {
        return this.champSelectUpdate.expose();
    }

    public get ChampSelectQuit() {
        return this.champSelectQuit.expose();
    }

    public get ChampSelectEnter() {
        return this.champSelectEnter.expose();
    }
}