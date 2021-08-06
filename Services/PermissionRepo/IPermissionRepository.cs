using HumanResourcesManager.Models;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.PermissionRepo
{
    public interface IPermissionRepository
    {
        Task<bool> Save();
        IQueryable<Permission> GetPermissions();
        IQueryable<Permission> GetPermissions(int limit);
        Task<Permission> GetPermission(long id);
        Task<Permission> CreatePermission(Permission permissionEntity);
        Task<Permission> PutPermission(long id, Permission permissionEntity);
        Task<bool> DeletePermission(long id);
    }
}
