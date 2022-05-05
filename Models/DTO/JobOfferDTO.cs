using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Models.DTO
{
    public class JobOfferDTO
    {
        public long Id { get; set; }
        public DateTime PublishDate { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long PositionId { get; set; }
        public PositionDTO Position { get; set; }
        public int AvailableJobs { get; set; }
    }
}
