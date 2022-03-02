using HumanResourcesManager.Context;
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
            _mDBContext.Attach(userEntity);

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
                .ThenInclude(ep => ep.Permission);
        }

        public async Task<User> PutUser(long id, User userEntity)
        {
            _mDBContext.Entry(userEntity).State = EntityState.Modified;
            try
            {
                await Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    _logger.LogError($"User with ID: {id} not exists");
                    return null;
                }
                else
                {
                    throw;
                }
            }
            _logger.LogInformation($"User with ID: {id} edited");
            return await GetUser(id);
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
