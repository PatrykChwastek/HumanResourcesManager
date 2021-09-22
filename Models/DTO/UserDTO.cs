
namespace HumanResourcesManager.Models.DTO
{
    public class UserDTO
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public EmployeeDTO EmployeeDTO { get; set; }
    }
}
