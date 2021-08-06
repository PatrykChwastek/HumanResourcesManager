using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.PositionRepo
{
    public class PositionRepository : IPositionRepository
    {
        private readonly MDBContext _mDBContext;
        private readonly ILogger<PositionRepository> _logger;

        public PositionRepository(MDBContext mDBContext, ILogger<PositionRepository> logger)
        {
            _logger = logger;
            _mDBContext = mDBContext;
        }

        public async Task<Position> CreatePosition(Position positionEntity)
        {
            _logger.LogInformation($"Creating new Position: {positionEntity.Name}");
            _mDBContext.Add(positionEntity);

            await Save();
            await _mDBContext.Entry(positionEntity).GetDatabaseValuesAsync();
            return await GetPosition(positionEntity.Id);
        }

        public async Task<bool> DeletePosition(long id)
        {
            var position = await _mDBContext.Position.FirstOrDefaultAsync(p => p.Id == id);
            if (position == null)
            {
                _logger.LogError($"Position with ID: {id} cannot be deleted because it does not exist");
                return false;
            }

            _logger.LogInformation($"Position with ID: {id} deleted");
            _mDBContext.Position.Remove(position);
            return true;
        }

        public async Task<Position> GetPosition(long id)
        {
            return await _mDBContext.Position.FirstOrDefaultAsync(e => e.Id == id);
        }

        public IQueryable<Position> GetPositions()
        {
            return _mDBContext.Position;
        }

        public IQueryable<Position> GetPositions(int limit)
        {
            return _mDBContext.Position.Take(limit);
        }

        public async Task<Position> PutPosition(long id, Position positionEntity)
        {
            _mDBContext.Entry(positionEntity).State = EntityState.Modified;
            try
            {
                await Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PositionExists(id))
                {
                    _logger.LogError($"Position with ID: {id} not exists");
                    return null;
                }
                else
                {
                    throw;
                }
            }
            _logger.LogInformation($"Position with ID: {id} edited");
            return await GetPosition(id);
        }

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }

        private bool PositionExists(long id)
        {
            return _mDBContext.Position.Any(e => e.Id == id);
        }
    }
}
