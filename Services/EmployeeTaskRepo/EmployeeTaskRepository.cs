using HumanResourcesManager.Context;
using HumanResourcesManager.Models.Entity;
using HumanResourcesManager.Services.TeamRepo;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.EmployeeTaskRepo
{
    public class EmployeeTaskRepository : IEmployeeTaskRepository
    {
        private readonly MDBContext _mDBContext;
        private readonly ILogger<EmployeeTaskRepository> _logger;
        private readonly ITeamRepository _teamRepository;

        public EmployeeTaskRepository(MDBContext mDBContext, ILogger<EmployeeTaskRepository> logger, ITeamRepository teamRepository)
        {
            _mDBContext = mDBContext;
            _logger = logger;
            _teamRepository = teamRepository;
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
            var task = await _mDBContext.EmployeeTask.Include(et => et.Subtasks).FirstOrDefaultAsync(et => et.Id == id);
            if (task.Deadline > DateTime.Now.Date && task.Status != "Delayed")
            {
               return await changeTaskStatus(task.Id, "Delayed");
            }
            return task;
        }

        public IQueryable<EmployeeTask> GetTasks(
            string taskName, long employeeId, string status, DateTime? bStartTime, DateTime? aStartTime, DateTime? bDeadline, DateTime? aDeadline)
        {
            return FilterTasksAsync(taskName, employeeId, status, bStartTime, aStartTime, bDeadline, aDeadline).OrderBy(et => et.StartTime);
        }

        public IQueryable<EmployeeTask> GetTeamMembersTasks(
            string taskName, long teamId, string status, DateTime? bStartTime, DateTime? aStartTime, DateTime? bDeadline, DateTime? aDeadline)
        {
            var members = _teamRepository.GetTeam(teamId).Result.Members;
            IQueryable<EmployeeTask> res = null;
            foreach (var member in members)
            {               
                var temp = FilterTasksAsync(taskName, member.EmployeeId, status, bStartTime, aStartTime, bDeadline, aDeadline).OrderBy(et => et.StartTime);             

                if (temp != null)
                    {
                        if(res == null)
                        {
                        res = temp;
                        }                
                    res = res.Concat(temp.Where(t => !temp.Contains(t)));
                    }                  
            }
            return res;
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
        public async Task<EmployeeTask> changeTaskStatus(long id, string status)
        {
            EmployeeTask task = await GetTask(id);
            task.Status = status;

            if (task.Subtasks.Count > 0)
            {
                foreach (var subTask in task.Subtasks)
                {
                    subTask.Status = status;
                }
            }

            return await PutTask(id, task);
        }

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }

        public async Task<int> AllTasksCount()
        {
            return await _mDBContext.EmployeeTask.CountAsync();
        }

        public async Task<int> TasksCount(IQueryable<EmployeeTask> employeeTasksQuery)
        {
            return await employeeTasksQuery.CountAsync();
        }

        private bool EmployeeTaskExists(long id)
        {
            return _mDBContext.EmployeeTask.Any(t => t.Id == id);
        }

        private IQueryable<EmployeeTask> FilterTasksAsync(
            string taskName, long employeeId, string status, DateTime? bStartTime, DateTime? aStartTime, DateTime? bDeadline, DateTime? aDeadline)
        {
            StringBuilder whereQuery = new StringBuilder("et => et.Id != 0 ");

            if (taskName != null || taskName == "")
            {
                taskName = taskName.ToLower().TrimEnd();
                 whereQuery.Append("&& et.Name.ToLower().Contains(" +
                        '"' + taskName + '"' + ") ");
            }

            if (employeeId != 0)
                whereQuery.Append("&& et.AssignedEmployeeId == " + employeeId + " ");

            if (status != null || status == "")
                whereQuery.Append("&& et.Status.ToLower().Contains(" +
                        '"' + status.ToLower() + '"' + ") ");

            if (bStartTime != null || aStartTime != null)
            {
                whereQuery.Append(filderTasksBytDate(bStartTime, aStartTime, "StartDate"));
            }

            if (bDeadline !=null || aDeadline !=null)
            {
                whereQuery.Append(filderTasksBytDate(bDeadline, aDeadline, "Deadline"));
            }

            whereQuery.Append("&& et.ParentTaskId == null");
            var query = _mDBContext.EmployeeTask.
                Include(et => et.Subtasks).
                Where(whereQuery.ToString());

          var toChange= query.Where(et => et.Status != "Delayed" && et.Status != "Completed" && et.Deadline !<= DateTime.Now);

            if (toChange.Count() > 0)
            {
                makeDelayed(toChange);
            }
            return query;
        }

        private void makeDelayed(IQueryable<EmployeeTask> query)
        {
            foreach (var item in query)
            {
                item.Status = "Delayed";
                _mDBContext.Entry(item).State = EntityState.Modified;
            }
            _mDBContext.SaveChanges();
        }

        private string filderTasksBytDate(DateTime? beforeDate, DateTime? afterDate, string taskDateType)
        {
            if (beforeDate.HasValue && afterDate.HasValue)
            {
                if (taskDateType == "StartDate")
                {
                    return "&& et.StartTime <= Convert.ToDateTime("+'"'+(DateTime)beforeDate + '"' +")" +
                        " && et.StartTime >= Convert.ToDateTime(" + '"' + (DateTime)afterDate + '"' + ") ";
                }
                return "&& et.Deadline <= Convert.ToDateTime(" + '"' + (DateTime)beforeDate + '"' + ")" +
                    " && et.Deadline >= Convert.ToDateTime(" + '"' + (DateTime)afterDate + '"' + ") ";
            }

            if (beforeDate.HasValue)
            {
                if (taskDateType == "StartDate")
                {
                  return "&& et.StartTime <= Convert.ToDateTime(" + '"' + (DateTime)beforeDate + '"' + ") ";
                }
                return "&& et.Deadline <=  Convert.ToDateTime(" + '"' + (DateTime)beforeDate + '"' + ") ";
            }

            if (afterDate.HasValue)
            {
                if (taskDateType == "StartDate")
                {
                    return " && et.StartTime >= Convert.ToDateTime(" + '"' + (DateTime)afterDate + '"' + ") ";
                }
                return "&& et.Deadline >= Convert.ToDateTime(" + '"' + (DateTime)afterDate + '"' + ") ";
            }
            return "";
        }

    }
}
