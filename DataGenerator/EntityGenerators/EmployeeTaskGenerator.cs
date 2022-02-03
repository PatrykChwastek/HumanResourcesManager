using HumanResourcesManager.Context;
using HumanResourcesManager.DataGenerator.DataBags;
using HumanResourcesManager.Models;
using HumanResourcesManager.Models.Entity;
using HumanResourcesManager.Services.SIngletonProvider;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.DataGenerator
{
    public class EmployeeTaskGenerator : DataGenerator<EmployeeTask>
    {   
        private Random RNG = new Random();
        private string[] Statuses;
        private DateTime today = DateTime.Now.Date;
        private readonly TasksDataBag taskDataBag = new TasksDataBag();
        public EmployeeTaskGenerator(MDBContext mDBContext, ISingletonProvider singletonProvider) : base(mDBContext) 
        {
            Statuses = singletonProvider.WorkProgress;
        }

        public async override Task Generate()
        {
            Employee[] employees = _mDBContext.Employee.Include(e => e.EmployeePermissions)
                .ThenInclude(ep => ep.Permission).ToArray();

            foreach (var employee in employees)
            {
                TodayTasks(employee);
                ThisWeekTasks(employee);
                ThisMonthTasks(employee);
            }

           await SaveDataAsync();
        }

        private void TodayTasks(Employee employee)
        {
            GenerateTasks(employee, GeneratorConfig.TodayTasks, today, today);
        }

        private void ThisWeekTasks(Employee employee)
        {
            int days = today.DayOfWeek - DayOfWeek.Monday;
            DateTime weekStart = DateTime.Now.AddDays(-days).Date;
            DateTime weekEnd = weekStart.AddDays(6);

            GenerateTasks(employee, GeneratorConfig.WeekTasks, weekStart, weekEnd);
        }

        private void ThisMonthTasks(Employee employee)
        {
            DateTime monthStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            DateTime monthEnd = new DateTime(today.Year, today.Month,
                              DateTime.DaysInMonth(today.Year, today.Month));

            GenerateTasks(employee, GeneratorConfig.MonthTasks, monthStart, monthEnd);
        }

        private void GenerateTasks(Employee employee,int taskCount, DateTime bStartTime, DateTime aStartTime)
        {
            for (int x = 0; x < RNG.Next(1, taskCount); x++)
            {
                var startTime = RandomDate(bStartTime, aStartTime);

                String status;
                if (startTime < today)
                {
                    status = Statuses[RNG.Next(2,Statuses.Length - 1)];
                }else
                    status = Statuses[RNG.Next(Statuses.Length - 2)];

                EmployeeTask employeeTask = new EmployeeTask()
                {
                    AssignedEmployee = employee,
                    AssignedEmployeeId = employee.Id,
                    Name = TaskNameByPermission(employee),
                    Description = taskDataBag.GenericDescriptions[RNG.Next(taskDataBag.GenericDescriptions.Length)],
                    Status = status,
                    StartTime = startTime,
                    Deadline = startTime.AddDays(RNG.Next(3)),
                };

                var subtasksCount = RNG.Next(GeneratorConfig.Subtasks);

                for (int i = 0; i < subtasksCount; i++)
                {
                    EmployeeTask subtask = new EmployeeTask()
                    {
                        AssignedEmployee = employee,
                        AssignedEmployeeId = employee.Id,
                        Name = taskDataBag.GenericNames[RNG.Next(taskDataBag.GenericNames.Length)],
                        Description = taskDataBag.GenericDescriptions[RNG.Next(taskDataBag.GenericDescriptions.Length)],
                        Status = employeeTask.Status,
                        StartTime = employeeTask.StartTime,
                        Deadline = employeeTask.Deadline
                    };
                    employeeTask.Subtasks.Add(subtask);
                }

                _mDBContext.EmployeeTask.Add(employeeTask);
            }
        }

        private DateTime RandomDate(DateTime from, DateTime to)
        {
            int range = (to - from).Days;
            return from.AddDays(RNG.Next(range));
        }

        private string TaskNameByPermission(Employee employee)
        {
            String taskName="t1";

            foreach (var item in employee.EmployeePermissions)
            {
                switch (item.Permission.Name)
                {
                    case "Human-Resources":
                        taskName = taskDataBag.HRNames[RNG.Next(taskDataBag.HRNames.Length)];
                        break;
                    default:
                        taskName = taskDataBag.GenericNames[RNG.Next(taskDataBag.GenericNames.Length)];
                        break;
                }
            }

            return taskName;
        }
    }
}
