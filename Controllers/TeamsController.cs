using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HumanResourcesManager.Models.Entity;
using HumanResourcesManager.Services.TeamRepo;
using AutoMapper;
using HumanResourcesManager.Models.DTO;
using HumanResourcesManager.Models;
using HumanResourcesManager.MapperConf;
using Microsoft.AspNetCore.Authorization;

namespace HumanResourcesManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly ITeamRepository _teamRepository;
        private readonly IMapper _mapper;

        public TeamsController(ITeamRepository teamRepository)
        {
            _teamRepository = teamRepository;
            var config = new AutoMapperConfiguration().Configure();

            _mapper = config.CreateMapper();
        }

        // GET: api/Teams
        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Authorize(Roles = "Human-Resources")]
        public async Task<ActionResult<Pagination>> GetTeams(
            int page, int size, string searchby, string search)
        {

                var teams = _teamRepository.GetTeams(searchby, search);
                var mappedTeams = _mapper.Map<List<TeamDTO>>(teams);
                var totalTeams = await _teamRepository.TeamsCount(teams);

                var pageOfTeams = new Pagination(page, size, totalTeams);
                return Ok(await pageOfTeams.InitPagination(mappedTeams.AsQueryable()));

        }

        // GET: api/Teams/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        [Authorize(Roles = "Human-Resources")]
        public async Task<ActionResult<TeamDTO>> GetTeam(long id)
        {
            var team = await _teamRepository.GetTeam(id);
            if (team == null)
            {
                return NotFound();
            }
            var mappedTeam = _mapper.Map<TeamDTO>(team);
            return mappedTeam;
        }

        // GET: api/Teams/leader/1
        [HttpGet("leader/{id}")]
        [Authorize(Roles = "Admin")]
        [Authorize(Roles = "Human-Resources")]
        public async Task<ActionResult<TeamDTO>> GetTeamByLeader(long id)
        {
            var team = await _teamRepository.GetTeamsByLeaderId(id);
            if (team == null)
            {
                return NotFound();
            }
            var mappedTeam = _mapper.Map<TeamDTO>(team);
            return mappedTeam;
        }

        // GET: api/Teams/member/1
        [HttpGet("member/{id}")]
        [Authorize(Roles = "Admin")]
        [Authorize(Roles = "Human-Resources")]
        public async Task<ActionResult<TeamDTO>> GetTeamByMember(long id)
        {
            var team = await _teamRepository.GetTeamsByMemberId(id);
            if (team == null)
            {
                return NotFound();
            }
            var mappedTeam = _mapper.Map<TeamDTO>(team);
            return mappedTeam;
        }

        // PUT: api/Teams/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [Authorize(Roles = "Human-Resources")]
        public async Task<IActionResult> PutTeam(long id, [FromBody]TeamDTO team)
        {
            if (id != team.Id)
                return BadRequest();

            var mappedTeam = _mapper.Map<Team>(team);
            await _teamRepository.PutTeam(id, mappedTeam);

            return NoContent();
        }

        // PUT: api/Teams/add-members/5
        [HttpPut("members/{id}")]
        [Authorize(Roles = "Admin")]
        [Authorize(Roles = "Human-Resources")]
        public async Task<IActionResult> SetTeamMembers(long id, [FromBody] long[] employeesId)
        {
            await _teamRepository.SetTeamMembers(id,employeesId);
            return NoContent();
        }

        // POST: api/Teams
        [HttpPost]
        public async Task<ActionResult<TeamDTO>> PostTeam([FromBody]TeamDTO teamFromReqest)
        {
            var mappedTeam = _mapper.Map<Team>(teamFromReqest);
            var team = await _teamRepository.CreateTeam(mappedTeam);
            var teamDTO = _mapper.Map<TeamDTO>(team);

            return Created("get", teamDTO);
        }

        // DELETE: api/Teams/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [Authorize(Roles = "Human-Resources")]
        public async Task<ActionResult<Team>> DeleteTeam(long id)
        {
            if (await _teamRepository.DeleteTeam(id))
            {
                await _teamRepository.Save();
                return NoContent();
            }

            return StatusCode(500, "Server Error: team not exist");
        }
    }
}
