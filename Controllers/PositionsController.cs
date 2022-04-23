using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using AutoMapper;
using HumanResourcesManager.Services.PositionRepo;
using Microsoft.AspNetCore.Authorization;

namespace HumanResourcesManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PositionsController : ControllerBase
    {
        private readonly IPositionRepository _positionRepository;
        private readonly IMapper _mapper;

        public PositionsController(IPositionRepository positionRepository, IMapper autoMapper)
        {
            _positionRepository = positionRepository;
            _mapper = autoMapper;
        }

        // GET: api/Positions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PositionDTO>>> GetPosition()
        {
            var positions = await _positionRepository.GetPositions().ToListAsync();
            var mappedPositions= _mapper.Map<List<PositionDTO>>(positions);
            return Ok(mappedPositions);
        }

        // GET: api/Positions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PositionDTO>> GetPosition(long id)
        {
            var position = await _positionRepository.GetPosition(id);

            if (position == null)
            {
                return NotFound();
            }
            return _mapper.Map<PositionDTO>(position);
        }

        // PUT: api/Positions/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [Authorize(Roles = "Human-Resources")]
        public async Task<IActionResult> PutPosition(long id, PositionDTO position)
        {
            if (id != position.Id)
            {
                return BadRequest();
            }
            var mappedPosition = _mapper.Map<Position>(position);
            await _positionRepository.PutPosition(id, mappedPosition);

            return NoContent();
        }

        // POST: api/Positions
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Authorize(Roles = "Human-Resources")]
        public async Task<ActionResult<Position>> PostPosition([FromBody]PositionDTO _position)
        {
            var mappedPosition = _mapper.Map<Position>(_position);
            var position = await _positionRepository.CreatePosition(mappedPosition);
            var positionDTO = _mapper.Map<PositionDTO>(position);

            return Created("get", positionDTO);
        }

        // DELETE: api/Positions/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [Authorize(Roles = "Human-Resources")]
        public async Task<IActionResult> DeletePosition(long id)
        {
            if (await _positionRepository.DeletePosition(id))
            {
                await _positionRepository.Save();
                return NoContent();
            }

            return StatusCode(500, "Server Error: position not exist");
        }
    }
}
