using HumanResourcesManager.Context;
using HumanResourcesManager.Models.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.JobOfferRepo
{
    public class JobOfferRepository : IJobOfferRepository
    {
        private readonly MDBContext _mDBContext;
        private readonly ILogger<JobOfferRepository> _logger;

        public JobOfferRepository(MDBContext mDBContext, ILogger<JobOfferRepository> logger)
        {
            _mDBContext = mDBContext;
            _logger = logger;
        }

        public async Task<JobOffer> CreateJobOffer(JobOffer jobOfferEntity)
        {
            _logger.LogInformation($"Creating new JobOffer: {jobOfferEntity.Name}");
            _mDBContext.Add(jobOfferEntity);

            await Save();
            await _mDBContext.Entry(jobOfferEntity).GetDatabaseValuesAsync();
            return await GetJobOffer(jobOfferEntity.Id);
        }

        public async Task<bool> DeleteJobOffer(long id)
        {
            var jobOffer = await _mDBContext.JobOffers.FirstOrDefaultAsync(e => e.Id == id);
            if (jobOffer == null)
            {
                _logger.LogError($"JobOffer with ID: {id} cannot be deleted because it does not exist");
                return false;
            }
            _mDBContext.JobOffers.Remove(jobOffer);
            _logger.LogInformation($"JobOffer with ID: {id} deleted");
            return true;
        }

        public async Task<JobOffer> GetJobOffer(long id)
        {
            return await _mDBContext.JobOffers.Include(jo => jo.Position).FirstOrDefaultAsync(jo => jo.Id == id);
        }

        public IQueryable<JobOffer> GetJobOffers(string name, long positionId)
        {
            StringBuilder whereQuery = new StringBuilder("jo => jo.Id != 0 ");

            if (positionId != 0)
                whereQuery.Append("&& jo.Position.Id == " + positionId + " ");

            if (name != null || name.Equals(""))
            {
                whereQuery.Append("&& jo.Name.ToLower().Contains(" +
                        '"' + name + '"' + ") ");
            }

            return _mDBContext.JobOffers.Include(jo => jo.Position).Where(whereQuery.ToString());           
        }

        public async Task<JobOffer> PutJobOffer(long id, JobOffer jobOfferEntity)
        {
            _mDBContext.Entry(jobOfferEntity).State = EntityState.Modified;
            try
            {
                await Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobOfferExists(id))
                {
                    _logger.LogError($"Department with ID: {id} not exists");
                    return null;
                }
                else
                {
                    throw;
                }
            }
            _logger.LogInformation($"Department with ID: {id} edited");
            return await GetDepartment(id);
        }

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }

        private bool JobOfferExists(long id)
        {
            return _mDBContext.Department.Any(e => e.Id == id);
        }
    }
}
