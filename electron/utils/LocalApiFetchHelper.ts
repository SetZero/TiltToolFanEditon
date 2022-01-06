import ApiDataHelper, { ApiData } from "./ApiDataHelper";
import axios from "axios";

import https from "https";
import { ipcRenderer } from "electron";

export default class LocalApiFetchHelper {
    // https://lcu.vivide.re/
    private apiDataHelper: ApiDataHelper | undefined;

    private constructor() { }

    public static async build(): Promise<LocalApiFetchHelper> {
        const apiFetchHelper = new LocalApiFetchHelper();
        return ApiDataHelper.build()
            .then((e) => apiFetchHelper.apiDataHelper = e)
            .then(() => apiFetchHelper);
    }

    private async buildLocalBaseUrl() {
        const apiData = await this.apiDataHelper?.apiData;
        return apiData?.protocol + "://127.0.0.1:" + apiData?.port + "/";
    }

    public async isUserInLobby() {
        const apiData = await this.apiDataHelper?.apiData;
        const username = "riot";
    }

    public async getCurrentSummoner()
    {
        const apiData = await this.apiDataHelper?.apiData;
        const apiCallUrl = (await this.buildLocalBaseUrl())+"lol-summoner/v1/current-summoner";

        return (await axios.get(apiCallUrl, 
            {
                headers:
                {

                },
                httpsAgent: new https.Agent({rejectUnauthorized: false}),
                auth:
                {
                    username: "riot",
                    password: apiData?.password ?? ''
                }
            }
        )).data;
    }

    public async getRegion()
    {
        const apiData = await this.apiDataHelper?.apiData;
        const apiCallUrl = (await this.buildLocalBaseUrl())+"riotclient/region-locale";

        return (await axios.get(apiCallUrl, 
            {
                headers:
                {

                },
                httpsAgent: new https.Agent({rejectUnauthorized: false}),
                auth:
                {
                    username: "riot",
                    password: apiData?.password ?? ''
                }
            }
        )).data["region"];
    }


}