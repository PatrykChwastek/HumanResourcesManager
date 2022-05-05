using HumanResourcesManager.Context;
using HumanResourcesManager.DataGenerator.DataBags;
using HumanResourcesManager.DataGenerator.Defaults;
using HumanResourcesManager.Models;
using HumanResourcesManager.Models.Entity;
using HumanResourcesManager.Services.SIngletonProvider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.DataGenerator.EntityGenerators
{
    public class EmployeeGenerator : DataGenerator<Employee>
    {
        private Random RNG = new Random();
        private readonly DefaultData defaultData = new DefaultData();
        private readonly PersonDataBag personDataBag = new PersonDataBag();
        private string[] seniorityLevels;
        private Position[] positions;
        private Department[] departments;
        private Permission[] permissions;

        public EmployeeGenerator(MDBContext mDBContext, ISingletonProvider singletonProvider) : base(mDBContext)
        {
            seniorityLevels = singletonProvider.SeniorityLevels;
            positions = _mDBContext.Position.ToArray();
            departments = _mDBContext.Department.ToArray();
            permissions = _mDBContext.Permissions.ToArray();
        }

        public async override Task Generate()
        {
            for (int i = 0; i < GeneratorConfig.UnassignedEmployees; i++)
            {
                GenerateEmployee((EmployeeType)RNG.Next(0,3), false);
            }

            await SaveDataAsync();
        }
         
        public Employee[] createDefaultEmployees()
        {
            User adminUser = new User() {Username="admin", Password= "admin123" };
            User leaderUser = new User() { Username = "leader", Password = "leader123" };
            User hrUser = new User() { Username = "hrmanager", Password = "hr123" };
            User regularUser = new User() { Username = "user", Password = "user123" };


            Employee admminEmployee = new Employee() { 
                Seniority = seniorityLevels[2],
                User = adminUser
            };
            admminEmployee = AdminEmployeeGen(admminEmployee);

            Employee leaderEmployee = new Employee()
            {
                Seniority = seniorityLevels[2],
                User = leaderUser
            };
            leaderEmployee = DevEmployeeGen(leaderEmployee);
            leaderEmployee = LeaderEmployeeGen(leaderEmployee);
            leaderEmployee.Position = positions
                .SingleOrDefault(p => p.Name.Equals(defaultData.DefaultPositions.ProjectManager));

            Employee hrEmployee = new Employee()
            {
                Seniority = seniorityLevels[2],
                User = hrUser
            };
            hrEmployee = HREmployeeGen(hrEmployee);

            Employee regularEmployee = new Employee()
            {
                Seniority = seniorityLevels[1],
                User = regularUser
            };
            regularEmployee = DevEmployeeGen(regularEmployee);

            Employee[] defaultEmployees = new Employee[]{
                admminEmployee,
                leaderEmployee,
                hrEmployee,
                regularEmployee
            };

            for (int i = 0; i < defaultEmployees.Length -1; i++)
            {
                defaultEmployees[i].EmploymentDate = EmploymentDateBySeniority(defaultEmployees[i].Seniority);
                defaultEmployees[i].Person = GeneratePerson();
                defaultEmployees[i].RemoteWork = !defaultEmployees[i].Person.EmployeeAddress.Equals("London");
            }

            return defaultEmployees;
        }

        public Employee GenerateEmployee(EmployeeType type,bool isLeader)
        {            
            Employee employee = new Employee();

            employee.Seniority = seniorityLevels[RNG.Next(seniorityLevels.Length)];
            employee.EmploymentDate = EmploymentDateBySeniority(employee.Seniority);
            employee.Person = GeneratePerson();
            employee.RemoteWork = !employee.Person.EmployeeAddress.Equals("London");

            switch (type)
            {
                case EmployeeType.Admin:
                   employee = AdminEmployeeGen(employee);
                    break;
                case EmployeeType.HumanResources:
                    employee = HREmployeeGen(employee);
                    break;
                case EmployeeType.Software:
                    employee = DevEmployeeGen(employee);
                    break;
                case EmployeeType.ITSupport:
                    employee = SupportEmployeeGen(employee);
                    break;
            }

            if (isLeader)
            {
               employee = LeaderEmployeeGen(employee);
            }

            return employee;
        }

        private Employee AdminEmployeeGen(Employee employee) {
            employee.Department = departments
                .SingleOrDefault(d => d.Name.Equals(defaultData.DefaultDepartments.Maintenance));
            employee.Position = positions
                .SingleOrDefault(p => p.Name.Equals(defaultData.DefaultPositions.SystemAdministrator));

            List<Permission> allowedPermissions = new List<Permission>();
            allowedPermissions.Add(permissions
                .SingleOrDefault(p => p.Name.Equals(defaultData.DefaultPermissions.Admin)));
            allowedPermissions.Add(permissions
                .SingleOrDefault(p => p.Name.Equals(defaultData.DefaultPermissions.HumanResources)));

            List<EmployeePermissions> employeePermissions = new List<EmployeePermissions>();
            foreach (var perm in allowedPermissions)
            {
                employeePermissions.Add(
                    new EmployeePermissions()
                    {
                        Employee = employee,
                        Permission = perm,
                        PermissionId = perm.Id
                    });

            }
            employee.EmployeePermissions = employeePermissions;

            return employee;
        }

        private Employee LeaderEmployeeGen(Employee employee)
        {            
            if (employee.EmployeePermissions is null)
            {
                employee.EmployeePermissions = new List<EmployeePermissions>();
            }

            List<EmployeePermissions> employeePermissions = new List<EmployeePermissions>();
            employeePermissions.AddRange(employee.EmployeePermissions);
            var leaderPermission = permissions
                .SingleOrDefault(p => p.Name.Equals(defaultData.DefaultPermissions.TeamManager));

            employeePermissions.Add(
                new EmployeePermissions(){
                    Employee = employee,
                    Permission = leaderPermission,
                    PermissionId = leaderPermission.Id
                });

            employee.EmployeePermissions = employeePermissions;

            return employee;
        }

            private Employee HREmployeeGen(Employee employee)
        {
            employee.Department = departments
                .SingleOrDefault(d => d.Name.Equals(defaultData.DefaultDepartments.HumanResources));
            employee.Position = positions
                .SingleOrDefault(p => p.Name.Equals(defaultData.DefaultPositions.HumanResourcesManager));

            var hrPermission = permissions
                        .SingleOrDefault(p => p.Name.Equals(defaultData.DefaultPermissions.HumanResources));

            EmployeePermissions[] employeePermissions = new EmployeePermissions[] {                
                new EmployeePermissions()
                {
                    Employee = employee,
                    Permission = hrPermission,
                    PermissionId = hrPermission.Id
                }
            };

            employee.EmployeePermissions = employeePermissions;

            return employee;
        }

        private Employee DevEmployeeGen(Employee employee)
        {
            employee.Department = departments
                .SingleOrDefault(d => d.Name.Equals(defaultData.DefaultDepartments.SoftwareDevelopment));

            var devPositions = positions.Where(p => 
                p.Name == defaultData.DefaultPositions.BackendDeveloper ||
                p.Name == defaultData.DefaultPositions.FrontendDeveloper ||
                p.Name == defaultData.DefaultPositions.FullstackDeveloper).ToArray();

            employee.Position = devPositions[RNG.Next(0, 2)];

            List<Permission> allowedPermissions = new List<Permission>();
            allowedPermissions.AddRange(permissions.Where(p =>
                p.Name == defaultData.DefaultPermissions.MainRepository ||
                p.Name == defaultData.DefaultPermissions.ProductionDatabase ||
                p.Name == defaultData.DefaultPermissions.TestDatabase).ToList());

            List<EmployeePermissions> employeePermissions = new List<EmployeePermissions>();
            foreach (var perm in allowedPermissions)
            {
                employeePermissions.Add(
                    new EmployeePermissions()
                    {
                        Employee = employee,
                        Permission = perm,
                        PermissionId = perm.Id
                    });

            }
            employee.EmployeePermissions = employeePermissions;

            return employee;
        }

        private Employee SupportEmployeeGen(Employee employee)
        {
            employee.Department = departments
                .SingleOrDefault(d => d.Name.Equals(defaultData.DefaultDepartments.ITSupport));
            var devPositions = positions.Where(p =>
                p.Name == defaultData.DefaultPositions.HelpDesk ||
                p.Name == defaultData.DefaultPositions.ITSupervisor ||
                p.Name == defaultData.DefaultPositions.SystemAdministrator).ToArray();

            employee.Position = devPositions[RNG.Next(0, 2)];

            return employee;
        }

        private DateTime EmploymentDateBySeniority(string seniority)
        {
            DateTime date = new DateTime();
            switch (seniority)
            {
                case "Junior":
                    date = RandomDate(
                        new DateTime(
                             DateTime.Now.Year - RNG.Next(0,3),
                             RNG.Next(1, DateTime.Now.Month),
                             RNG.Next(1, DateTime.Now.Day)
                        ));
                    break;
                case "Regular":
                    date = RandomDate(
                        new DateTime(
                             DateTime.Now.Year - RNG.Next(3, 6),
                             RNG.Next(1, 12),
                             RNG.Next(1, 28)
                        ));
                    break;
                case "Senior":
                    date = RandomDate(
                        new DateTime(
                             DateTime.Now.Year - RNG.Next(6, 11),
                             RNG.Next(1, 12),
                             RNG.Next(1, 28)
                        ));
                    break;
            }
            return date;
        }

       private DateTime RandomDate(DateTime from)
        {
            int range = (DateTime.Now - from).Days;
            return from.AddDays(RNG.Next(range));
        }

        private Person GeneratePerson()
        {
            Person person = new Person()
            {
                Name = personDataBag.Names[RNG.Next(personDataBag.Names.Length)],
                Surname = personDataBag.Surnames[RNG.Next(personDataBag.Surnames.Length)],
                PhoneNumber = ($"{RNG.Next(100,999)}-{RNG.Next(100, 999)}-{RNG.Next(100, 999)}"),
                EmployeeAddress= GenerateAddress()
            };
            return GenerateEmail(person);
        }

        private EmployeeAddress GenerateAddress()
        {
            EmployeeAddress employeeAddress = new EmployeeAddress()
            {
                City = personDataBag.Cities[RNG.Next(personDataBag.Cities.Length)],
                Street = personDataBag.Streets[RNG.Next(personDataBag.Streets.Length)] + " " +
                    RNG.Next(1, 99),
            };
            employeeAddress.PostCode =
                ($"{employeeAddress.City.Substring(0, 1)}{RNG.Next(0, 99)} {RNG.Next(0, 9)}{Convert.ToChar(RNG.Next(65, 90))}{Convert.ToChar(RNG.Next(65, 90))}");

            return employeeAddress;
        }

        private Person GenerateEmail(Person person)
        {
            var email = personDataBag.EmailDomains[RNG.Next(personDataBag.EmailDomains.Length)];
            switch (RNG.Next(0, 2))
            {
                case 0 :
                    person.Email = ($"{person.Name}.{person.Surname}{email}");
                    break;
                case 1:
                    person.Email = ($"{person.Surname}.{person.Name}{email}");
                    break;
                case 2:
                    person.Email = ($"{person.Name.Substring(0, 1)}.{person.Surname}{email}");
                    break;
            }

            return person;
        }
    }
}
