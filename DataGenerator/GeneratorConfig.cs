using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.DataGenerator
{
    public class GeneratorConfig
    {
        public int TodayTasks { get; set; } = 3;
        public int WeekTasks { get; set; } = 5;
        public int MonthTasks { get; set; } = 4;
        public int Subtasks { get; set; } = 3;

        public int UnassignedEmployees { get; set; } = 6;       
        public int HRTeams { get; set; } = 1;
        public int DevTeams { get; set; } = 3;
        public int ITTeams { get; set; } = 2;
        public int TeamSize { get; set; } = 6;
    }
}
