
export class PlayerDataProcessUtil
{
    constructor() {}

    /*
    TODO:
        - keep at is and always pass 'playername' and 'playerinfo'?
            OR
        - worker instance for each given player with forwarded 'playerinfo' and 'playername'

        1.) from last 20 matches:
            + get most played champion from last 20 matches (possible)
            + get champion with highest winrate             (possible, only for 20 matches, not much representative)
            + get champion with best K/D/A                  (possible, only for 20 matches, not much representative)
            + win/lose-streak detection

        2.) from overall champion stats
            + get most played champion
            + get champion with highest playtime / championMastery
            + get champion with best K/D/A

        - merge data from 1.) and 2.) into final visualization
        
        - provide data interface for frontend

    */

    

    processPlayerData(playerinfo)
    {

    }

    getMostPlayedChampion(playerinfo, playername)
    {
       
    }

    getChampionName(playerinfo, playername) 
    {
        console.log("== getChampionName ==");
        console.log(playername);
        console.log(playerinfo);
        return playerinfo[playername][0]["championName"];  
    }

    getMostPlayedChampFromRecentlyPlayed(playerinfo, playername)
    {
        console.log("== getMostPlayedChampFromRecentlyPlayed ==");
        let recentChampList = [];
        
        Object.keys(playerinfo[playername]).map((match) => {
            console.log(match);
            recentChampList.push(match["championName"]);
        });
    }

    getChampionImageByChampionId(championid)
    {
        return("datadragon://getmediafile/img/champion/loading/" + championid + "_0.jpg");
    }

    test(playerinfo, playername)
    {
        console.log("== test ==");

        /*** sorting of arrays */
        let list = [];
        [].concat(playerinfo[playername])
        .sort((a,b) => a["champExperience"] > b["champExperience"] ? -1: 1)
        .map((item, i) => list.push(item) );
        console.log(list);

        /*** filtering of arrays */



    }


}