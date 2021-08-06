using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using AutoMapper;
using HumanResourcesManager.Services.DepartmentRepo;

namespace HumanResourcesManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentRepository _departmentRepo;
        private readonly IMapper _mapper;
        public DepartmentsController(IDepartmentRepository departmentRepository, IMapper autoMapper)
        {
            _departmentRepo = departmentRepository;
            _mapper = autoMapper;
        }

        // GET: api/Departments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDTO>>> GetDepartment()
        {
            var departments = await _departmentRepo.GetDepartments().ToListAsync();
            var mappedDepartments = _mapper.Map<List<DepartmentDTO>>(departments);
            return Ok(mappedDepartments);
        }

        // GET: api/Departments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDTO>> GetDepartment(long id)
        {
            var department = await _departmentRepo.GetDepartment(id);

            if (department == null)
            {
                return NotFound();
            }    
            return  _mapper.Map<DepartmentDTO>(department);
        }

        // PUT: api/Departments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDepartment(long id, [FromBody]DepartmentDTO department)
        {
            if (id != department.Id)
            {
                return BadRequest();
            }
            var mappedDepartment = _mapper.Map<Department>(department);
            await _departmentRepo.PutDepartment(id,mappedDepartment);

            return NoContent();
        }

        // POST: api/Departments
        [HttpPost]
        public async Task<ActionResult<DepartmentDTO>> PostDepartment([FromBody]DepartmentDTO _department)
        {
            var mappedDepartment = _mapper.Map<Department>(_department);
            var department = await _departmentRepo.CreateDepartment(mappedDepartment);
            var departmentDTO = _mapper.Map<DepartmentDTO>(department);

            return Created("get", departmentDTO);
        }

        // DELETE: api/Departments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(long id)
        {
            if (await _departmentRepo.DeleteDepartment(id))
            {
                await _departmentRepo.Save();
                return NoContent();
            }

            return StatusCode(500, "Server Error: department not exist");
        }
    }
}
