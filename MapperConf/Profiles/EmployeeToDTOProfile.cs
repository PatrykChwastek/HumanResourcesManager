using AutoMapper;
using HumanResourcesManager.Models;
using HumanResourcesManager.Models.DTO;
using HumanResourcesManager.Models.Entity;
using System.Collections.Generic;
using System.Linq;

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
            CreateMap<Team, TeamDTO>()
                 .ForMember(dto => dto.Members, 
                 opt => opt.MapFrom(x => x.Members.Select(y => y.Employee).ToList())); // need test
            CreateMap<Person, PersonDTO>();
            CreateMap<EmployeeAddress, EmployeeAddressDTO>();
            CreateMap<Position, PositionDTO>();
            CreateMap<Department, DepartmentDTO>();
            CreateMap<Seniority, SeniorityDTO>();
            CreateMap<Permission, PermissionDTO>();
        }
    }
}
