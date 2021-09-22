using HumanResourcesManager.Models.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.UserRepo
{
    interface IUserRepository
    {
        Task<bool> Save();
        Task<int> UsersCount();
        IQueryable<User> GetUsers();
        Task<User> GetUser(long id);
        Task<User> CreateUser(User userEntity);
        Task<User> PutUser(long id, User userEntity);
        Task<bool> DeleteUser(long id);
    }
}
