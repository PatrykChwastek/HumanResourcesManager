using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HumanResourcesManager.Models.Entity
{
    public class Seniority
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; }
        [JsonIgnore]
        public IEnumerable<Employee> Employees { get; set; }
    }
}
