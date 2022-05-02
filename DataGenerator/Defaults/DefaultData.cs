using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.DataGenerator.Defaults
{
    public class DefaultData
    {
        public readonly DefaultDepartments DefaultDepartments = new DefaultDepartments();
        public readonly DefaultPositions DefaultPositions = new DefaultPositions();
        public readonly DefaultPermissions DefaultPermissions = new DefaultPermissions();

        public void CreateDefaults(MDBContext DBContext)
        {
           List<Department> departments = new List<Department>();
            foreach (var department in DefaultDepartments.GetType().GetFields())
            {
                departments.Add(new Department() { 
                    Name = department.GetValue(DefaultDepartments).ToString()
                });
            }

            List<Position> positions = new List<Position>();
            foreach (var position in DefaultPositions.GetType().GetFields())
            {
                positions.Add(new Position()
                {
                    Name = position.GetValue(DefaultPositions).ToString()
                });
            }

            List<Permission> permissions = new List<Permission>();
            foreach (var permission in DefaultPermissions.GetType().GetFields())
            {
                permissions.Add(new Permission()
                {
                    Name = permission.GetValue(DefaultPermissions).ToString()
                });
            }

            DBContext.AddRange(departments);
            DBContext.AddRange(positions);
            DBContext.AddRange(permissions);
            DBContext.SaveChanges();
        }
    }
}
