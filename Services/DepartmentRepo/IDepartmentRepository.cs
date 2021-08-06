using HumanResourcesManager.Models;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.DepartmentRepo
{
    public interface IDepartmentRepository
    {
        Task<bool> Save();
        IQueryable<Department> GetDepartments();
        IQueryable<Department> GetDepartments(int limit);
        Task<Department> GetDepartment(long id);
        Task<Department> CreateDepartment(Department departmentEntity);
        Task<Department> PutDepartment(long id, Department departmentEntity);
        Task<bool> DeleteDepartment(long id);
    }
}
