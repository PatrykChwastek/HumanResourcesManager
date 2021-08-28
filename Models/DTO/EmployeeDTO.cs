using System;
using System.Collections.Generic;

namespace HumanResourcesManager.Models
{
    public class EmployeeDTO
    {
        public long Id { get; set; }        
        public DateTime EmploymentDate { get; set; }
        public bool RemoteWork { get; set; }
        public PersonDTO Person { get; set; }
        public PositionDTO Position { get; set; }
        public DepartmentDTO Department { get; set; }
        public string Seniority { get; set; }
        public ICollection<PermissionDTO> Permissions { get; set; }
    }
}
