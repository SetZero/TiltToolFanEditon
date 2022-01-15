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

export interface LobbyMember {
    allowedChangeActivity: boolean,
    allowedInviteOthers: boolean,
    allowedKickOthers: boolean,
    allowedStartActivity: boolean,
    allowedToggleInvite: boolean,
    autoFillEligible: boolean,
    autoFillProtectedForPromos: boolean,
    autoFillProtectedForSoloing: boolean,
    autoFillProtectedForStreaking: boolean,
    botChampionId: number,
    botDifficulty: 'NONE' | 'BEGINNER' | 'INTERMEDIATE',
    botId: string,
    firstPositionPreference: '',
    isBot: boolean,
    isLeader: boolean,
    isSpectator: boolean,
    puuid: string,
    ready: boolean,
    secondPositionPreference: '',
    showGhostedBanner: boolean,
    summonerIconId: number,
    summonerId: number,
    summonerInternalName: string,
    summonerLevel: number,
    summonerName: string,
    teamId: number
}

export interface GameConfig {
    allowablePremadeSizes: Array<number>,
    customLobbyName: string,
    customMutatorName: string,
    customRewardsDisabledReasons: Array<string>,
    customSpectatorPolicy: 'NotAllowed',
    customSpectators: Array<any>,
    customTeam100: Array<any>,
    customTeam200: Array<any>,
    gameMode: 'CLASSIC',
    isCustom: boolean,
    isLobbyFull: boolean,
    isTeamBuilderManaged: boolean,
    mapId: number,
    maxHumanPlayers: number,
    maxLobbySize: number,
    maxTeamSize: number,
    pickType: '',
    premadeSizeAllowed: boolean,
    queueId: number,
    showPositionSelector: boolean
}

export interface LobbyCreate {
    gameConfig: GameConfig,
    members: Array<LobbyMember>,
    partyId: string,
    partyType: 'open' | 'closed',
}

export default class WebsocketLobbyListener {
    private readonly websocketApiHelper: WebsocketApiHelper;
    private readonly lobbyCreateEvent = new LiteEvent<LobbyCreate>();
    private readonly lobbyDeleteEvent = new LiteEvent<{}>();
    private readonly lobbyMemberEvent = new LiteEvent<Array<LobbyMember>>();

    constructor(dataHelper: ApiDataHelper) {
        this.websocketApiHelper = new WebsocketApiHelper(dataHelper);
        this.websocketApiHelper.start();

        this.websocketApiHelper.CreateEvent.on("/lol-lobby/v2/lobby", (data) => this.lobbyCreateListener(data));
        this.websocketApiHelper.DeleteEvent.on("/lol-lobby/v2/lobby", (data) => this.lobbyDeleteListener(data));
        this.websocketApiHelper.UpdateEvent.on("/lol-lobby/v2/lobby/members", (data) => this.updateMemberListener(data));
    }

    private lobbyCreateListener(data: LobbyCreate) {
        console.log("=== [CREATE] /lol-lobby/v2/lobby ===");
        this.lobbyCreateEvent.trigger(data);
    }

    private lobbyDeleteListener(data: any) {
        console.log("=== [DELETE] /lol-lobby/v2/lobby ===");
        this.lobbyDeleteEvent.trigger({});
    }

    private updateMemberListener(data: Array<LobbyMember>) {
        console.log("=== [UPDATE] /lol-lobby/v2/lobby/members ===");
        this.lobbyMemberEvent.trigger(data);
    }

    public get LobbyCreateEvent() {
        return this.lobbyCreateEvent.expose();
    }

    public get LobbyDeleteEvent() {
        return this.lobbyDeleteEvent.expose();
    }

    public get LobbyMemberEvent() {
        return this.lobbyMemberEvent.expose();
    }
}