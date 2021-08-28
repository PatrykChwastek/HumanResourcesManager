using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Services.SIngletonProvider
{
    public interface ISingletonProvider
    {
        public string[] SeniorityLevels { get; set; }
        public string[] WorkProgress { get; set; }
    }
}
