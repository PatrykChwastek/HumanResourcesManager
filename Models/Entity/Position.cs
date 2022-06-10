using HumanResourcesManager.Models.Entity;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HumanResourcesManager.Models
{
    public class Position
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; }
        [JsonIgnore]
        public IEnumerable<Employee> Employees { get; set; }
        [JsonIgnore]
        public IEnumerable<JobOffer> JobOffers { get; set; }
        [JsonIgnore]
        public IEnumerable<JobApplication> JobApplications { get; set; }
    }
}
