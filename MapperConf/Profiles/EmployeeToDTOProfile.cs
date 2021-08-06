using AutoMapper;
using HumanResourcesManager.Models;

namespace HumanResourcesManager.MapperConf.Profiles
{
    public class EmployeeToDTOProfile: Profile
    {
        public EmployeeToDTOProfile()
        {
            CreateMap<Employee, EmployeeDTO>();
            CreateMap<Person, PersonDTO>();
            CreateMap<EmployeeAddress, EmployeeAddressDTO>();
            CreateMap<Position, PositionDTO>();
            CreateMap<Department, DepartmentDTO>();
            CreateMap<Permission, PermissionDTO>();
        }
    }
}
