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

var riot_api_key = process.env.REACT_APP_API_KEY;

export default class RiotApiFetchHelper {
    private _region: Region | undefined = undefined;

    public get region(): Region | undefined {
        return this._region;
    }

    public set region(region: Region | undefined) {
        this._region = region;
    }

    //private _riotApiDataHelper : RiotApiDataHelper = new RiotApiDataHelper();
    private _clientInfo: ClientInfo | undefined;

    private constructor() { }

    public static async build(clientInfo: ClientInfo): Promise<RiotApiFetchHelper> {
        const riotApiFetchHelper = new RiotApiFetchHelper();
        riotApiFetchHelper._clientInfo = clientInfo;
        riotApiFetchHelper.region = riotApiFetchHelper._clientInfo.region;
        console.log(riotApiFetchHelper.region);
        return riotApiFetchHelper;
    }

    public async getSummonerInfo(summoners: Array<String>) {
        let s = new Array<SummonerInfo>();
        s.push({})

        return s;
    }


    private buildRiotBaseUrl() {
        return "https://" + this.region;
    }

    public async getChampionInfo() {
        // todo
        const apiCallUrl = (await this.buildRiotBaseUrl()) + "";

        return (await axios.get(apiCallUrl, {})).data;
    }

    public async test(rpi_key: String | undefined) {
        const name = "asdf"
        const apiCallUrl = (await this.buildRiotBaseUrl()) + "/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + rpi_key;
        console.log(apiCallUrl);

        console.log(process.env.REACT_APP_API_KEY);

        return (await axios.get(apiCallUrl, {})).data;
    }
}