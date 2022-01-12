using HumanResourcesManager.Models.Entity;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.EmployeeTaskRepo
{
    public interface IEmployeeTaskRepository
    {
        Task<bool> Save();
        IQueryable<EmployeeTask> GetTasks(
            string taskName, long employeeId, string status, DateTime? bStartTime, DateTime? aStartTime, DateTime? bDeadline, DateTime? aDeadline);
        Task<EmployeeTask> GetTask(long id);
        Task<EmployeeTask> CreateTask(EmployeeTask taskEntity);
        Task<EmployeeTask> PutTask(long id, EmployeeTask taskEntity);
        Task<EmployeeTask> changeTaskStatus(long id, string status);
        Task<int> TasksCount();
        Task<bool> DeleteTask(long id);
    }
}
