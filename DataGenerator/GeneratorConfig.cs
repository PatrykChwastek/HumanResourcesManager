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
    }
}
