using HumanResourcesManager.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.SeniorityRepo
{
    public interface ISeniorityRepository
    {
        Task<bool> Save();
        IQueryable<Seniority> GetSenioritis();
        Task<Seniority> GetSeniority(long id);
        Task<Seniority> CreateSeniority(Seniority seniorityEntity);
        Task<bool> DeleteSeniority(long id);
    }
}
