using AutoMapper;
using HumanResourcesManager.Models;
using System.Collections.Generic;

namespace HumanResourcesManager.MapperConf.Profiles
{
    public class EmployeeToDTOProfile: Profile
    {
        public EmployeeToDTOProfile()
        {
            CreateMap<Employee, EmployeeDTO>().AfterMap((emp, DTO) =>
            {
                DTO.Permissions = new List<PermissionDTO>();
                foreach (var item in emp.EmployeePermissions)
                {
                    DTO.Permissions.Add(new PermissionDTO
                    {   
                        Id = item.Permission.Id,
                        Name = item.Permission.Name,
                    });
                }
            });
            CreateMap<Person, PersonDTO>();
            CreateMap<EmployeeAddress, EmployeeAddressDTO>();
            CreateMap<Position, PositionDTO>();
            CreateMap<Department, DepartmentDTO>();
            CreateMap<Permission, PermissionDTO>();
        }
    }
}
