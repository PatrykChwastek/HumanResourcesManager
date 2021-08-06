using Newtonsoft.Json;
using System.Collections.Generic;

namespace HumanResourcesManager.Models
{
    public class Permission
    {
        public long Id { get; set; }
        public string Name { get; set; }
        [JsonIgnore]
        public ICollection<EmployeePermissions> EmployeePermissions { get; set; }
    }
}
