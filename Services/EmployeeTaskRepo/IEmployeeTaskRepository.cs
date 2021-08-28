using HumanResourcesManager.Models.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.EmployeeTaskRepo
{
    public interface IEmployeeTaskRepository
    {
        Task<bool> Save();
        IQueryable<EmployeeTask> GetTasks();
        Task<EmployeeTask> GetTask(long id);
        Task<EmployeeTask> CreateTask(EmployeeTask taskEntity);
        Task<EmployeeTask> PutTask(long id, EmployeeTask taskEntity);
        Task<int> TasksCount();
        Task<bool> DeleteTask(long id);
    }
}
