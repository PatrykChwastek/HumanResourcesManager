using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.PermissionRepo
{
    public class PermissionRepository : IPermissionRepository
    {
        private readonly MDBContext _mDBContext;
        private readonly ILogger<PermissionRepository> _logger;

        public PermissionRepository(MDBContext mDBContext, ILogger<PermissionRepository> logger)
        {
            _logger = logger;
            _mDBContext = mDBContext;
        }

        public async Task<Permission> CreatePermission(Permission permissionEntity)
        {
            _logger.LogInformation($"Creating new Permission: {permissionEntity.Name}");
            _mDBContext.Add(permissionEntity);

            await Save();
            await _mDBContext.Entry(permissionEntity).GetDatabaseValuesAsync();
            return await GetPermission(permissionEntity.Id);
        }

        public async Task<bool> DeletePermission(long id)
        {
            var permission = await _mDBContext.Permissions.FirstOrDefaultAsync(p => p.Id == id);
            if (permission == null)
            {
                _logger.LogError($"Permission with ID: {id} cannot be deleted because it does not exist");
                return false;
            }

            _logger.LogInformation($"Permission with ID: {id} deleted");
            _mDBContext.Permissions.Remove(permission);
            return true;
        }
        public async Task<Permission> GetPermission(long id)
        {
            return await _mDBContext.Permissions.FirstOrDefaultAsync(p => p.Id == id);
        }

        public IQueryable<Permission> GetPermissions()
        {
            return _mDBContext.Permissions;
        }

        public IQueryable<Permission> GetPermissions(int limit)
        {
            return _mDBContext.Permissions.Take(limit);
        }

        public async Task<Permission> PutPermission(long id, Permission permissionEntity)
        {
            _mDBContext.Entry(permissionEntity).State = EntityState.Modified;
            try
            {
                await Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PermissionExists(id))
                {
                    _logger.LogError($"Permission with ID: {id} not exists");
                    return null;
                }
                else
                {
                    throw;
                }
            }
            _logger.LogInformation($"Permission with ID: {id} edited");
            return await GetPermission(id);
        }

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }

        private bool PermissionExists(long id)
        {
            return _mDBContext.Permissions.Any(p => p.Id == id);
        }
    }
}
