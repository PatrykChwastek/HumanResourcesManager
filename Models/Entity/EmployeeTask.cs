using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HumanResourcesManager.Models.Entity
{
    public class EmployeeTask
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime Deadline { get; set; }
        public long? ParentTaskId { get; set; }
        public EmployeeTask ParentTask { get; set; }
        public ICollection<EmployeeTask> Subtasks {get;} = new List<EmployeeTask>();
        public long AssignedEmployeeId { get; set; }
        public Employee AssignedEmployee { get; set; }
    }
}
