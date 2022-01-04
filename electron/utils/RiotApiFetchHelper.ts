import axios from "axios";
import https from "https";
import ApiDataHelper from "./ApiDataHelper";
import RiotApiDataHelper from "./RiotApiDataHelper";

export default class RiotApiFetchHelper 
{
    private riotApiDataHelper : RiotApiDataHelper = new RiotApiDataHelper();

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
}