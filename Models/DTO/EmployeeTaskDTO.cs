using System;
using System.Collections.Generic;

namespace HumanResourcesManager.Models.DTO
{
    public class EmployeeTaskDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime Deadline { get; set; }
        public long? ParentTaskId { get; set; }
        public ICollection<EmployeeTaskDTO> Subtasks { get; set; }
        public long AssignedEmployeeId { get; set; }
    }
}
