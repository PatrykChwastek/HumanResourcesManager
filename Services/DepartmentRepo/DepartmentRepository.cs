using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.DepartmentRepo
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly MDBContext _mDBContext;
        private readonly ILogger<DepartmentRepository> _logger;

        public DepartmentRepository(MDBContext mDBContext, ILogger<DepartmentRepository> logger)
        {
            _logger = logger;
            _mDBContext = mDBContext;
        }

        public async Task<Department> CreateDepartment(Department departmentEntity)
        {
            _logger.LogInformation($"Creating new Department: {departmentEntity.Name}");
            _mDBContext.Add(departmentEntity);

            await Save();
            await _mDBContext.Entry(departmentEntity).GetDatabaseValuesAsync();
            return await GetDepartment(departmentEntity.Id);
        }

        public async Task<bool> DeleteDepartment(long id)
        {
            var department = await _mDBContext.Department.FirstOrDefaultAsync(e => e.Id == id);
            if (department == null)
            {
                _logger.LogError($"Department with ID: {id} cannot be deleted because it does not exist");
                return false;
            }

            _logger.LogInformation($"Department with ID: {id} deleted");
            _mDBContext.Department.Remove(department);
            return true;
        }

        public async Task<Department> GetDepartment(long id)
        {
            return await _mDBContext.Department.FirstOrDefaultAsync(d => d.Id == id);
        }

        public IQueryable<Department> GetDepartments()
        {
            return _mDBContext.Department;
        }
        public IQueryable<Department> GetDepartments(int limit)
        {
            return _mDBContext.Department.Take(limit);
        }

        public async Task<Department> PutDepartment(long id, Department departmentEntity)
        {
            _mDBContext.Entry(departmentEntity).State = EntityState.Modified;
            try
            {
                await Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartmentExists(id))
                {
                    _logger.LogError($"Department with ID: {id} not exists");
                    return null;
                }
                else
                {
                    throw;
                }
            }
            _logger.LogInformation($"Department with ID: {id} edited");
            return await GetDepartment(id);
        }

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }
        private bool DepartmentExists(long id)
        {
            return _mDBContext.Department.Any(e => e.Id == id);
        }
    }
}
