using HumanResourcesManager.Models;using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.PositionRepo
{
    public interface IPositionRepository
    {
        Task<bool> Save();
        IQueryable<Position> GetPositions();
        IQueryable<Position> GetPositions(int limit);
        Task<Position> GetPosition(long id);
        Task<Position> CreatePosition(Position positionEntity);
        Task<Position> PutPosition(long id, Position positionEntity);
        Task<bool> DeletePosition(long id);
    }
}
