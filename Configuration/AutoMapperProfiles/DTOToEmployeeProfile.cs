using AutoMapper;
using HumanResourcesManager.Models;
using HumanResourcesManager.Models.DTO;
using HumanResourcesManager.Models.Entity;
using System.Collections.Generic;
using System.Linq;

namespace HumanResourcesManager.MapperConf.Profiles
{
    public class DTOToEmployeeProfile : Profile
    {
        public DTOToEmployeeProfile()
        {
            CreateMap<EmployeeDTO, Employee >()
            .AfterMap((DTO, emp) =>
            {
                if (DTO.Permissions != null)
                {
                    emp.EmployeePermissions = new List<EmployeePermissions>();
                    foreach (var item in DTO.Permissions)
                    {
                        emp.EmployeePermissions.Add(new EmployeePermissions
                        {
                            EmployeeId = DTO.Id,
                            PermissionId = item.Id,
                        }) ;
                    } 
                }
            });
            CreateMap<TeamDTO, Team>()
                .ForMember(t => t.TeamLeader, dto => dto.MapFrom(tl => tl.TeamLeader))
                .ForMember(t => t.TeamLeaderId, dto => dto.MapFrom(tl => tl.TeamLeader.Id))
                .ForMember(t => t.Members, opt => opt.MapFrom(dto => dto.Members
                .Select(e => new TeamEmployees 
                {
                    TeamId = dto.Id,
                    EmployeeId  = e.Id
                })));
            CreateMap<EmployeeTaskDTO, EmployeeTask>().PreserveReferences();
            CreateMap<PersonDTO, Person >();
            CreateMap<EmployeeAddressDTO, EmployeeAddress >();
            CreateMap<PositionDTO, Position >();
            CreateMap<DepartmentDTO, Department>();
            CreateMap<PermissionDTO, Permission>();
            CreateMap<UserDTO, User>().ForMember(u => u.Employee, dto => dto.MapFrom(x => x.EmployeeDTO));

        }
    }
}
