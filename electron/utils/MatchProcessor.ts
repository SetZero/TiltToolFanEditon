import { MatchParticipant } from "./RiotApiFetchHelper";
import math, { Matrix } from "mathjs";


enum Role
{
    Assassin = 0,
    Fighter,
    Mage,
    Marksman,
    Support,
    Tank
}

interface ChampionInfo
{
    getRolesForChampion: (championId: number) => Role[];
}

interface RoleProcessor
{ 
    processRole: (match: MatchParticipant)=>number;
}  

class AssassinRoleProcessor implements RoleProcessor
{
    processRole(match: MatchParticipant) : number
    {
        console.log("AssassinRoleProcessor.processRole()");
        return (match.kills + match.assists) / (match.deaths || 1);
    }

}

class FigherRollProcessor implements RoleProcessor
{
    processRole(match: MatchParticipant) : number
    {
        console.log("FigherRollProcessor.processRole()");
        return (match.kills + match.assists) / (match.deaths || 1);
    }

}

class MageRoleProcessor implements RoleProcessor
{
    processRole(match: MatchParticipant) : number
    {
        console.log("MageRoleProcessor.processRole()");
        return (match.kills + match.assists) / (match.deaths || 1);
    }

}
class MarksmanRoleProcessor implements RoleProcessor
{
    processRole(match: MatchParticipant) : number
    {
        console.log("MarksmanRoleProcessor.processRole()");
        return (match.kills + match.assists) / (match.deaths || 1);
    }

}

class SupportRoleProcessor implements RoleProcessor
{
    processRole(match: MatchParticipant) : number
    {
        console.log("SupportRoleProcessor.processRole()");
        return (match.kills + match.assists) / (match.deaths || 1);
    }

}

class TankRoleProcessor implements RoleProcessor
{
    processRole(match: MatchParticipant) : number
    {
        console.log("TankRoleProcessor.processRole()");
        return (match.kills + match.assists) / (match.deaths || 1);
    }

}


interface PositionProcessor
{


}


export default class MatchProcessor {

    private readonly _championInfo : ChampionInfo;
    private static readonly roleProcessors : Map<Role, RoleProcessor> = new Map([
        [Role.Assassin, new AssassinRoleProcessor()],
        [Role.Fighter, new FigherRollProcessor()],
        [Role.Mage, new MageRoleProcessor()],
        [Role.Marksman, new MarksmanRoleProcessor()],
        [Role.Support, new SupportRoleProcessor()],
        [Role.Tank, new TankRoleProcessor()]
    ]);

    constructor(championInfo : ChampionInfo) 
    {
        this._championInfo = championInfo;
    }


    groupBy(list: MatchParticipant[]) : Record<number, MatchParticipant[]>
    {
        return list.reduce((result : any , currentValue : any) : any => {

            let r : Record<number, MatchParticipant[]> = result as Record<number, MatchParticipant[]> || {};

            r[currentValue.championId] = r[currentValue.championId] || [];
            
            r[currentValue.championId].push(currentValue);

            return r;
        }) as unknown as Record<number, MatchParticipant[]>;

    }

    private process(matches: MatchParticipant[])
    {
        // group data by champion
        let championList = this.groupBy(matches);


        // {"lee": [Matchparticipant, Matchparticipant]}

        console.log(championList);

      for( let [championId, matchList] of Object.entries(championList))
      {
        // run processor by roles
        this.processRole(matchList, this._championInfo.getRolesForChampion(parseInt(championId)));


      }

    }

    private processPosition(match: MatchParticipant)
    {

    }

    private processRole(matchList: MatchParticipant[], roles : Role[]) : Matrix
    {   
        let resultMatrix = math.matrix([]);

        for( let role of roles)
        {
            let processor = MatchProcessor.roleProcessors.get(role);

            for(let match of matchList)
            {
               resultMatrix.set([role], processor?.processRole(match));
            }

            // TODO: calc median

        }

        return resultMatrix;
    }
 
}


