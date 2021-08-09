using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HumanResourcesManager.Context;
using HumanResourcesManager.Models.Entity;
using AutoMapper;
using HumanResourcesManager.Services.SeniorityRepo;
using HumanResourcesManager.Models.DTO;

namespace HumanResourcesManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SenioritiesController : ControllerBase
    {
        private readonly ISeniorityRepository _seniorityRepository;
        private readonly IMapper _mapper;

        public SenioritiesController(ISeniorityRepository seniorityRepository, IMapper autoMapper)
        {
            _seniorityRepository = seniorityRepository;
            _mapper = autoMapper;
        }

        // GET: api/Seniorities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SeniorityDTO>>> GetSeniority()
        {
            var departments = await _departmentRepo.GetDepartments().ToListAsync();
            var mappedDepartments = _mapper.Map<List<DepartmentDTO>>(departments);
            return Ok(mappedDepartments);
        }

        // GET: api/Seniorities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Seniority>> GetSeniority(long id)
        {
            var seniority = await _context.Seniority.FindAsync(id);

            if (seniority == null)
            {
                return NotFound();
            }

            return seniority;
        }

        // PUT: api/Seniorities/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSeniority(long id, Seniority seniority)
        {
            if (id != seniority.Id)
            {
                return BadRequest();
            }

            _context.Entry(seniority).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeniorityExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Seniorities
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Seniority>> PostSeniority(Seniority seniority)
        {
            _context.Seniority.Add(seniority);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSeniority", new { id = seniority.Id }, seniority);
        }

        // DELETE: api/Seniorities/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Seniority>> DeleteSeniority(long id)
        {
            var seniority = await _context.Seniority.FindAsync(id);
            if (seniority == null)
            {
                return NotFound();
            }

            _context.Seniority.Remove(seniority);
            await _context.SaveChangesAsync();

            return seniority;
        }

        private bool SeniorityExists(long id)
        {
            return _context.Seniority.Any(e => e.Id == id);
        }
    }
}
