using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Configuration
{
    public class AppConfiguration
    {
        public string JWTSecret { get; set; }
        public DateTime LastTasksGen { get; set; }
    }
}
