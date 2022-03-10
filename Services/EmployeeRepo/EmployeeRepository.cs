using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using HumanResourcesManager.Services.UserRepo;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HumanResourcesManager.Services.EmployeeRepo
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly MDBContext _mDBContext;
        private readonly ILogger<EmployeeRepository> _logger;
        private readonly IUserRepository _userRepository;

        public EmployeeRepository(MDBContext mDBContext, ILogger<EmployeeRepository> logger, IUserRepository userRepository )
        {
            _logger = logger;
            _mDBContext = mDBContext;
            _userRepository = userRepository;
        }
        public async Task<Employee> CreateEmployee(Employee employeeEntity)
        {
            _logger.LogInformation($"Adding new Employee: {employeeEntity.Person.Surname}");
            _mDBContext.Attach(employeeEntity);
        
            await Save();
            await _mDBContext.Entry(employeeEntity).GetDatabaseValuesAsync();
            await _userRepository.CreateUser(employeeEntity);
            return await GetEmployee(employeeEntity.Id);
        }

        public async Task<bool> DeleteEmployee(long id)
        {
            var employee = await _mDBContext.Employee.FirstOrDefaultAsync(e => e.Id == id);
            if (employee == null)
            {
                _logger.LogError($"Employee with ID: {id} cannot be deleted because it does not exist");
                return false;
            }

            _logger.LogInformation($"Employee with ID: {id} deleted");
            _mDBContext.Employee.Remove(employee);
            return true;
        }

        public async Task<int> AllEmployeesCount()
        {
            int res = await _mDBContext.Employee.CountAsync();
            return res;
        }

        public async Task<int> EmployeesCount(IQueryable<Employee> employeesQuery)
        {
            return await employeesQuery.CountAsync();
        }

        public async Task<Employee> GetEmployee(long id)
        {
            var employee = await _mDBContext.Employee
                .Include(e => e.Person)
                .ThenInclude(e => e.EmployeeAddress)
                .Include(e => e.Position)
                .Include(e => e.Department)
                .Include(e => e.EmployeePermissions)
                .ThenInclude(ep => ep.Permission)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee == null)
                return null;
            else
                return employee;
        }

        public IQueryable<Employee> GetEmployees(string order, string search, string seniority, long department, long position, bool? isremote)
        {
            var employees = FilterEmployees(search, seniority, department, position, isremote);
            employees = orderEmployees(employees, order);

            return employees;
        }

        public async Task<Employee> PutEmployee(long id, Employee employeeEntity)
        {
            var employeeToEdit = await GetEmployee(id);

            if (employeeToEdit == null)
            {
                _logger.LogError($"Employee with ID: {id} not exists");
                return null;
            }

            employeeToEdit.Person.Name = employeeEntity.Person.Name;
            employeeToEdit.Person.Surname = employeeEntity.Person.Surname;
            employeeToEdit.Person.Email = employeeEntity.Person.Email;
            employeeToEdit.Person.PhoneNumber = employeeEntity.Person.PhoneNumber;
            employeeToEdit.Person.EmployeeAddress.City = employeeEntity.Person.EmployeeAddress.City;
            employeeToEdit.Person.EmployeeAddress.Street = employeeEntity.Person.EmployeeAddress.Street;
            employeeToEdit.Person.EmployeeAddress.PostCode = employeeEntity.Person.EmployeeAddress.PostCode;
            employeeToEdit.Seniority = employeeEntity.Seniority;
            employeeToEdit.RemoteWork = employeeEntity.RemoteWork;
            employeeToEdit.EmploymentDate = employeeEntity.EmploymentDate;
            employeeToEdit.DepartmentId = employeeEntity.DepartmentId;
            employeeToEdit.PositionId = employeeEntity.PositionId;

            if (employeeToEdit.EmployeePermissions.Any())
            {
                _mDBContext.EmployeePermissions.RemoveRange(employeeToEdit.EmployeePermissions);
                await Save();
            }

            foreach (var per in employeeEntity.EmployeePermissions)
            {
                employeeToEdit.EmployeePermissions.Add(new EmployeePermissions()
                {
                    EmployeeId = per.EmployeeId,
                    PermissionId = per.PermissionId,
                });
            }

            await Save();
            _logger.LogInformation($"Employee with ID: {id} edited");
            return await GetEmployee(id);
        }

        public async Task<bool> Save()
        {
            _logger.LogInformation("Saving changes...");
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }

        private IQueryable<Employee> FilterEmployees(string search,string seniority , long department, long position, bool? isremote)
        {
            StringBuilder whereQuery = new StringBuilder("e => e.Id != 0 ");

            if (department != 0)
                whereQuery.Append("&& e.Department.Id == " + department + " ");

            if (position != 0)
                whereQuery.Append("&& e.Position.Id == " + position + " ");             

            if (isremote != null)
                whereQuery.Append("&& e.RemoteWork == " + isremote + " ");

            if (seniority != null || seniority == "")
            {
                seniority = seniority.ToLower();
                whereQuery.Append("&& e.seniority.ToLower().Contains("+'"' + seniority + '"' + ") ");
            }

            if (search != null)
            {
                search = search.ToLower().TrimEnd();
                if (search.Contains(" "))
                {
                    string[] searchSplited = search.Split(" ");
                    whereQuery.Append("&& e.Person.Name.ToLower().Contains(" +
                        '"' + searchSplited[0] + '"' + ") && e.Person.Surname.ToLower().Contains(" +
                         '"' + searchSplited[1] + '"' + ") ");
                }
                else
                    whereQuery.Append("&& e.Person.Name.ToLower().Contains(" +
                        '"' + search + '"' + ") || e.Person.Surname.ToLower().Contains(" +
                         '"' + search + '"' + ") ");
            }

            var query =  _mDBContext.Employee
            .Include(e => e.Person)
            .ThenInclude(e => e.EmployeeAddress)
            .Include(e => e.Position)
            .Include(e => e.Department)
            .Include(e => e.EmployeePermissions)
            .ThenInclude(ep => ep.Permission)
            .Where(whereQuery.ToString());

            return query;
        }

        private IQueryable<Employee> orderEmployees(IQueryable <Employee> query, string order)
        {
            if (order == null)
                order = "Id";

            if (order.Equals("date-asc") || order.Equals("date-desc"))
            {
                if (order.Equals("date-asc"))
                   return query = query.OrderBy(e => e.EmploymentDate);
                else
                   return query = query.OrderByDescending(e => e.EmploymentDate);
            }
            else
            {
                order = order switch
                {
                    "name" => "Person.Name",
                    "surname" => "Person.Surname",
                    "department" => "Department.Name",
                    "position" => "Position.Name",
                    _ => "Id",
                };
               return query = query.OrderBy("e => e." + order);
            }
        }
    }
}
