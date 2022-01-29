export interface DataCache {
    championInfo?: ChampionDataCache;
}

interface ChampionDataCache {
    type: "champion";
    format: string;
    version: string;
    data: Record<string, FullChampionDataCache>;
    keys: Record<string, string>
}

interface FullChampionDataCache {
    id: string;
    key: string;
    name: string;
    tags: Array<string>
    partype: string;
}

export enum Role
{
    Assassin = 0,
    Fighter,
    Mage,
    Marksman,
    Support,
    Tank
}

export interface ChampionInfo
{
    getRolesForChampion: (championId: number) => Role[];
}