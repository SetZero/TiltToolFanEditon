const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs').promises;
const os = require("process").platform;
const crypto = require('crypto');

export class ApiData {
    hash: string = '';
    pid: number = 0;
    port: number = 0;
    password: string = '';
    protocol: string = '';
}

export default class ApiDataHelper {
    private _apiData = new ApiData();

    constructor() {
        this.apiDataHasChanged().then(() => this.updateApiData());
    }

    public get apiData(): ApiData {
        return this._apiData;
    }

    public async apiDataHasChanged(): Promise<void> {
        return await this.getPid() !== this.apiData.pid || this.apiData.hash !== await this.getApiDataHashFromLockfile() ?
            Promise.resolve() :
            Promise.reject();
    }

    private getPid(): Promise<number> {
        return new Promise((resolve, reject) => {
            exec('wmic PROCESS WHERE "name=\'LeagueClientUx.exe\'" GET ProcessId', (err: any, stdout: string, stderr: string) => {
                resolve(+stdout.split("\n")[1]);
            });
        });
    }

    private async getApiDataHashFromLockfile(): Promise<string> {
        const lockfileData = await this.getLockfileData();
        return this.getApiDataHash(lockfileData);
    }

    private async getApiDataHash(lockfileData: string): Promise<string> {
        const hashSum = crypto.createHash('sha256');
        hashSum.update(lockfileData);
        return hashSum.digest('hex');
    }

    private getLockfileData(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (os !== "win32") reject(new Error("OS not supported"));

            exec('wmic PROCESS WHERE "name=\'LeagueClientUx.exe\'" GET ExecutablePath', (err: any, stdout: string, stderr: string) => {
                const pathString = stdout.split("\n")[1];
                if (pathString !== undefined) {
                    const leaguePath = path.dirname(pathString);
                    const logFile = path.join(leaguePath, "lockfile");
                    fs.readFile(logFile, "utf8").then((data: string) => {
                        resolve(data);
                    });
                } else {
                    reject(new Error("Could not find LeagueClientUx.exe"));
                }
            });
        });
    }

    public async updateApiData(): Promise<ApiData> {
        const lockfileData = await this.getLockfileData();
        const hash = await this.getApiDataHash(lockfileData);

        const leagueData = lockfileData.split(":");
        this._apiData = {
            hash: hash,
            pid: +leagueData[1],
            port: +leagueData[2],
            password: leagueData[3],
            protocol: leagueData[4]
        };
        console.log(this.apiData);
        return this.apiData;
    }
}