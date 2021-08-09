using HumanResourcesManager.Context;
using HumanResourcesManager.Models.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.SeniorityRepo
{
    public class SeniorityRepository : ISeniorityRepository
    {
        private readonly MDBContext _mDBContext;
        private readonly ILogger<SeniorityRepository> _logger;

        public SeniorityRepository(MDBContext mDBContext, ILogger<SeniorityRepository> logger)
        {
            _logger = logger;
            _mDBContext = mDBContext;
        }

        public async Task<Seniority> CreateSeniority(Seniority seniorityEntity)
        {
            _logger.LogInformation($"Creating new Seniority level: {seniorityEntity.Name}");
            _mDBContext.Add(seniorityEntity);

            await Save();
            await _mDBContext.Entry(seniorityEntity).GetDatabaseValuesAsync();
            return await GetSeniority(seniorityEntity.Id);
        }

        public async Task<bool> DeleteSeniority(long id)
        {
            var seniority = await _mDBContext.Seniority.FirstOrDefaultAsync(s => s.Id == id);
            if (seniority == null)
            {
                _logger.LogError($"Seniority with ID: {id} cannot be deleted because it does not exist");
                return false;
            }

            _logger.LogInformation($"Seniority with ID: {id} deleted");
            _mDBContext.Seniority.Remove(seniority);
            return true;
        }

        public IQueryable<Seniority> GetSenioritis()
        {
            return _mDBContext.Seniority;
        }

        public async Task<Seniority> GetSeniority(long id)
        {
            return await _mDBContext.Seniority.FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }
    }
}
