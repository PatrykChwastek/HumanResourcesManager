using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using HumanResourcesManager.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.DataGenerator.EntityGenerators
{
    public class TeamGenerator : DataGenerator<Team>
    {
        private Random RNG = new Random();
        private EmployeeGenerator _EmployeeGenerator;

        public TeamGenerator(MDBContext mDBContext, EmployeeGenerator employeeGenerator) : base(mDBContext)
        {
            _EmployeeGenerator = employeeGenerator;
        }

        public override async Task Generate()
        {
            List<Team> teams = new List<Team>();

            for (int i = 0; i < GeneratorConfig.HRTeams; i++)
            {
                var teamName = "Main HR";
                if (i !=0)
                {
                    teamName = "";
                }
                teams.Add(TeamGen(EmployeeType.HumanResources, teamName));
            }

            var devTeamSize = RNG.Next(GeneratorConfig.DevTeams);
            for (int i = 0; i < devTeamSize; i++)
            {
                var teamName = "Soft Devs";
                if (i != 0)
                {
                    teamName = "";
                }
                teams.Add(TeamGen(EmployeeType.Software, teamName));
            }

            var ITTeamSize = RNG.Next(GeneratorConfig.ITTeams);
            for (int i = 0; i < ITTeamSize; i++)
            {
                var teamName = "IT Support";
                if (i != 0)
                {
                    teamName = "";
                }
                teams.Add(TeamGen(EmployeeType.ITSupport, teamName));
            }

            await _mDBContext.AddRangeAsync(teams);
            await SaveDataAsync();
        }

        public async Task<Team[]> CreateDefaultTeams()
        {
            // defaultEmployees[0]=admin, defaultEmployees[1]=devLeader, defaultEmployees[3]=devRegular
            var defaultEmployees = _EmployeeGenerator.createDefaultEmployees();

            Team adminTeam = new Team();
            adminTeam.Members = new List<TeamEmployees>();
            adminTeam.Name = "Alpha";
            adminTeam.TeamLeader = defaultEmployees[0];
            for (int i = 0; i < 3; i++)
            {
                adminTeam.Members.Add(new TeamEmployees()
                {
                    Team = adminTeam,
                    Employee = _EmployeeGenerator.GenerateEmployee(EmployeeType.ITSupport, false)
                });
            }

            Team devTeam = new Team();
            devTeam.Members = new List<TeamEmployees>();
            devTeam.Name = "Main Devs";
            devTeam.TeamLeader = defaultEmployees[1];
            for (int i = 0; i < 3; i++)
            {
                adminTeam.Members.Add(new TeamEmployees()
                {
                    Team = devTeam,
                    Employee = _EmployeeGenerator.GenerateEmployee(EmployeeType.Software, false)
                });
            }
            devTeam.Members.Add(new TeamEmployees()
            {
                Team = devTeam,
                Employee = defaultEmployees[3]
            });

            Team[] defaultTeams = new Team[] { adminTeam, devTeam };

            await _mDBContext.AddRangeAsync(defaultTeams);
            await SaveDataAsync();
            await _mDBContext.Entry(defaultTeams[0]).GetDatabaseValuesAsync();
            await _mDBContext.Entry(defaultTeams[1]).GetDatabaseValuesAsync();
            
            return defaultTeams;
        }

        private Team TeamGen(EmployeeType teamType, string teamName)
        {            
            Team team = new Team();
            team.Members = new List<TeamEmployees>();
            team.TeamLeader = _EmployeeGenerator.GenerateEmployee(teamType, true);


            var teamSize = RNG.Next(2, GeneratorConfig.TeamSize);
            for (int i = 0; i < teamSize; i++)
            {
                team.Members.Add(new TeamEmployees()
                {
                    Team = team,
                    Employee = _EmployeeGenerator.GenerateEmployee(teamType, false)
                });
            }

            if (teamName == null || teamName == "")
            {
                team.Name = team.TeamLeader.Person.Surname + " Team";
                return team;
            }

            team.Name = teamName;
            return team;
        }
    }
}
