using HumanResourcesManager.Context;
using HumanResourcesManager.Models.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.TeamRepo
{
    public class TeamRepository : ITeamRepository
    {
        private readonly MDBContext _mDBContext;
        private readonly ILogger<TeamRepository> _logger;

        public TeamRepository(MDBContext mDBContext, ILogger<TeamRepository> logger)
        {
            _mDBContext = mDBContext;
            _logger = logger;
        }

        public async Task<Team> CreateTeam(Team teamEntity)
        {
            _logger.LogInformation($"Creating new Team: {teamEntity.Name}");
            _mDBContext.Add(teamEntity);

            await Save();
            await _mDBContext.Entry(teamEntity).GetDatabaseValuesAsync();
            return await GetTeam(teamEntity.Id);
        }

        public async Task<bool> DeleteTeam(long id)
        {
            var team = await _mDBContext.Teams.FirstOrDefaultAsync(t => t.Id == id);
            if (team == null)
            {
                _logger.LogError($"Team with ID: {id} cannot be deleted because it does not exist");
                return false;
            }

            _logger.LogInformation($"Team with ID: {id} deleted");
            _mDBContext.Teams.Remove(team);
            return true;
        }

        public async Task<Team> GetTeam(long id)
        {
           return await _mDBContext.Teams.FirstOrDefaultAsync(t => t.Id == id);
        }

        public IQueryable<Team> GetTeams()
        {
            return _mDBContext.Teams;
        }

        public IQueryable<Team> GetTeams(int limit)
        {
            return _mDBContext.Teams.Take(limit);
        }

        public async Task<Team> PutTeam(long id, Team teamEntity)
        {
            _mDBContext.Entry(teamEntity).State = EntityState.Modified;
            try
            {
                await Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeamExists(id))
                {
                    _logger.LogError($"Team with ID: {id} not exists");
                    return null;
                }
                else
                {
                    throw;
                }
            }
            _logger.LogInformation($"Team with ID: {id} edited");
            return await GetTeam(id);
        }

        private bool TeamExists(long id)
        {
            return _mDBContext.Permissions.Any(p => p.Id == id);
        }

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }

        public async Task<int> TeamsCount()
        {
            return await _mDBContext.Teams.CountAsync();
        }
    }
}
