import axios from "axios";
import { ipcMain, ipcRenderer } from "electron";
import https from "https";
import ApiDataHelper from "./ApiDataHelper";
import LocalApiFetchHelper from "./LocalApiFetchHelper";
import RiotApiDataHelper from "./RiotApiDataHelper";

//https://developer.riotgames.com/apis

var riot_api_key = process.env.REACT_APP_API_KEY;

export default class RiotApiFetchHelper 
{
    private riotApiDataHelper : RiotApiDataHelper = new RiotApiDataHelper();

    private constructor() { }

    public static async build() : Promise<RiotApiFetchHelper>
    {
        const riotApiFetchHelper = new RiotApiFetchHelper();
        await riotApiFetchHelper.init();
        console.log("wooopwooopooooooooooooooooooooo");
        return riotApiFetchHelper;
    }

    private async init()
    {
        console.log(ipcRenderer);
        console.log(await ipcRenderer.invoke('riotclient', {cmd: 'region-locale', method:'GET'}))
        console.log("-------------------------------ASDF2");
        this.riotApiDataHelper.setRegion(await ipcRenderer.invoke('riotclient', {cmd: 'region-locale', method:'GET'}));
        console.log("+++++++++++++++++++++++++++++++ASDF3");
        console.log(this.riotApiDataHelper.region);
        console.log("...............................ASDF3");
    }

    private buildRiotBaseUrl() 
    {
        return "https://" + this.riotApiDataHelper.region;
    }

    public async getChampionInfo()
    {
        // todo
        const apiCallUrl = (await this.buildRiotBaseUrl())+"";

        return (await axios.get(apiCallUrl, {})).data;
    }

    public async test()
    {
        const apiCallUrl = (await this.buildRiotBaseUrl())+"/lol/summoner/v4/summoners/me"+process.env.REACT_APP_API_KEY;
        console.log(apiCallUrl);
        

        return (await axios.get(apiCallUrl, {})).data;
    }
}