using HumanResourcesManager.Context;
using HumanResourcesManager.Models.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.EmployeeTaskRepo
{
    public class EmployeeTaskRepository : IEmployeeTaskRepository
    {
        private readonly MDBContext _mDBContext;
        private readonly ILogger<EmployeeTaskRepository> _logger;

        public EmployeeTaskRepository(MDBContext mDBContext, ILogger<EmployeeTaskRepository> logger)
        {
            _mDBContext = mDBContext;
            _logger = logger;
        }

        public async Task<EmployeeTask> CreateTask(EmployeeTask taskEntity)
        {
            _logger.LogInformation($"Creating new EmployeeTask: {taskEntity.Name} Assigned to: {taskEntity.AssignedEmployee}");
            _mDBContext.Add(taskEntity);

            await Save();
            await _mDBContext.Entry(taskEntity).GetDatabaseValuesAsync();
            return await GetTask(taskEntity.Id);
        }

        public async Task<bool> DeleteTask(long id)
        {
            var eTask = await _mDBContext.EmployeeTask.FirstOrDefaultAsync(et => et.Id == id);
            if (eTask == null)
            {
                _logger.LogError($"EmployeeTask with ID: {id} cannot be deleted because it does not exist");
                return false;
            }

            _logger.LogInformation($"EmployeeTask with ID: {id} deleted");
            _mDBContext.EmployeeTask.Remove(eTask);
            return true;
        }

        public async Task<EmployeeTask> GetTask(long id)
        {
            return await _mDBContext.EmployeeTask.FirstOrDefaultAsync(et => et.Id == id);
        }

        public IQueryable<EmployeeTask> GetTasks()
        {
            return _mDBContext.EmployeeTask.Include(et=>et.Subtasks);
        }

        public async Task<EmployeeTask> PutTask(long id, EmployeeTask taskEntity)
        {
            _mDBContext.Entry(taskEntity).State = EntityState.Modified;
            try
            {
                await Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeTaskExists(id))
                {
                    _logger.LogError($"EmployeeTask with ID: {id} not exists");
                    return null;
                }
                else
                {
                    throw;
                }
            }
            _logger.LogInformation($"EmployeeTask with ID: {id} edited");
            return await GetTask(id);
        }

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }

        public async Task<int> TasksCount()
        {
            return await _mDBContext.EmployeeTask.CountAsync();
        }

        private bool EmployeeTaskExists(long id)
        {
            return _mDBContext.EmployeeTask.Any(t => t.Id == id);
        }
    }
}
