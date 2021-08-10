using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Models.DTO
{
    public class TeamDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public EmployeeDTO TeamLeader { get; set; }
        public ICollection<EmployeeDTO> Members { get; set; }
    }
}
