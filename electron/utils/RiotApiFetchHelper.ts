import axios from "axios";
import { ClientInfo, SummonerInfo } from "./structs/ClientInfo";
import { sleep } from "./utility";

interface MatchData {
    metadata: MatchMetaData,
    info: MatchInfo
}

interface MatchMetaData {
    dataVersion: number,
    matchId: string,
    participants: Array<string>
}

interface MatchInfo {
    gameCreation: number,
    gameDuration: number,
    gameEndTimestamp: number,
    gameId: number,
    gameMode: "ARAM" | "CLASSIC",
    gameName: string,
    gameStartTimestamp: number,
    gameType: "MATCHED_GAME",
    gameVersion: string,
    mapId: number,
    participants: Array<MatchParticipant>,
}

export interface MatchParticipant {
    assists: number,
    baronKills: number,
    bountyLevel: number,
    champExperience: number,
    champLevel: number,
    championId: number,
    championName: string,
    championTransform: number,
    consumablesPurchased: number,
    damageDealtToBuildings: number,
    damageDealtToObjectives: number,
    damageDealtToTurrets: number,
    damageSelfMitigated: number,
    deaths: number,
    detectorWardsPlaced: number,
    doubleKills: number,
    dragonKills: number,
    firstBloodAssist: boolean,
    firstBloodKill: boolean,
    firstTowerAssist: boolean,
    firstTowerKill: boolean,
    gameEndedInEarlySurrender: boolean,
    gameEndedInSurrender: boolean,
    goldEarned: number,
    goldSpent: number,
    individualPosition: "MIDDLE" | "TOP" | "JUNGLE" | "BOTTOM" | "UTILITY" | "Invalid",
    inhibitorKills: number,
    inhibitorTakedowns: number,
    inhibitorsLost: number,
    item0: number,
    item1: number,
    item2: number,
    item3: number,
    item4: number,
    item5: number,
    item6: number,
    itemsPurchased: number,
    killingSprees: number,
    kills: number,
    lane: "MIDDLE" | "TOP" | "JUNGLE" | "BOTTOM" | "UTILITY" | "Invalid",
    largestCriticalStrike: number,
    largestKillingSpree: number,
    largestMultiKill: number,
    longestTimeSpentLiving: number,
    magicDamageDealt: number,
    magicDamageDealtToChampions: number,
    magicDamageTaken: number,
    neutralMinionsKilled: number,
    nexusKills: number,
    nexusLost: number,
    nexusTakedowns: number,
    objectivesStolen: number,
    objectivesStolenAssists: number,
    participantId: number,
    pentaKills: number,
    perks: MatchPerks,
    physicalDamageDealt: number,
    physicalDamageDealtToChampions: number,
    physicalDamageTaken: number,
    profileIcon: number,
    puuid: string,
    quadraKills: number,
    riotIdName: string,
    riotIdTagline: string,
    role: "DUO" | "DUO_CARRY" | "DUO_SUPPORT" | "SOLO" | "NONE" | "Invalid",
    sightWardsBoughtInGame: number,
    spell1Casts: number,
    spell2Casts: number,
    spell3Casts: number,
    spell4Casts: number,
    summoner1Casts: number,
    summoner1Id: number,
    summoner2Casts: number,
    summoner2Id: number,
    summonerId: string,
    summonerLevel: number,
    summonerName: string,
    teamEarlySurrendered: boolean,
    teamId: number,
    teamPosition: "",
    timeCCingOthers: number,
    timePlayed: number,
    totalDamageDealt: number,
    totalDamageDealtToChampions: number,
    totalDamageShieldedOnTeammates: number,
    totalDamageTaken: number,
    totalHeal: number,
    totalHealsOnTeammates: number,
    totalMinionsKilled: number,
    totalTimeCCDealt: number,
    totalTimeSpentDead: number,
    totalUnitsHealed: number,
    tripleKills: number,
    trueDamageDealt: number,
    trueDamageDealtToChampions: number,
    trueDamageTaken: number,
    turretKills: number,
    turretTakedowns: number,
    turretsLost: number,
    unrealKills: number,
    visionScore: number,
    visionWardsBoughtInGame: number,
    wardsKilled: number,
    wardsPlaced: number,
    win: boolean
}

