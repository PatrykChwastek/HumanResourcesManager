using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HumanResourcesManager.Models.Entity
{
    public class Team
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; }
        public long TeamLeaderId  { get; set; }
        public Employee TeamLeader { get; set; }
        public ICollection<TeamEmployees> TeamEmployees { get; set; }
    }
}
