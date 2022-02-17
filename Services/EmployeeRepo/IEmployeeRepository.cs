using HumanResourcesManager.Models;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services
{
    public interface IEmployeeRepository
    {
        Task<bool> Save();
        Task<int> EmployeesCount();
        IQueryable<Employee> GetEmployees(
            string order, 
            string search,
            string seniority,
            long department, 
            long position, 
            bool? isremote
        );
        Task<Employee> GetEmployee(long id);
        Task<Employee> CreateEmployee(Employee employeeEntity);
        Task<Employee> PutEmployee(long id,Employee employeeEntity);
        Task<bool> DeleteEmployee(long id);
    }
}
