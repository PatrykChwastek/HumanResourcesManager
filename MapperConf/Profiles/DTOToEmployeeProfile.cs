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
            .ForMember(dest => dest.Members, opt => opt.Ignore())
            .AfterMap((DTO, team) =>
            {
                team.TeamLeaderId = DTO.TeamLeader.Id;
                team.Members = new List<TeamEmployees>();
                foreach (var item in DTO.Members)
                {
                    team.Members.Add(new TeamEmployees
                    {
                        TeamId = team.Id,
                        Team = team,
                        EmployeeId = item.Id,
                    });
                }
            });
            CreateMap<EmployeeTaskDTO, EmployeeTask>().PreserveReferences();
            CreateMap<PersonDTO, Person >();
            CreateMap<EmployeeAddressDTO, EmployeeAddress >();
            CreateMap<PositionDTO, Position >();
            CreateMap<DepartmentDTO, Department>();
            CreateMap<PermissionDTO, Permission>();
        }
    }
}
