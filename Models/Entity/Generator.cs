using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Models.Entity
{
    public class Generator
    {
        [Key]
        public int Id { get; set; }
        public DateTime LastGen { get; set; }
        public int TotalGen { get; set; }
    }
}
