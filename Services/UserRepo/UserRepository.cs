using HumanResourcesManager.Context;
using HumanResourcesManager.Models.Entity;
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

        public async Task<User> CreateUser(User userEntity)
        {
            _logger.LogInformation($"Creating new User: {userEntity.Username}");
            _mDBContext.Attach(userEntity);

            await Save();
            await _mDBContext.Entry(userEntity).GetDatabaseValuesAsync();
            return await GetUser(userEntity.Id);
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
            return await _mDBContext.User.FirstOrDefaultAsync(u => u.Id == id);
        }

        public IQueryable<User> GetUsers()
        {
            return _mDBContext.User;
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

        public async Task<int> UsersCount()
        {
            return await _mDBContext.User.CountAsync();
        }

        private bool UserExists(long id)
        {
            return _mDBContext.User.Any(u => u.Id == id);
        }
    }
}
