using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.Models
{
    public class EmployeeAddress
    {
        [Key]
        public long Id { get; set; }
        public Person Person { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public string Street { get; set; }
    }
}
