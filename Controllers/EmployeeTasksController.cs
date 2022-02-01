﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using HumanResourcesManager.Models.DTO;
using HumanResourcesManager.Models;
using HumanResourcesManager.Services.EmployeeTaskRepo;
using HumanResourcesManager.Models.Entity;
using HumanResourcesManager.MapperConf;

namespace HumanResourcesManager.Controllers
{
    [Route("api/tasks")]
    [ApiController]
    public class EmployeeTasksController : ControllerBase
    {
        private readonly IEmployeeTaskRepository _employeeTaskRepository;
        private readonly IMapper _mapper;

        public EmployeeTasksController(IEmployeeTaskRepository employeeTaskRepository, IMapper mapper)
        {
            _employeeTaskRepository = employeeTaskRepository;
            _mapper = mapper;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeTaskDTO>>> GetEmployeeTasks(
            int page, int size, string name, long employeeid, string status, 
            DateTime? b_start_time, DateTime? a_start_time, DateTime? b_deadline, DateTime? a_deadline)
        {

                var employeeTasks= _employeeTaskRepository.
                GetTasks(name, employeeid, status, b_start_time, a_start_time, b_deadline, a_deadline);
                var mappedEmployeeTasks = _mapper.Map<List<EmployeeTaskDTO>>(employeeTasks);
                var totalEmployeeTask = await _employeeTaskRepository.TasksCount(employeeTasks);

                var pageOfTasks = new Pagination(page, size, totalEmployeeTask);
                return Ok(await pageOfTasks.InitPagination(mappedEmployeeTasks.AsQueryable()));

        }

        [HttpGet("byteam")]
        public async Task<ActionResult<IEnumerable<EmployeeTaskDTO>>> GetTeaamMemberseTasks(
            int page, int size, string name, long teamid, string status,
            DateTime? b_start_time, DateTime? a_start_time, DateTime? b_deadline, DateTime? a_deadline)
         {

            var employeeTasks = _employeeTaskRepository.
            GetTeamMembersTasks(name, teamid, status, b_start_time, a_start_time, b_deadline, a_deadline);
            var mappedEmployeeTasks = _mapper.Map<List<EmployeeTaskDTO>>(employeeTasks);
            var totalEmployeeTask = await _employeeTaskRepository.TasksCount(employeeTasks);

            var pageOfTasks = new Pagination(page, size, totalEmployeeTask);
            return Ok(await pageOfTasks.InitPagination(mappedEmployeeTasks.AsQueryable()));
        }

        [HttpGet("stats")]
        public async Task<ActionResult<IEnumerable<EmployeeTaskDTO>>> GetTasksStats(long teamid, long employeeid)
        {
            if (teamid == 0 && employeeid == 0)
                return BadRequest("Team ID or Eployee ID required");

            DateTime today = DateTime.Now.Date;
            int days = today.DayOfWeek - DayOfWeek.Monday;
            DateTime weekStart = DateTime.Now.AddDays(-days).Date;
            DateTime weekEnd = weekStart.AddDays(6);

            DateTime monthStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            DateTime monthEnd = new DateTime(today.Year, today.Month,
                              DateTime.DaysInMonth(today.Year, today.Month));

           var todayCompleted = 0;
           var todayProgress = 0;
           var todayRequested = 0;

           var weekCompleted = 0;
           var weekProgress = 0;
           var weekRequested = 0;

           var monthCompleted = 0;
           var monthProgress = 0;
           var monthRequested = 0;
           var totalDelayedTasks = 0;

            var todayTasks = TasksByDate(teamid, employeeid, today, today);
            foreach (var t in todayTasks)
            {
                switch (t.Status)
                {
                    case "Completed":
                        todayCompleted += 1;
                        break;
                    case "Requested":
                        todayRequested += 1;
                        break;
                    case "In-Progress":
                        todayProgress += 1;
                        break;
                }
            }

            var weekTasks = TasksByDate(teamid, employeeid, weekEnd, weekStart);
            foreach (var t in weekTasks)
            {
                switch (t.Status)
                {
                    case "Completed":
                        weekCompleted += 1;
                        break;
                    case "Requested":
                        weekRequested += 1;
                        break;
                    case "In-Progress":
                        weekProgress += 1;
                        break;
                }
            }

            var monthTasks = TasksByDate(teamid, employeeid, monthEnd, monthStart);
            foreach (var t in monthTasks)
            {
                switch (t.Status)
                {
                    case "Completed":
                        monthCompleted += 1;
                        break;
                    case "Requested":
                        monthRequested += 1;
                        break;
                    case "In-Progress":
                        monthProgress += 1;
                        break;
                }
            }
            var delayedTasks = TasksByDate(teamid, employeeid, null, null);
            totalDelayedTasks = await _employeeTaskRepository.TasksCount(delayedTasks);

            var todayTotal = await _employeeTaskRepository.TasksCount(todayTasks);
            var weekTotal = await _employeeTaskRepository.TasksCount(weekTasks);
            var monthTotal = await _employeeTaskRepository.TasksCount(monthTasks);

            return Ok(new {
                todayCompleted,
                todayProgress,
                todayRequested,
                todayTotal,
                weekCompleted,
                weekProgress,
                weekRequested,
                weekTotal,
                monthCompleted,
                monthProgress,
                monthRequested,
                monthTotal,
                totalDelayedTasks
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeTaskDTO>> GetTask(long id)
        {
            var employeeTask = await _employeeTaskRepository.GetTask(id);
            if (employeeTask == null)
            {
                return NotFound();
            }
            var mappedEmployeeTask = _mapper.Map<EmployeeTaskDTO>(employeeTask);
            return mappedEmployeeTask;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(long id, [FromBody]EmployeeTaskDTO employeeTask)
        {
            if (id != employeeTask.Id)
                return BadRequest();

            var mappedEmployeeTask = _mapper.Map<EmployeeTask>(employeeTask);
            await _employeeTaskRepository.PutTask(id, mappedEmployeeTask);

            return NoContent();
        }

        [HttpPut]
        public async Task<ActionResult<EmployeeTaskDTO>> ChangeTaskStatus(long id, string status)
        {
            var employeeTask = await _employeeTaskRepository.changeTaskStatus(id,status);
            if (employeeTask == null)
            {
                return NotFound();
            }
            var mappedEmployeeTask = _mapper.Map<EmployeeTaskDTO>(employeeTask);
            return mappedEmployeeTask;
        }

        [HttpPost]
        public async Task<ActionResult<EmployeeTaskDTO>> PostTask([FromBody]EmployeeTaskDTO employeeTaskFromReqest)
        {
            var mappedTask = _mapper.Map<EmployeeTask>(employeeTaskFromReqest);
            var task = await _employeeTaskRepository.CreateTask(mappedTask);
            var taskDTO = _mapper.Map<EmployeeTaskDTO>(task);

            return Created("get", taskDTO);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<EmployeeTask>> DeleteTask(long id)
        {
            if (await _employeeTaskRepository.DeleteTask(id))
            {
                await _employeeTaskRepository.Save();
                return NoContent();
            }

            return StatusCode(500, "Server Error: EmployeeTask not exist");
        }


        private IQueryable<EmployeeTask> TasksByDate(long teamId, long employeeId, DateTime? b_startTime, DateTime? a_startTime)
        {
            IQueryable<EmployeeTask> employeeTasks;
            if (teamId != 0)
            {
               return employeeTasks = _employeeTaskRepository.
                GetTeamMembersTasks(null, teamId, null, b_startTime, a_startTime, null, null);
            }
            return employeeTasks = _employeeTaskRepository.
                GetTasks(null, employeeId, null, b_startTime, a_startTime, null, null);
        }
    }
}
