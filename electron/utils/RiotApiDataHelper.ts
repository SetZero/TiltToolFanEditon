
enum Region {
    BR1 = 'br1.api.riotgames.com',
    EUN1 = 'eun1.api.riotgames.com',
    EUW1 = 'euw1.api.riotgames.com',
    JP1 = 'jp1.api.riotgames.com',
    KR = 'kr.api.riotgames.com',
    LA1 = 'la1.api.riotgames.com',
    LA2 = 'la2.api.riotgames.com',
    NA1 = 'na1.api.riotgames.com',
    OC1 = 'oc1.api.riotgames.com',
    TR1 = 'tr1.api.riotgames.com',
    RU =  'ru.api.riotgames.com',
}

export default class RiotApiDataHelper {
    private _region: Region | undefined = undefined;

    public get region(): Region | undefined {
        return this._region;
    }

    public setRegion(new_region : Region)
    {
        this._region = new_region;
    }

    // TODO: set region using data from LCU

}