interface MatchPerks {

}

//https://developer.riotgames.com/apis

export enum Region {
    BR = 'br1.api.riotgames.com',
    EUN = 'eun1.api.riotgames.com',
    EUW = 'euw1.api.riotgames.com',
    JP = 'jp1.api.riotgames.com',
    KR = 'kr.api.riotgames.com',
    LA1 = 'la1.api.riotgames.com',
    LA2 = 'la2.api.riotgames.com',
    NA = 'na1.api.riotgames.com',
    OC = 'oc1.api.riotgames.com',
    TR = 'tr1.api.riotgames.com',
    RU = 'ru.api.riotgames.com',
}

export enum RegionalRoute {
    AMERICAS = 'americas.api.riotgames.com',
    ASIA = 'asia.api.riotgames.com',
    EUROPE = 'europe.api.riotgames.com'
}

export default class RiotApiFetchHelper {
    private _region: Region | undefined = undefined;
    private _api_key: String | undefined = undefined;
    private _regionalRoute: RegionalRoute | undefined = undefined;

    public get region(): Region | undefined {
        return this._region;
    }

    public set region(region: Region | undefined) {
        this._region = region;
    }

    public get regionalRoute(): RegionalRoute | undefined {
        return this._regionalRoute;
    }

    public set regionalRoute(route: RegionalRoute | undefined) {
        this._regionalRoute = route;
    }

    //private _riotApiDataHelper : RiotApiDataHelper = new RiotApiDataHelper();
    private _clientInfo: ClientInfo | undefined;

    private constructor() { }

    public static async build(clientInfo: ClientInfo, riot_api_key: String | undefined): Promise<RiotApiFetchHelper> {
        const riotApiFetchHelper = new RiotApiFetchHelper();
        riotApiFetchHelper._clientInfo = clientInfo;
        riotApiFetchHelper.region = riotApiFetchHelper._clientInfo.region;
        riotApiFetchHelper._api_key = riot_api_key;
        riotApiFetchHelper.setRegionalRoute();
        console.log(riotApiFetchHelper.region);
        return riotApiFetchHelper;
    }

    public async getSummonerInfo(summoners: Array<String>) {
        let s = new Array<SummonerInfo>();
        s.push({})

        return s;
    }

    private setRegionalRoute() {
        switch (this._region) {
            case Region.NA:
            case Region.BR:
            case Region.LA1:
            case Region.LA2:
            case Region.OC:
                this.regionalRoute = RegionalRoute.AMERICAS;
                break;

            case Region.KR:
            case Region.JP:
                this.regionalRoute = RegionalRoute.ASIA;
                break;

            case Region.EUN:
            case Region.EUW:
            case Region.TR:
            case Region.RU:
                this.regionalRoute = RegionalRoute.EUROPE
                break;

            default:
                this.regionalRoute = RegionalRoute.EUROPE
        }
    }

    private buildRiotBaseUrl() {
        return "https://" + this.region;
    }

    private buildRegionalRouteBaseUrl() {
        return "https://" + this.regionalRoute;
    }

    public async getChampionInfo() {
        // todo
        const apiCallUrl = this.buildRiotBaseUrl() + "";

        return (await axios.get(apiCallUrl, {})).data;
    }

    public async test(rpi_key: String | undefined) {
        const name = "asdf"
        const apiCallUrl = this.buildRiotBaseUrl() + "/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + rpi_key;
        console.log(apiCallUrl);

        console.log(process.env.REACT_APP_API_KEY);

        return (await axios.get(apiCallUrl, {})).data;
    }

