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
                .ForMember(dto => dto.TeamLeader, opt => opt.MapFrom(x => x.TeamLeader))
                .ForMember(dto => dto.Members, opt =>
                {
                    opt.MapFrom(t => t.Members.Select(te => te.Employee));
                });
                //opt.MapFrom(x => x.Members));
            CreateMap<TeamEmployees, EmployeeDTO>().IncludeMembers(dto => dto, opt => opt.Employee);
            CreateMap<EmployeeTask, EmployeeTaskDTO>().PreserveReferences();
            CreateMap<Person, PersonDTO>();
            CreateMap<EmployeeAddress, EmployeeAddressDTO>();
            CreateMap<Position, PositionDTO>();
            CreateMap<Department, DepartmentDTO>();
            CreateMap<Permission, PermissionDTO>();
            CreateMap<User, UserDTO>().ForMember(dto => dto.EmployeeDTO,
                 opt => opt.MapFrom(x => x.Employee));

        }
    }
}
