using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using System.Linq.Dynamic.Core;
using HumanResourcesManager.Services;
using AutoMapper;
using HumanResourcesManager.MapperConf;

namespace HumanResourcesManager.Controllers
{
    [Route("api/employee/[action]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IMapper _mapper;

        public EmployeesController(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
            var config = new AutoMapperConfiguration().Configure();

            _mapper = config.CreateMapper();
        }

        // GET: employee/all
        [HttpGet]
        [ActionName("all")]
        public async Task<ActionResult<Pagination>> GetEmployee(
            int page,int size, string order, string search, long department, long position, bool? isremote)
        {
            try
            {
                var employees = _employeeRepository.GetEmployees(order, search, department, position, isremote);
                var mappedEmployees =_mapper.Map<List<EmployeeDTO> >(employees);
                var totalEmployees = await _employeeRepository.EmployeesCount();

                var pageOfEmployees = new Pagination(page, size, totalEmployees);
                return Ok(await pageOfEmployees.InitPagination(employees));
            }
            catch (Exception)
            {
                return StatusCode(500, "Server Error");
            }     
        }


        [HttpGet("{id}")]
        [ActionName("get")]
        public async Task<ActionResult<EmployeeDTO>> GetEmployee(long id)
        {
            var employee = await _employeeRepository.GetEmployee(id);
            if (employee == null)
            {
                return NotFound();
            }
            var mappedEmployee = _mapper.Map<EmployeeDTO>(employee);
            return mappedEmployee;
        }

        [HttpPut("{id}")]
        [ActionName("put")]
        public async Task<IActionResult> PutEmployee(long id, [FromBody]EmployeeDTO employee)
        {
            if (id != employee.Id)
            {
                return BadRequest();
            }
            var mappedEmployee = _mapper.Map<Employee>(employee);
            await _employeeRepository.PutEmployee(id, mappedEmployee);

            return NoContent();
        }
       
        [HttpPost]
        [ActionName("create")]
        public async Task<ActionResult<EmployeeDTO>> PostEmployee([FromBody]EmployeeDTO _employee)
        {
            var mappedEmployee = _mapper.Map<Employee>(_employee);
            var employee= await _employeeRepository.CreateEmployee(mappedEmployee);
            var employeeDTO = _mapper.Map<EmployeeDTO>(employee);

            return Created("get", employeeDTO); 
        }

        [HttpDelete("{id}")]
        [ActionName("delete")]
        public async Task<IActionResult> DeleteEmployee(long id)
        {
            if (await _employeeRepository.DeleteEmployee(id))
            {
               await _employeeRepository.Save();
               return NoContent();
            }

            return StatusCode(500, "Server Error: employee not exist");
        }
    }
}
