using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Models.DTO
{
    public class EmployeeTasksMultipleDTO
    {
        public EmployeeTaskDTO EmployeeTaskDTO { get; set; }
        public int[] EmployeesID { get; set; }
    }
}
