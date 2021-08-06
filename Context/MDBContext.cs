using System;
using HumanResourcesManager.Models;
using Microsoft.EntityFrameworkCore;

namespace HumanResourcesManager.Context
{
    public class MDBContext : DbContext
    {
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<Employee> Employee { get; set; }
        public DbSet<Person> Person { get; set; }
        public DbSet<EmployeeAddress> EmployeeAddress{ get; set; }
        public DbSet<Position> Position { get; set; }
        public DbSet<Department> Department { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<EmployeePermissions> EmployeePermissions { get; set; }
        public MDBContext(DbContextOptions<MDBContext> options) : base (options){}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Position>()
                .HasMany(p => p.JobApplications)
                .WithOne(ja => ja.Position)
                .HasForeignKey(ja => ja.PositionId)
                .IsRequired();

            modelBuilder.Entity<Person>()
                .HasOne<Employee>(ed => ed.Employee)
                .WithOne(e => e.Person)
                .IsRequired()               
                .HasForeignKey<Employee>(e => e.PersonId);

            modelBuilder.Entity<EmployeeAddress>()
                .HasOne<Person>(ea => ea.Person)
                .WithOne(ed => ed.EmployeeAddress)
                .IsRequired()
                .HasForeignKey<Person>(ed => ed.EmployeeAddressId);

            modelBuilder.Entity<Position>()
                .HasMany(p => p.Employees)
                .WithOne(e => e.Position)
                .HasForeignKey(e => e.PositionId)
                .IsRequired();

            modelBuilder.Entity<Department>()
                .HasMany(d => d.Employees)
                .WithOne(e => e.Department)
                .HasForeignKey(e => e.DepartmentId)
                .IsRequired();

            modelBuilder.Entity<EmployeePermissions>()
                .HasKey(ep => new {ep.EmployeeId, ep.PermissionId});

            modelBuilder.Entity<EmployeePermissions>()
                .HasOne(ep => ep.Employee)
                .WithMany(e => e.EmployeePermissions)
                .HasForeignKey(pe => pe.EmployeeId);

            modelBuilder.Entity<EmployeePermissions>()
                .HasOne(ep => ep.Permission)
                .WithMany(p => p.EmployeePermissions)
                .HasForeignKey(pe => pe.PermissionId);
        }
    }
}
