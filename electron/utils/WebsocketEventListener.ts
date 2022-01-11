import ApiDataHelper from "./ApiDataHelper";
import WebsocketApiHelper from "./WebSocketApiHelper";

interface TeamMember {
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
export class WebsocketEventListener {
    private readonly websocketApiHelper: WebsocketApiHelper;

    private myTeam: TeamMember[] = [];

    constructor(dataHelper: ApiDataHelper) {
        this.websocketApiHelper = new WebsocketApiHelper(dataHelper);
        this.websocketApiHelper.start();

        this.websocketApiHelper.CreateEvent.on("/lol-lobby/v2/lobby", (data) => this.lobbyCreateListener(data));
        this.websocketApiHelper.DeleteEvent.on("/lol-lobby/v2/lobby", (data) => this.lobbyDeleteListener(data));
        this.websocketApiHelper.UpdateEvent.on("/lol-lobby/v2/lobby/members", (data) => this.updateMemberListener(data));
        this.websocketApiHelper.DeleteEvent.on("/lol-login/v1/session", (data) => this.logoutListener(data));
        this.websocketApiHelper.UpdateEvent.on("/lol-champ-select/v1/session", (data) => this.sessionUpdate(data));
    }

    private lobbyCreateListener(data: any) {
        console.log("=== [CREATE] /lol-lobby/v2/lobby ===");
        console.log(data);
    }

    private lobbyDeleteListener(data: any) {
        console.log("=== [DELETE] /lol-lobby/v2/lobby ===");
        console.log(data);
    }

    private updateMemberListener(data: any) {
        console.log("=== [UPDATE] /lol-lobby/v2/lobby/members ===");
        console.log(data);
    }

    private logoutListener(data: any) {
        console.log("=== [DELETE] /lol-login/v1/session ===");
        console.log(data);
    }

    private sessionUpdate(data: any) {
        console.log("=== [UPDATE] /lol-champ-select/v1/session ===");
        const newElements = (data.myTeam as TeamMember[]).filter(x => !this.myTeam.includes(x));
        this.myTeam = data.myTeam;
        console.log(newElements);
    }

}