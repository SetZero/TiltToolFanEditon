import axios from "axios";
import { createWriteStream, createReadStream, PathLike, writeFile, promises, readFile, existsSync, unlink } from "fs";
import { promisify } from "util";
import * as Path from "path";
import * as zlib from "zlib";
import * as tar from "tar";
import { app } from 'electron';
import { hashElement } from 'folder-hash';

export default class DataDragonHelper {
    private static readonly apiUrl = "https://ddragon.leagueoflegends.com/api/versions.json";
    private static readonly baseUrl = "https://ddragon.leagueoflegends.com/cdn/";
    private static readonly libFolder = app.getPath("userData");
    private static readonly appFolder = Path.join(DataDragonHelper.libFolder, "tiltTool");
    private static readonly extractLocation = Path.join(DataDragonHelper.appFolder, "data")
    private currentVersion = undefined;
    private cachedHashValid: undefined | boolean = undefined;

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

        if (!versionInfo || versionInfo.toString() !== (await this.getLatestVersion()) || !(await this.isCachedHashValid())) {

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
            await new Promise<void>(resolve => writer.on("finish", () => {
                console.log("done");
                resolve();
            }));
            await promisify(writeFile)(versionFile, this.currentVersion);
        }

        let tarLocation = Path.join(DataDragonHelper.appFolder, "tmp.tgz");
        if (existsSync(tarLocation) && !existsSync(Path.join(DataDragonHelper.appFolder, "data")) && !(await this.isCachedHashValid())) {
            await this.extractTarGz(tarLocation,
                DataDragonHelper.extractLocation);

            let hash = await this.dataFolderHash();
            console.log("Hash is: ", hash);
            await promisify(writeFile)(Path.join(DataDragonHelper.appFolder, "hash.txt"), hash.toString());
            await promisify(unlink)(tarLocation);
        }
    }
    async extractTarGz(tarLocation: string, writeLocation: string) {
        console.log("Extracting DataDragon data");
        promises.mkdir(writeLocation, { recursive: true });

        return tar.x({
            file: tarLocation,
            C: writeLocation
        });
    }

    private async getChampionInfo() {
        const response = await axios.get(`${DataDragonHelper.baseUrl}${await this.getLatestVersion()}/data/en_US/champion.json`);
        return response.data;
    }

    private async isCachedHashValid() {
        console.log("comparing hash");
        if ((this.cachedHashValid !== undefined || !existsSync(DataDragonHelper.extractLocation))) return this.cachedHashValid;
        console.log("no short circuit");

        const cachedHash = await promisify(readFile)(Path.join(DataDragonHelper.appFolder, "hash.txt")).catch(() => undefined);
        const localHash = await this.dataFolderHash();
        this.cachedHashValid = localHash.toString() === cachedHash?.toString();
        console.log("is Valid: ", this.cachedHashValid);
        return this.cachedHashValid;
    }

    private async dataFolderHash() {
        return hashElement(DataDragonHelper.extractLocation, {
            folders: { exclude: ["img"] }
        });
    }

    private async getLatestVersion() {
        if (this.currentVersion === undefined) {
            let data = await axios.get(DataDragonHelper.apiUrl);
            this.currentVersion = data.data[0];
        }
        return this.currentVersion;
    }

}