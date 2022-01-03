import ApiDataHelper from "./ApiDataHelper";

export default class ApiFetchHelper {
    // https://lcu.vivide.re/
    private apiDataHelper: ApiDataHelper | undefined;

    private constructor() { }

    public static async build(): Promise<ApiFetchHelper> {
        const apiFetchHelper = new ApiFetchHelper();
        return ApiDataHelper.build()
            .then(() => apiFetchHelper);
    }

    private async buildBaseUrl() {
        const apiData = await this.apiDataHelper?.apiData;
        return apiData?.protocol + "://localhost:" + apiData?.port + "/";
    }

    public async isUserInLobby() {
        const apiData = await this.apiDataHelper?.apiData;
        const username = "riot";

        /*const result = await (await fetch(this.buildBaseUrl() + "lol-lobby/v2/lobby", {
            method: "GET",
            headers: {
                "Authorization": "Basic " + Buffer.from(username + ":" + apiData?.password).toString('base64')
            }
        })).json();

        console.log(result);*/
    }
}