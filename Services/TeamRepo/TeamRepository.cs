using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using HumanResourcesManager.Models.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.TeamRepo
{
    public class TeamRepository : ITeamRepository
    {
        private readonly MDBContext _mDBContext;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ILogger<TeamRepository> _logger;

        public TeamRepository(MDBContext mDBContext, IEmployeeRepository employeeRepository, ILogger<TeamRepository> logger)
        {
            _mDBContext = mDBContext;
            _employeeRepository = employeeRepository;
            _logger = logger;
        }

        public async Task<Team> CreateTeam(Team teamEntity)
        {
            if (teamEntity.TeamLeader == null && teamEntity.Members.Count == 0)
                return null;

            var teamLeaderPerm = await _mDBContext.Permissions.Where(p => p.Name == "Team-Manager").FirstOrDefaultAsync();

            if (!teamEntity.TeamLeader.EmployeePermissions.Any(e => e.Permission == teamLeaderPerm))
            {
                _logger.LogInformation($"Add Team-Manager permission to employee: {teamEntity.TeamLeader.Id}");
                var ep = new EmployeePermissions
                {
                    EmployeeId = teamEntity.TeamLeader.Id,
                    PermissionId = teamLeaderPerm.Id
                };
                _mDBContext.Add(ep);

            }

            _logger.LogInformation($"Creating new Team: {teamEntity.Name}");
            _mDBContext.Teams.Attach(teamEntity);
            await Save();

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

        public IQueryable<Team> GetTeams(string searchBy ,string search)
        {
            return FilterTeam(searchBy,search);
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

        public async Task<Team> SetTeamMembers(long teamID, long[] employeesID)
        {
            var team = await GetTeam(teamID);
            var members = new List<TeamEmployees>();

            foreach (var memberId in employeesID)
            {
                var employee = await _employeeRepository.GetEmployee(memberId);
                
                if (employee != null)
                {
                    var teamEmployees = new TeamEmployees() {
                        TeamId = teamID,
                        Team = team,
                        EmployeeId = memberId,
                        Employee = employee
                    };
                    members.Add(teamEmployees);
                }              
            }
            team.Members = members;
            return await PutTeam(teamID, team);
        }

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }
       
        public async Task<int> AllTeamsCount()
        {
            return await _mDBContext.Teams.CountAsync();
        }

        public async Task<int> TeamsCount(IQueryable<Team> teamQuery)
        {
            return await teamQuery.CountAsync();
        }

        private bool TeamExists(long id)
        {
            return _mDBContext.Teams.Any(p => p.Id == id);
        }
        // need test
        private IQueryable<Team> FilterTeam(string searchBy, string search)
        {
            StringBuilder whereQuery = new StringBuilder("t => t.Id != 0 ");

            if (search != null && searchBy != null)
            {
                search = search.ToLower().TrimEnd();
                switch (searchBy)
                {
                    case "teamName":
                        whereQuery.Append("&& t.Name.ToLower().Contains("+'"'+search+'"'+") ");
                            break;
                    case "leaderName":
                        if (search.Contains(" "))
                        {
                            string[] searchSplited = search.Split(" ");
                            whereQuery.Append("&& t.TeamLeader.Person.Name.ToLower().Contains("+'"'+
                                searchSplited[0] + '"'+ ") && t.TeamLeader.Person.Surname.ToLower().Contains(" + '"'+
                                searchSplited[1] + '"' + ") ");
                            break;
                        }
                        whereQuery.Append("&& t.TeamLeader.Person.Name.ToLower().Contains(" + '"' +
                            search + '"' + ") || t.TeamLeader.Person.Surname.ToLower().Contains(" + '"' +
                            search + '"' + ") ");
                        break;
                    case "memberName":
                        if (search.Contains(" "))
                        {
                            string[] searchSplited = search.Split(" ");
                            whereQuery.Append("&& t.Members.Any(m => m.Employee.Person.Name.ToLower().Contains(" + '"' +
                                searchSplited[0] + '"' + ")) && t.Members.Any(m => m.Employee.Person.Surname.ToLower().Contains(" + '"' +
                                searchSplited[1] + '"' + ")) ");
                            break;
                        }
                        whereQuery.Append("&& t.Members.Any(m => m.Employee.Person.Name.ToLower().Contains(" + '"' +
                            search + '"' + ")) || t.Members.Any(m => m.Employee.Person.Surname.ToLower().Contains(" + '"' +
                            search + '"' + ")) ");
                        break;
                }
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
