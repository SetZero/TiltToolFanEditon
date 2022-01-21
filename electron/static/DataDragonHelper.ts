import axios from "axios";
import { createWriteStream, createReadStream, PathLike, writeFile, promises, readFile, existsSync } from "fs";
import * as stream from 'stream';
import { promisify } from "util";
import * as Path from "path";
import * as zlib from "zlib";
import * as tar from "tar-stream";

export default class DataDragonHelper {
    private static readonly apiUrl = "https://ddragon.leagueoflegends.com/api/versions.json";
    private static readonly baseUrl = "https://ddragon.leagueoflegends.com/cdn/";
    private static readonly libFolder = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
    private static readonly appFolder = Path.join(DataDragonHelper.libFolder, "tiltTool");
    private currentVersion = undefined;

    private constructor() {
        promises.mkdir(DataDragonHelper.appFolder, { recursive: true });
    }

    public static async init() {
        const helper = new DataDragonHelper();
        await helper.downloadDataDragonData();
        return helper;
    }

    private async downloadDataDragonData() {
        const versionFile = Path.join(DataDragonHelper.appFolder, "version.txt");
        const versionInfo = await promisify(readFile)(versionFile).catch(() => undefined);
        if (!versionInfo || versionInfo.toString() !== (await this.getLatestVersion())) {

            const ddUrl = `${DataDragonHelper.baseUrl}dragontail-${await this.getLatestVersion()}.tgz`;
            const writerPath = Path.join(DataDragonHelper.appFolder, "tmp.tgz");
            const writer = createWriteStream(writerPath);

            console.log("Downloading DataDragon data, version is: ", await this.getLatestVersion());
            console.log("Downloading DataDragon data, url is: ", ddUrl);
            console.log("Saving DataDragon data to: ", writerPath);

            const response = await axios.get(ddUrl, {
                responseType: 'stream'
            });
            response.data.pipe(writer);

            await promisify(writeFile)(versionFile, this.currentVersion);
        }

        if(await existsSync(Path.join(DataDragonHelper.appFolder, "tmp.tgz"))){
            this.extractTarGz(Path.join(DataDragonHelper.appFolder, "tmp.tgz"));
        }
    }
    async extractTarGz(writerPath: string) {
        console.log("Extracting DataDragon data");
        const reader = createReadStream(writerPath);
        const writer = createWriteStream(Path.join(DataDragonHelper.appFolder, "data"));
        const extract = tar.extract();

        extract.on('entry', function (header, stream, next) {
            stream.on('end', function () {
                next()
                stream.pipe(writer);
                stream.resume()
            })
        });

        extract.on('finish', function () {
            // all entries read
        })

        reader.pipe(zlib.createGunzip()).pipe(extract);
    }

    private async getChampionInfo() {
        const response = await axios.get(`${DataDragonHelper.baseUrl}${await this.getLatestVersion()}/data/en_US/champion.json`);
        return response.data;
    }

    private async getLatestVersion() {
        if (this.currentVersion === undefined) {
            let data = await axios.get(DataDragonHelper.apiUrl);
            this.currentVersion = data.data[0];
        }
        return this.currentVersion;
    }

}