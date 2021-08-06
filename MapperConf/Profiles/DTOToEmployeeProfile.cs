using AutoMapper;
using HumanResourcesManager.Models;
using System.Collections.Generic;

namespace HumanResourcesManager.MapperConf.Profiles
{
    public class DTOToEmployeeProfile : Profile
    {
        public DTOToEmployeeProfile()
        {
            CreateMap<EmployeeDTO, Employee >().AfterMap((DTO, emp) =>
            {
                emp.EmployeePermissions = new List<EmployeePermissions>();
                foreach (var item in DTO.Permissions)
                {
                    emp.EmployeePermissions.Add(new EmployeePermissions
                    {
                        EmployeeId = 0,
                        Employee = emp,
                        PermissionId = item.Id,
                        
                    }) ;
                }
            });
            CreateMap<PersonDTO, Person >();
            CreateMap<EmployeeAddressDTO, EmployeeAddress >();
            CreateMap<PositionDTO, Position >();
            CreateMap<DepartmentDTO, Department>();
            CreateMap<PermissionDTO, Permission>();
        }
    }
}
