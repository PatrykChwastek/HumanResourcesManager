using System;
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
                var totalEmployeeTask = await _employeeTaskRepository.TasksCount();

                var pageOfTasks = new Pagination(page, size, totalEmployeeTask);
                return Ok(await pageOfTasks.InitPagination(mappedEmployeeTasks.AsQueryable()));

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
    }
}
