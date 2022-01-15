import axios from "axios";
import { ClientInfo, SummonerInfo } from "./structs/ClientInfo";

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

    private constructor() {}

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

    private setRegionalRoute()
    {
        switch(this._region)
        {
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

    private buildRegionalRouteBaseUrl()
    {
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
    public async getMatchesByPuuid(puuid: String)
    {
        const apiCallUrl = this.buildRegionalRouteBaseUrl() + "/lol/match/v5/matches/by-puuid/" + puuid + "/ids?api_key=" + this._api_key;
        return (await axios.get(apiCallUrl, {})).data;
    }

    public async getMatchInfoByMatchId(match_id: String)
    {
        const apiCallUrl = this.buildRegionalRouteBaseUrl() + "/lol/match/v5/matches/" + match_id + "?api_key=" + this._api_key;
        return (await axios.get(apiCallUrl, {})).data;
    }

    /* summoner */
    public async getSummonerByAccountId(account_id: String)
    {
        const apiCallUrl = this.buildRiotBaseUrl() + "/lol/summoner/v4/summoners/by-account/" + account_id + "?api_key=" + this._api_key;
        return (await axios.get(apiCallUrl, {})).data;
    }

    public async getSummonerBySummonerName(summoner_name: String)
    {
        const apiCallUrl = this.buildRiotBaseUrl() + "/lol/summoner/v4/summoners/by-name/" + summoner_name + "?api_key=" + this._api_key;
        return (await axios.get(apiCallUrl, {})).data;
    }

    public async getSummonerByPuuid(puuid: String)
    {
        const apiCallUrl = this.buildRiotBaseUrl() + "/lol/summoner/v4/summoners/by-puuid/" + puuid + "?api_key=" + this._api_key;
        console.log(apiCallUrl);
        return (await axios.get(apiCallUrl, {})).data;
    }

    /* champion-masteries */
    public async getChampionMasteriesBySummonerId(summoner_id: String)
    {
        const apiCallUrl = this.buildRiotBaseUrl() + "/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summoner_id + "?api_key=" + this._api_key;
        return (await axios.get(apiCallUrl, {})).data;
    }

    public async getChampionMasteryScoresBySummonerId(summoner_id: String)
    {
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

    public async getChampionMasteriesBySummonerName(summoner_name: String)
    {
        return (await this.getChampionMasteriesBySummonerId(await this.getSummonerIdBySummonerName(summoner_name)));
    }

    public async getChampionMasteryScoresBySummonerName(summoner_name: String)
    {
        return (await this.getChampionMasteryScoresBySummonerId(await this.getSummonerIdBySummonerName(summoner_name)));
    }

    public async getMatchesBySummonerName(summoner_name: String)
    {
        return (await this.getMatchesByPuuid(await this.getPuuidBySummonerName(summoner_name)));
    }

    public async getParticipantsByMatchId(match_id: String)
    {
        // todo
    }
    
}