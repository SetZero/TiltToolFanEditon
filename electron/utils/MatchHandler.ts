import ApiDataHelper from './ApiDataHelper';
import LobbyMemberManager from './lobby/LobbyMemberManager';
import WebsocketLobbyListener, { LobbyMember } from './lobby/WebsocketLobbyListener';
import WebSocketChampSelectListener, { ChampSelect } from './champselect/WebsocketChampSelectListener';
import LiteEvent from './events/LiteEvent';
import LocalApiFetchHelper from './LocalApiFetchHelper';
import RiotApiFetchHelper, { MatchParticipant } from './RiotApiFetchHelper';
import IpcMatchHandler from './IpcMatchHandler';
import { sleep } from './utility';

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
        this.webSocketChampSelectListener.ChampSelectQuit.on((data) => this.champSelectQuitListener());
    }

    private async champSelectEnterListener(data: ChampSelect | undefined) {
        if (data === undefined) return;
        this.ipcMatchHandler.sendStartFetchEvent();

        this.champSelectEvent.trigger(this.lobbyMemberManager.lobbyMember);

        this.lobbyMemberManager.lobbyMember.forEach(e => {
            this.localApiFetchHelper.getSummonerNameBySummonerId(e.summonerId).then(summoner => {
                console.log(e.summonerName, " <=> ", summoner);
            });
        });
        let matchData = new Map<string, MatchParticipant[]>();
        let teamSize = data.myTeam.length;

        data.myTeam.forEach(async e => {
            let summonerName = "";
            this.localApiFetchHelper.getSummonerNameBySummonerId(e.summonerId)
                .then(s => summonerName = s)
                .then(summoner => this.riotApiFetchHelper.getAllMatchInfoBySummonerName(summoner))
                .then(matches => matches.map(m =>
                    m.info.participants.find(p =>
                        p.summonerName === summonerName
                    )
                ))
                .then(m => m.every(x => x !== undefined) ? matchData.set(m[0]?.summonerName ?? "UNDEFINED", m as MatchParticipant[]) : null)
                .then(() => {
                    teamSize = teamSize - 1
                    if (teamSize === 0) {
                        let obj = Array.from(matchData.entries()).reduce((obj, [key, value]) => {
                            //@ts-ignore
                            obj[key] = value;
                            return obj;
                        }, {});
                        this.ipcMatchHandler.sendPlayerMatchData(obj);
                    }
                })
                .catch(e => {
                    console.log(e);
                });

            await sleep(1040);
        });
    }

    private champSelectQuitListener() {
        this.ipcMatchHandler.sendQuitChampSelectEvent();
    }

    public get ChampSelectEnter() {
        return this.champSelectEvent.expose();
    }
}