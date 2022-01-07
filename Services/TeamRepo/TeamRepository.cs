using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using HumanResourcesManager.Models.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
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
            if (teamEntity.TeamLeader == null && teamEntity.Members.Count == 0)
                return null;
            _logger.LogInformation($"Creating new Team: {teamEntity.Name}");
            _mDBContext.Attach(teamEntity);

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
            return await fullTeamQuery().FirstOrDefaultAsync(t => t.Id == id);
        }

        public IQueryable<Team> GetTeams()
        {
            return fullTeamQuery();
        }

        public IQueryable<Team> GetTeams(int limit)
        {
            return fullTeamQuery().Take(limit);
        }

        public async Task<Team> GetTeamsByLeaderId(long leaderID)
        {
            return await fullTeamQuery().FirstOrDefaultAsync(t => t.TeamLeaderId == leaderID);
        }

        public async Task<Team> GetTeamsByMemberId(long memberID)
        {
            return await fullTeamQuery().Where(t => t.Members.Any(m => m.EmployeeId == memberID))
                .FirstOrDefaultAsync(t => t.Id != 0);
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

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }

        public async Task<int> TeamsCount()
        {
            return await _mDBContext.Teams.CountAsync();
        }

        private bool TeamExists(long id)
        {
            return _mDBContext.Permissions.Any(p => p.Id == id);
        }
        // need test
        private IQueryable<Team> FilterTeam(string search, long department, long position, bool? isremote)
        {
            StringBuilder whereQuery = new StringBuilder("t => t.Members.Select(e => e.Employee.Id != 0 &&");

            if (department != 0)
                whereQuery.Append("&& e.Department.Id == " + department + " ");

            if (position != 0)
                whereQuery.Append("&& e.Position.Id == " + position + " ");

            if (isremote != null)
                whereQuery.Append("&& e.RemoteWork == " + isremote + " ");

            if (search != null)
            {
                search = search.ToLower().TrimEnd();
                if (search.Contains(" "))
                {
                    string[] searchSplited = search.Split(" ");
                    whereQuery.Append("&& e.Person.Name.ToLower().Contains(" +
                        '"' + searchSplited[0] + '"' + ") && e.Person.Surname.ToLower().Contains(" +
                         '"' + searchSplited[1] + '"' + ") ");
                }
                else
                    whereQuery.Append("&& e.Person.Name.ToLower().Contains(" +
                        '"' + search + '"' + ") || e.Person.Surname.ToLower().Contains(" +
                         '"' + search + '"' + ") ");
            }

            var query = fullTeamQuery()
            .Where(whereQuery.ToString());

            return query;
        }        

        private IQueryable<Team> fullTeamQuery() {
            return _mDBContext.Teams
                .Include(t => t.TeamLeader)
                .ThenInclude(e => e.Person)
                .ThenInclude(e => e.EmployeeAddress)
                .Include(t => t.TeamLeader)
                .ThenInclude(e => e.Position)
                .Include(t => t.TeamLeader)
                .ThenInclude(e => e.Department)
                .Include(t => t.TeamLeader)
                .ThenInclude(e => e.EmployeePermissions)
                .ThenInclude(ep => ep.Permission)
                .Include(t => t.Members)
                .ThenInclude(e => e.Employee)
                .ThenInclude(e => e.Person)
                .ThenInclude(e => e.EmployeeAddress)
                .Include(t => t.Members)
                .ThenInclude(e => e.Employee)
                .ThenInclude(e => e.Position)
                .Include(t => t.Members)
                .ThenInclude(e => e.Employee)
                .ThenInclude(e => e.Department)
                .Include(t => t.Members)
                .ThenInclude(e => e.Employee)
                .ThenInclude(e => e.EmployeePermissions)
                .ThenInclude(ep => ep.Permission);
        }
    }
}
