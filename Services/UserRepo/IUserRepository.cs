using HumanResourcesManager.Models;
using HumanResourcesManager.Models.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.UserRepo
{
    public interface IUserRepository
    {
        Task<bool> Save();
        Task<int> UsersCount();
        IQueryable<User> GetUsers();
        Task<User> GetUser(long id);
        Task<User> Authenticate(string username, string password);
        Task<User> CreateUser(User userEntity);
        Task<User> CreateUser(Employee employeeEntity);
        Task<User> PutUser(long id, User userEntity);
        Task<bool> DeleteUser(long id);
    }
}
