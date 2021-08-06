using System.ComponentModel.DataAnnotations;

namespace HumanResourcesManager.Models
{
    public class Person
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public long EmployeeAddressId { get; set; }
        public EmployeeAddress EmployeeAddress {get; set;}
        public Employee Employee { get; set; }
    }
}
