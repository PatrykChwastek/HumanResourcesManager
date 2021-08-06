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
using HumanResourcesManager.Services.PermissionRepo;

namespace HumanResourcesManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionsController : ControllerBase
    {
        private readonly IPermissionRepository _permissionRepository;
        private readonly IMapper _mapper;

        public PermissionsController(IPermissionRepository permissionRepository, IMapper mapper)
        {
            _permissionRepository = permissionRepository;
            _mapper = mapper;
        }

        // GET: api/Permissions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PermissionDTO>>> GetPermissions()
        {
            var permissions = await _permissionRepository.GetPermissions().ToListAsync();
            var mappedPermissions = _mapper.Map<List<PermissionDTO>>(permissions);
            return Ok(mappedPermissions);
        }

        // GET: api/Permissions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PermissionDTO>> GetPermission(long id)
        {
            var permission = await _permissionRepository.GetPermission(id);

            if (permission == null)
            {
                return NotFound();
            }
            return _mapper.Map<PermissionDTO>(permission);
        }

        // PUT: api/Permissions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPermission(long id, [FromBody]PermissionDTO permission)
        {
            if (id != permission.Id)
            {
                return BadRequest();
            }
            var mappedPermission = _mapper.Map<Permission>(permission);
            await _permissionRepository.PutPermission(id, mappedPermission);

            return NoContent();
        }

        // POST: api/Permissions
        [HttpPost]
        public async Task<ActionResult<PermissionDTO>> PostPermission([FromBody]PermissionDTO _permission)
        {
            var mappedPermission = _mapper.Map<Permission>(_permission);
            var permission = await _permissionRepository.CreatePermission(mappedPermission);
            var permissionDTO = _mapper.Map<PermissionDTO>(permission);

            return Created("get", permissionDTO);
        }

        // DELETE: api/Permissions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Permission>> DeletePermission(long id)
        {
            if (await _permissionRepository.DeletePermission(id))
            {
                await _permissionRepository.Save();
                return NoContent();
            }

            return StatusCode(500, "Server Error: permission not exist");
        }
    }
}
