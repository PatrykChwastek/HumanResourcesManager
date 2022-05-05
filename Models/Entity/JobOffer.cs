using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Models.Entity
{
    public class JobOffer
    {
        [Key]
        public long Id { get; set; }
        public DateTime PublishDate { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long PositionId { get; set; }
        public Position Position { get; set; }
        public int AvailableJobs { get; set; }

        public ICollection<JobApplication> JobApplications { get; set; }
    }
}
