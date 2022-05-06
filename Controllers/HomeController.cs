using HumanResourcesManager.Context;
using HumanResourcesManager.DataGenerator;
using HumanResourcesManager.DataGenerator.Defaults;
using HumanResourcesManager.DataGenerator.EntityGenerators;
using HumanResourcesManager.Models.Entity;
using HumanResourcesManager.Services.SIngletonProvider;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HumanResourcesManager.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly MDBContext _context;
        private readonly ISingletonProvider _singletonProvider;
        public HomeController(MDBContext context, ISingletonProvider singletonProvider)
        {
            _context = context;
            _singletonProvider = singletonProvider;
        }

        [HttpGet]
        [ActionName("generate-tasks")]
        public async Task<ActionResult> GenerateData()
        {
            EmployeeTaskGenerator employeeTaskGenerator = new EmployeeTaskGenerator(_context, _singletonProvider);
            employeeTaskGenerator.ClearData();
            await employeeTaskGenerator.Generate();

            return Ok(employeeTaskGenerator.data.ToArray());
        }

        [HttpGet]
        [ActionName("generate-employees")]
        public async Task<ActionResult> GenerateEmployees()
        {
            EmployeeGenerator employeeGenerator = new EmployeeGenerator(_context, _singletonProvider);
            await employeeGenerator.Generate();

            return Ok(employeeGenerator.data.ToArray());
        }

        [HttpGet]
        [ActionName("generate-teams")]
        public async Task<ActionResult> GenerateTeam()
        {
            EmployeeGenerator employeeGenerator = new EmployeeGenerator(_context, _singletonProvider);
            TeamGenerator teamGenerator = new TeamGenerator(_context, employeeGenerator);
            await teamGenerator.Generate();

            return Ok(teamGenerator.data.ToArray());
        }

        [HttpGet]
        [ActionName("create-defaults")]
        public async Task<ActionResult> CreateDefaults()
        {
            DefaultData defaultData = new DefaultData();
            defaultData.CreateDefaults(_context);

            EmployeeGenerator employeeGenerator = new EmployeeGenerator(_context, _singletonProvider);
            TeamGenerator teamGenerator = new TeamGenerator(_context, employeeGenerator);
            Team[] defaultTeams = await teamGenerator.CreateDefaultTeams();

            return Ok(defaultTeams);
        }

        [HttpGet]
        [ActionName("stats")]
        public ActionResult Get()
        {
            var totalEmployees = _context.Employee.LongCount();
            var totalJobApplications = _context.JobApplications.LongCount();
            var totalRemoteEmployees = _context.Employee.Where(e => e.RemoteWork).LongCount();
            var remoteEmploeesPercentage = (totalRemoteEmployees * 100) / totalEmployees;

            return Ok(new { totalEmployees,totalJobApplications,totalRemoteEmployees, remoteEmploeesPercentage});
        }
    }
}
