using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.DataGenerator.DataBags
{
    public class TasksDataBag
    {
        public string[] GenericNames {get; set;}
        public string[] HRNames { get; set; }
        public string[] GenericDescriptions { get; set; }
        public TasksDataBag()
        {
            GenericNames = new string[]
            {
                "To do...",
                "A task that must be completed",
                "An important thing to do",
                "Normal task at work",
                "An Activity you should remember",
                "Well-named task",
                "Another task with an interesting name",
            };

            HRNames = new string[] {
                "Create new job offer in popular platform",
                ".Net Developer candidates selection",
                "ReactJS candidates selection",
                "Angular Developer candidates selection",
                "Job interview with .Net Dev candidate",
                "Job interview with React Dev candidate",
                "Job interview new IT Support candidate",
                "Job interview with Big Data Dev candidate",
                "Training of employees from IT Support department ",
                "Training of employees from Analytics department ",
                "Conduct benefit analysis",
                "Prepare meeting session",
                "Consider new payment request",
                "Make Audit for Backend Developers",
                "Find a new place to an integration meeting"
            };

            GenericDescriptions = new string[] {
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in mollis metus, nec fermentum ipsum. " +
                "Maecenas dolor dolor, lacinia at quam quis, imperdiet efficitur tellus. Aenean id magna hendrerit, " +
                "pretium urna a, fringilla eros. Donec leo arcu, efficitur ut feugiat a, tristique quis justo. " +
                "Morbi eget lacus volutpat, condimentum ante ut, efficitur dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
                "Nunc consectetur lacinia quam vitae congue. Nullam vitae suscipit nunc.",
                "This is generated task description. It's just a placeholder for presentation purpose. " +
                "Normally here should be details of this task. But from the lack of time to come up with something more appropriate. " +
                "I should write a few more sentences. But I have no idea what would it be. So leave it as it is. "
            };
        }
    }
}
