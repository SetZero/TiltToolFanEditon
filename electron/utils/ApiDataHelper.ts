const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs').promises;

export class ApiData {
    pid: number = 0;
    port: number = 0;
    password: string = '';
    protocol: string = '';
}

export default class ApiDataHelper {
    private apiData = new ApiData();

    constructor() {
        exec('wmic PROCESS WHERE "name=\'LeagueClientUx.exe\'" GET commandline', (err: any, stdout: string, stderr: string) => {
            const re = /"(.*?)"/;
            const pathString = stdout.split(re)[1];
            if (pathString !== undefined) {
                const leaguePath = path.dirname();
                const logFile = path.join(leaguePath, "lockfile");
                fs.readFile(logFile, "utf8").then((data: string) => {
                    const leagueData = data.split(":");
                    this.apiData = {
                        pid: +leagueData[1],
                        port: +leagueData[2],
                        password: leagueData[3],
                        protocol: leagueData[4]
                    };
                    console.log(this.apiData);
                });
            }
        });
        /*
            windows:
                wmic PROCESS WHERE "name='LeagueClientUx.exe'" GET commandline
            mac:
                ps -A | grep LeagueClientUx
        */
    }
}