using HumanResourcesManager.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.TeamRepo
{
    public interface ITeamRepository
    { 
        Task<bool> Save();
        Task<int> AllTeamsCount();
        Task<int> TeamsCount(IQueryable<Team> teamQuery);
        IQueryable<Team> GetTeams(string searchBy, string search);
        IQueryable<Team> GetTeams(int limit);
        Task<Team> GetTeamsByLeaderId(long leaderID);
        Task<Team> GetTeamsByMemberId(long memberID);
        Task<Team> GetTeam(long id);
        Task<Team> CreateTeam(Team teamEntity);
        Task<Team> PutTeam(long id, Team teamEntity);
        Task<bool> DeleteTeam(long id);
    }
}
