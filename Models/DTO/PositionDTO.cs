using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HumanResourcesManager.Models
{
    public class PositionDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
    }
}
