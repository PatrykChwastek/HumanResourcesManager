using HumanResourcesManager.Models.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HumanResourcesManager.Models
{
    public class Employee
    {
        [Key]
        public long Id { get; set; }
        public long PersonId { get; set; }
        public Person Person { get; set; }
        public long PositionId { get; set; }
        public Position Position { get; set; }
        public long DepartmentId { get; set; }
        public Department Department { get; set; }
        public DateTime EmploymentDate { get; set; }
        public string Seniority { get; set; }
        public bool RemoteWork { get; set; }
        public ICollection<EmployeePermissions> EmployeePermissions { get; set; }

        public User User { get; set; }
        public ICollection<EmployeeTask> Task { get; set; }
        public Team Team { get; set; }
        public ICollection<TeamEmployees> TeamEmployees { get; set; }

    }
}
