using AutoMapper;
using HumanResourcesManager.Context;
using HumanResourcesManager.MapperConf;
using HumanResourcesManager.Models;
using HumanResourcesManager.Models.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.UserRepo
{
    public class UserRepository : IUserRepository
    {
        private readonly MDBContext _mDBContext;
        private readonly ILogger<UserRepository> _logger;

        public UserRepository(MDBContext mDBContext, ILogger<UserRepository> logger)
        {
            _mDBContext = mDBContext;
            _logger = logger;
        }

        public async Task<User> Authenticate(string username, string password)
        {
            var user = await _mDBContext.User.SingleOrDefaultAsync(x => x.Username == username);
            if (user != null)
            {
                PasswordHasher<User> passwordHasher = new PasswordHasher<User>();
                if (ValidatePassword(user, password, passwordHasher))
                {
                    return await GetUser(user.Id);
                }
            }
            return null;
        }

        private bool ValidatePassword(User user, string password, IPasswordHasher<User> passwordHasher)
        {
            var passwordHash = passwordHasher.HashPassword(user, password);
            return passwordHasher.VerifyHashedPassword(user, passwordHash, password) != PasswordVerificationResult.Failed; 
        }

        private string HashUserPassword(User user)
        {
            PasswordHasher<User> passwordHasher = new PasswordHasher<User>();
            return passwordHasher.HashPassword(user, user.Password);
        }

        private string HashUserPassword(User user, string password)
        {
            PasswordHasher<User> passwordHasher = new PasswordHasher<User>();
            return passwordHasher.HashPassword(user, password);
        }

        public async Task<User> CreateUser(User userEntity)
        {
            _logger.LogInformation($"Creating new User: {userEntity.Username}");
            userEntity.Password = HashUserPassword(userEntity);
            _mDBContext.Add(userEntity);

            await Save();
            await _mDBContext.Entry(userEntity).GetDatabaseValuesAsync();
            return await GetUser(userEntity.Id);
        }

        // Create user with default credentials (surname + first letter of name)
        public async Task<User> CreateUser(Employee employeeeEntity)
        {
            string dedefaultCred = 
                employeeeEntity.Person.Surname + employeeeEntity.Person.Name.Substring(0, 1);
            var user = new User();
            user.Username = dedefaultCred;
            user.Password = HashUserPassword(user, dedefaultCred);
            user.Employee = employeeeEntity;

            _mDBContext.Attach(user);

            await Save();
            await _mDBContext.Entry(user).GetDatabaseValuesAsync();

            _logger.LogInformation($"Creating new User: {user.Username}");
            return await GetUser(user.Id);
        }

            public async Task<bool> DeleteUser(long id)
        {
            var user = await _mDBContext.User.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                _logger.LogError($"USER with ID: {id} cannot be deleted because it does not exist");
                return false;
            }

            _logger.LogInformation($"USER with ID: {id} deleted");
            _mDBContext.User.Remove(user);
            return true;
        }

        public async Task<User> GetUser(long id)
        {
            return await FullUserQuery().FirstOrDefaultAsync(u => u.Id == id);
        }

        public IQueryable<User> GetUsers(IQueryable<Employee> employees)
        {
            if (employees == null)
            {
                return FullUserQuery();
            }
            IQueryable<User> res = null;
            foreach (var employee in employees)
            {
                var temp = FullUserQuery().Where(u => u.Employee.Id == employee.Id);

                if (temp != null)
                {
                    if (res == null)
                        res = temp;
                    else
                        res = res.Concat(temp);
                }
            }
            return res;
        }

        public async Task<User> PutUser(long id, User userEntity)
        {
            _logger.LogInformation($"Edit user with ID: {id}");

            if (!UserExists(id))
            {
                _logger.LogError($"User with ID: {id} not exists");
                return null;
            }

            var userToEdit = await GetUser(id);

            if (userToEdit.Password != userEntity.Password)
            {
                userEntity.Password = HashUserPassword(userEntity);
                _logger.LogInformation($"User: {id} "+"password changed");

            }

            userToEdit.Username = userEntity.Username;
            userToEdit.Password = userEntity.Password;

            userToEdit.Employee.Person.Name = userEntity.Employee.Person.Name;
            userToEdit.Employee.Person.Surname = userEntity.Employee.Person.Surname;
            userToEdit.Employee.Person.Email = userEntity.Employee.Person.Email;
            userToEdit.Employee.Person.PhoneNumber = userEntity.Employee.Person.PhoneNumber;
            userToEdit.Employee.Person.EmployeeAddress.City = userEntity.Employee.Person.EmployeeAddress.City;
            userToEdit.Employee.Person.EmployeeAddress.Street = userEntity.Employee.Person.EmployeeAddress.Street;
            userToEdit.Employee.Person.EmployeeAddress.PostCode = userEntity.Employee.Person.EmployeeAddress.PostCode;
            userToEdit.Employee.Seniority = userEntity.Employee.Seniority;
            userToEdit.Employee.RemoteWork = userEntity.Employee.RemoteWork;
            userToEdit.Employee.EmploymentDate = userEntity.Employee.EmploymentDate;
            userToEdit.Employee.DepartmentId = userEntity.Employee.DepartmentId;
            userToEdit.Employee.PositionId = userEntity.Employee.PositionId;

            if (userToEdit.Employee.EmployeePermissions.Any())
            {
                _mDBContext.EmployeePermissions.RemoveRange(userToEdit.Employee.EmployeePermissions);
                await Save();
            }

            foreach (var per in userEntity.Employee.EmployeePermissions)
            {
                userToEdit.Employee.EmployeePermissions.Add(new EmployeePermissions()
                {
                    EmployeeId = per.EmployeeId,
                    PermissionId = per.PermissionId,
                });
            }
            
            await Save();

            _logger.LogInformation($"User with ID: {id} edited");
            return await GetUser(id);
        }

        private IQueryable<User> FullUserQuery()
        {
            return _mDBContext.User
                .Include(u => u.Employee)
                .ThenInclude(e => e.Person)
                .ThenInclude(p => p.EmployeeAddress)
                .Include(e => e.Employee)
                .ThenInclude(e => e.Position)
                .Include(e => e.Employee)
                .ThenInclude(e => e.Department)
                .Include(e => e.Employee)
                .ThenInclude(e => e.EmployeePermissions)
                .ThenInclude(ep => ep.Permission)
                .Include(e => e.Employee)
                .ThenInclude(e => e.EmployeePermissions)
                .ThenInclude(e => e.Employee);
        }

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }

        public async Task<int> AllUsersCount()
        {
            return await _mDBContext.User.CountAsync();
        }

        public async Task<int> UsersCount(IQueryable<User> users)
        {
            return await users.CountAsync();
        }
        

        private bool UserExists(long id)
        {
            return _mDBContext.User.Any(u => u.Id == id);
        }
    }
}
