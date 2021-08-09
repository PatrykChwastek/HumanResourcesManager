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
            var seniorityLvls = await  _seniorityRepository.GetSenioritis().ToListAsync();
            var mappedSeniorityLvls = _mapper.Map<List<SeniorityDTO>>(seniorityLvls);
            return Ok(mappedSeniorityLvls);
        }

        // GET: api/Seniorities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SeniorityDTO>> GetSeniority(long id)
        {
            var seniorityLvl = await _seniorityRepository.GetSeniority(id);

            if (seniorityLvl == null)
            {
                return NotFound();
            }
            return _mapper.Map<SeniorityDTO>(seniorityLvl);
        }

        // POST: api/Seniorities
        [HttpPost]
        public async Task<ActionResult<SeniorityDTO>> PostSeniority(SeniorityDTO seniority)
        {
            var mappedSeniorityLvl = _mapper.Map<Seniority>(seniority);
            var seniorityLvl = await _seniorityRepository.CreateSeniority(mappedSeniorityLvl);
            var seniorityLvlDTO = _mapper.Map<SeniorityDTO>(seniorityLvl);

            return Created("get", seniorityLvlDTO);
        }

        // DELETE: api/Seniorities/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Seniority>> DeleteSeniority(long id)
        {
            {
                if (await _seniorityRepository.DeleteSeniority(id))
                {
                    await _seniorityRepository.Save();
                    return NoContent();
                }

                return StatusCode(500, "Server Error: seniority not exist");
            }
        }
    }
}
