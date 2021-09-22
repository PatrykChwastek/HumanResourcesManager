using System.ComponentModel.DataAnnotations;

namespace HumanResourcesManager.Models.Entity
{
    public class User
    {
        [Key]
        public long Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public long EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }
}
