namespace HumanResourcesManager.Models.Entity
{
    public class TeamEmployees
    {
        public long TeamId { get; set; }
        public Team Team { get; set; }
        public long EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }
}
