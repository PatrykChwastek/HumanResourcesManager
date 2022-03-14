using HumanResourcesManager.Models;
using HumanResourcesManager.Models.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.UserRepo
{
    public interface IUserRepository
    {
        Task<bool> Save();
        Task<int> AllUsersCount();
        Task<int> UsersCount(IQueryable<User> users);
        IQueryable<User> GetUsers(IQueryable<Employee> employees);
        Task<User> GetUser(long id);
        Task<User> Authenticate(string username, string password);
        Task<User> CreateUser(User userEntity);
        Task<User> CreateUser(Employee employeeEntity);
        Task<User> PutUser(long id, User userEntity);
        Task<bool> ChangePassword(long id, string oldPass, string newPass);
        Task<bool> DeleteUser(long id);
    }
}
