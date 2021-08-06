using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HumanResourcesManager.Models
{
    public class Department
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public IEnumerable<Employee> Employees { get; set; }
    }
}
