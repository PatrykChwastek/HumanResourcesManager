using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HumanResourcesManager.Context;
using HumanResourcesManager.Models.Entity;
using HumanResourcesManager.Models.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using HumanResourcesManager.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Options;
using HumanResourcesManager.Services.UserRepo;
using AutoMapper;
using HumanResourcesManager.Models;
using HumanResourcesManager.Services;

namespace HumanResourcesManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppConfiguration _appConfiguration;
        private readonly IUserRepository _userRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IMapper _mapper;

        public UsersController(
            IOptions<AppConfiguration> appConfiguration, 
            IUserRepository userRepository,
            IEmployeeRepository employeeRepository, 
            IMapper mapper)
        {
            _appConfiguration = appConfiguration.Value;
            _userRepository = userRepository;
            _employeeRepository = employeeRepository;
            _mapper = mapper;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> LoginUser([FromBody] User login)
        {
            IActionResult response = Unauthorized();
            var user = await _userRepository.Authenticate(login.Username, login.Password);
            if (user != null)
            {
                var tokenString = GenerateJWTToken(user);
                response = Ok(new
                {
                    token = tokenString,
                    userDetails = _mapper.Map<UserDTO>(user),
                });
            }
        return response;      
    }

        // GET: api/Users
        [Authorize(Roles = "Team-Manager")]
        [HttpGet]
        public async Task<ActionResult<Pagination>> GetUser(
            int page,int size, string order, string search, string seniority, long department, long position, bool? isremote)
        {
            var emps = _employeeRepository.GetEmployees(order, search, seniority, department, position, isremote);
            var users = _userRepository.GetUsers(emps);
            var mappedUsers = _mapper.Map<List<UserDTO>>(users);    
            var totalUsers = await _userRepository.UsersCount(users);

            var pageOfUsers = new Pagination(page, size, totalUsers);
            return Ok(await pageOfUsers.InitPagination(mappedUsers.AsQueryable()));
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(long id)
        {
            var user = await _userRepository.GetUser(id);

            if (user == null)
            {
                return NotFound();
            }
            var mappedUser = _mapper.Map<UserDTO>(user);

            return mappedUser;
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser([FromBody] UserDTO _user)
        {
            var mappedUser = _mapper.Map<User>(_user);
            var user = await _userRepository.CreateUser(mappedUser);
            var userDTO = _mapper.Map<UserDTO>(user);

            return Created("get", userDTO);
        }

        // DELETE: api/Users/5
        //[HttpDelete("{id}")]
        //public async Task<ActionResult<User>> DeleteUser(long id)
        //{
        //    var user = await _context.User.FindAsync(id);
        //    if (user == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.User.Remove(user);
        //    await _context.SaveChangesAsync();

        //    return user;
        //}

        string GenerateJWTToken(User userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appConfiguration.JWTSecret));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);


            List<Claim> claims = new List<Claim>();

            claims.Add(new Claim(JwtRegisteredClaimNames.Sub, userInfo.Username));                    
            foreach (var prem in userInfo.Employee.EmployeePermissions)
            {
                claims.Add(new Claim(ClaimTypes.Role, prem.Permission.Name));
            }
            claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));

            var token = new JwtSecurityToken(
            issuer: "http://localhost:5000",
            audience: "http://localhost:5000",
            claims: claims,
            expires: DateTime.Now.AddMinutes(10),
            signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
