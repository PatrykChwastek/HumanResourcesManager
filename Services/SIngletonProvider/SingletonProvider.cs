namespace HumanResourcesManager.Services.SIngletonProvider
{
    public class SingletonProvider : ISingletonProvider
    {
        public string[] SeniorityLevels { get; set; }
        public string[] WorkProgress { get; set; }
        public SingletonProvider() {
            SeniorityLevels = new string[] {
                "Junior",
                "Regular",
                "Senior"
            };
            WorkProgress= new string[] {
                "Not Started",
                "In Progress",
                "Completed",
                "Abandoned"
            };
        }
    }
}
