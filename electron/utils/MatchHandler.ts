import ApiDataHelper from './ApiDataHelper';
import LobbyMemberManager from './lobby/LobbyMemberManager';
import WebsocketLobbyListener, { LobbyMember } from './lobby/WebsocketLobbyListener';
import WebSocketChampSelectListener, { ChampSelect } from './champselect/WebsocketChampSelectListener';
import LiteEvent from './events/LiteEvent';
import LocalApiFetchHelper from './LocalApiFetchHelper';
import RiotApiFetchHelper, { MatchParticipant } from './RiotApiFetchHelper';
import IpcMatchHandler from './IpcMatchHandler';

export default class MatchHandler {
    private readonly lobbyMemberManager: LobbyMemberManager;
    private readonly webSocketApiHelper: WebsocketLobbyListener;
    private readonly webSocketChampSelectListener: WebSocketChampSelectListener;
    private readonly riotApiFetchHelper: RiotApiFetchHelper;
    private readonly localApiFetchHelper: LocalApiFetchHelper;
    private readonly ipcMatchHandler: IpcMatchHandler = new IpcMatchHandler();

    private readonly champSelectEvent = new LiteEvent<LobbyMember[]>();

    public constructor(dataHelper: ApiDataHelper, localApiFetchHelper: LocalApiFetchHelper, riotApiFetchHelper: RiotApiFetchHelper) {
        this.webSocketApiHelper = new WebsocketLobbyListener(dataHelper);
        this.lobbyMemberManager = new LobbyMemberManager(this.webSocketApiHelper);
        this.webSocketChampSelectListener = new WebSocketChampSelectListener(dataHelper);

        this.riotApiFetchHelper = riotApiFetchHelper;
        this.localApiFetchHelper = localApiFetchHelper;

        this.webSocketChampSelectListener.ChampSelectEnter.on((data) => this.champSelectEnterListener(data));
    }

    private champSelectEnterListener(data: ChampSelect | undefined) {
        if (data === undefined) return;

        this.champSelectEvent.trigger(this.lobbyMemberManager.lobbyMember);

        this.lobbyMemberManager.lobbyMember.forEach(e => {
            this.localApiFetchHelper.getSummonerNameBySummonerId(e.summonerId).then(summoner => {
                console.log(e.summonerName, " <=> ", summoner);
            });
        });

        data.myTeam.forEach(e => {
            let summonerName = "";
            this.localApiFetchHelper.getSummonerNameBySummonerId(e.summonerId)
                .then(s => summonerName = s)
                .then(summoner => this.riotApiFetchHelper.getAllMatchInfoBySummonerName(summoner))
                .then(matches => matches.map(m =>
                    m.info.participants.find(p =>
                        p.summonerName === summonerName
                    )
                ))
                .then(m => m.every(x => x !== undefined) ? this.ipcMatchHandler.sendPlayerMatchData(m as MatchParticipant[]) : null);
        });
    }

    public get ChampSelectEnter() {
        return this.champSelectEvent.expose();
    }
}