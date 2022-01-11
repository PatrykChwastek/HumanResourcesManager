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
                "Requested",
                "In-Progress",
                "Completed",
                "Abandoned"
            };
        }
    }
}
