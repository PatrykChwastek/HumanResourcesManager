namespace HumanResourcesManager.Models
{
    public class EmployeePermissions
    {
        public long EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public long PermissionId { get; set; }
        public Permission Permission { get; set; }
    }
}
