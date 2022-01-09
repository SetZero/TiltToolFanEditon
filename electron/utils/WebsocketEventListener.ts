import ApiDataHelper from "./ApiDataHelper";
import WebsocketApiHelper from "./WebSocketApiHelper";

export class WebsocketEventListener {
    private readonly websocketApiHelper: WebsocketApiHelper;

    constructor(dataHelper: ApiDataHelper) {
        this.websocketApiHelper = new WebsocketApiHelper(dataHelper);
        this.websocketApiHelper.start();

        this.websocketApiHelper.CreateEvent.on("/lol-lobby/v2/lobby", (data) => this.lobbyCreateListener(data));
        this.websocketApiHelper.DeleteEvent.on("/lol-lobby/v2/lobby", (data) => this.lobbyDeleteListener(data));
        this.websocketApiHelper.UpdateEvent.on("/lol-lobby/v2/lobby/members", (data) => this.updateMemberListener(data));
        this.websocketApiHelper.DeleteEvent.on("/lol-login/v1/session", (data) => this.logoutListener(data));
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
}