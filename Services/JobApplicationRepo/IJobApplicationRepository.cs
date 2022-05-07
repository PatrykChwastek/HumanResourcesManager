using HumanResourcesManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.JobApplicationRepo
{
    public interface IJobApplicationRepository
    {
        Task<bool> Save();
        Task<int> JobApplicationsCount(IQueryable<JobApplication> jobApplications);
        IQueryable<JobApplication> GetJobApplications(long jobOfferId, long positionId);
        Task<JobApplication> GetJobApplication(long id);
        Task<JobApplication> CreateJobApplication(JobApplication jobApplicationEntity);
        Task<JobApplication> PutJobApplication(long id, JobApplication jobApplicationEntity);
        Task<bool> DeleteJobApplication(long id);
    }
}
