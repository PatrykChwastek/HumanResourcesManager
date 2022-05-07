using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.JobApplicationRepo
{
    public class JobApplicationRepository : IJobApplicationRepository
    {
        private readonly MDBContext _mDBContext;
        private readonly ILogger<JobApplication> _logger;

        public JobApplicationRepository(MDBContext mDBContext, ILogger<JobApplication> logger)
        {
            _mDBContext = mDBContext;
            _logger = logger;
        }

        public async Task<JobApplication> CreateJobApplication(JobApplication jobApplicationEntity)
        {
            _logger.LogInformation($"Adding new JobAplication jor: {jobApplicationEntity.Position.Name} position");
            jobApplicationEntity.JobOfferId = jobApplicationEntity.JobOffer.Id;
            _mDBContext.Attach(jobApplicationEntity);

            await Save();
            await _mDBContext.Entry(jobApplicationEntity).GetDatabaseValuesAsync();

            return await GetJobApplication(jobApplicationEntity.Id);
        }

        public async Task<bool> DeleteJobApplication(long id)
        {
            var jobApplication = await _mDBContext.JobApplications.FirstOrDefaultAsync(e => e.Id == id);
            if (jobApplication == null)
            {
                _logger.LogError($"JobApplication with ID: {id} cannot be deleted because it does not exist");
                return false;
            }

            _logger.LogInformation($"JobApplication with ID: {id} deleted");
            _mDBContext.JobApplications.Remove(jobApplication);
            return true;
        }

        public async Task<JobApplication> GetJobApplication(long id)
        {
            return await _mDBContext.JobApplications
                .Include(ja => ja.Person)
                .ThenInclude(p => p.EmployeeAddress)
                .Include(ja => ja.Position)
                .FirstOrDefaultAsync(ja => ja.Id == id);
        }

        public IQueryable<JobApplication> GetJobApplications(long jobOfferId, long positionId)
        {
            StringBuilder whereQuery = new StringBuilder("ja => ja.Id != 0 ");

            if (positionId != 0)
                whereQuery.Append("&& ja.Position.Id == " + positionId + " ");
            if (jobOfferId != 0)
                whereQuery.Append("&& ja.JobOfferId == " + jobOfferId + " ");

            return _mDBContext.JobApplications
               .Include(ja => ja.Person)
               .ThenInclude(p => p.EmployeeAddress)
               .Include(ja => ja.Position)
               .Where(whereQuery.ToString());
        }

        public async Task<int> JobApplicationsCount(IQueryable<JobApplication> jobApplications)
        {
            return await jobApplications.CountAsync();
        }

        public async Task<JobApplication> PutJobApplication(long id, JobApplication jobApplicationEntity)
        {
            _mDBContext.Entry(jobApplicationEntity).State = EntityState.Modified;
            try
            {
                await Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobApplicationExists(id))
                {
                    _logger.LogError($"JobAppliication with ID: {id} not exists");
                    return null;
                }
                else
                {
                    throw;
                }
            }
            _logger.LogInformation($"JobAppliication with ID: {id} edited");
            return await GetJobApplication(id);
        }

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }

        private bool JobApplicationExists(long id)
        {
            return _mDBContext.JobApplications.Any(e => e.Id == id);
        }
    }
}