    /* match */
    public async getMatchesByPuuid(puuid: String) {
        const apiCallUrl = this.buildRegionalRouteBaseUrl() + "/lol/match/v5/matches/by-puuid/" + puuid + "/ids?api_key=" + this._api_key;
        return (await axios.get(apiCallUrl, {})).data;
    }

    public async getMatchInfoByMatchId(match_id: String) {
        const apiCallUrl = this.buildRegionalRouteBaseUrl() + "/lol/match/v5/matches/" + match_id + "?api_key=" + this._api_key;
        return (await axios.get(apiCallUrl, {})).data;
    }

    public async getAllMatchInfoBySummonerName(summoner_name: String) {
        const match_ids = await this.getMatchesBySummonerName(summoner_name);
        const match_info = new Array<any>();
        for (var i = match_ids.length - 1; i >= 0; i--) {
            console.log(i, match_ids[i]);
            try {
                match_info.push(await this.getMatchInfoByMatchId(match_ids[i]));
            } catch (error) {
                console.log("Can't get match info for match id: " + match_ids[i]);
            }
            if (i % 10 === 0) {
                await sleep(1040);
            }
        }
        return match_info as MatchData[];
    }

    /* summoner */
    public async getSummonerByAccountId(account_id: String) {
        const apiCallUrl = this.buildRiotBaseUrl() + "/lol/summoner/v4/summoners/by-account/" + account_id + "?api_key=" + this._api_key;
        return (await axios.get(apiCallUrl, {})).data;
    }

    public async getSummonerBySummonerName(summoner_name: String) {
        const apiCallUrl = this.buildRiotBaseUrl() + "/lol/summoner/v4/summoners/by-name/" + summoner_name + "?api_key=" + this._api_key;
        return (await axios.get(apiCallUrl, {})).data;
    }

    public async getSummonerByPuuid(puuid: String) {
        const apiCallUrl = this.buildRiotBaseUrl() + "/lol/summoner/v4/summoners/by-puuid/" + puuid + "?api_key=" + this._api_key;
        console.log(apiCallUrl);
        return (await axios.get(apiCallUrl, {})).data;
    }

    /* champion-masteries */
    public async getChampionMasteriesBySummonerId(summoner_id: String) {
        const apiCallUrl = this.buildRiotBaseUrl() + "/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summoner_id + "?api_key=" + this._api_key;
        return (await axios.get(apiCallUrl, {})).data;
    }

    public async getChampionMasteryScoresBySummonerId(summoner_id: String) {
        const apiCallUrl = this.buildRiotBaseUrl() + " /lol/champion-mastery/v4/scores/by-summoner/ " + summoner_id + "?api_key=" + this._api_key;
        return (await axios.get(apiCallUrl, {})).data;

    }

    /* helper functions*/
    public async getPuuidBySummonerName(summoner_name: String) {
        return (await this.getSummonerBySummonerName(summoner_name)).puuid;
    }

    public async getSummonerIdBySummonerName(summoner_name: String) {
        return (await this.getSummonerBySummonerName(summoner_name)).id;
    }

    public async getAccountIdBySummonerName(summoner_name: String) {
        return (await this.getSummonerBySummonerName(summoner_name)).accountId;
    }

    public async getChampionMasteriesBySummonerName(summoner_name: String) {
        return (await this.getChampionMasteriesBySummonerId(await this.getSummonerIdBySummonerName(summoner_name)));
    }

    public async getChampionMasteryScoresBySummonerName(summoner_name: String) {
        return (await this.getChampionMasteryScoresBySummonerId(await this.getSummonerIdBySummonerName(summoner_name)));
    }

    public async getMatchesBySummonerName(summoner_name: String) {
        return (await this.getMatchesByPuuid(await this.getPuuidBySummonerName(summoner_name)));
    }

    public async getParticipantsByMatchId(match_id: String) {
        // todo
    }

}