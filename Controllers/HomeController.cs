﻿using HumanResourcesManager.Context;
using HumanResourcesManager.DataGenerator;
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
        [ActionName("generate")]
        public async Task<ActionResult> GenerateData()
        {
            EmployeeTaskGenerator employeeTaskGenerator = new EmployeeTaskGenerator(_context, _singletonProvider);
            employeeTaskGenerator.ClearData();
            await employeeTaskGenerator.Generate();
          

            return Ok(employeeTaskGenerator.data);
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
