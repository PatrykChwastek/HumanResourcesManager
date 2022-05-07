using HumanResourcesManager.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.JobOfferRepo
{
    public interface IJobOfferRepository
    {
        Task<bool> Save();
        IQueryable<JobOffer> GetJobOffers(string name, long positionId);
        Task<JobOffer> GetJobOffer(long id);
        Task<JobOffer> CreateJobOffer(JobOffer jobOfferEntity);
        Task<JobOffer> PutJobOffer(long id, JobOffer jobOfferEntity);
        Task<bool> DeleteJobOffer(long id);
    }
}
