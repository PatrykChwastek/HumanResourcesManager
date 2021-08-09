using System;
using HumanResourcesManager.Models;
using HumanResourcesManager.Models.Entity;
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
        public DbSet<Seniority> Seniority { get; set; }
        public DbSet<EmployeePermissions> EmployeePermissions { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<TeamEmployees> TeamEmploees { get; set; }

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

            modelBuilder.Entity<Seniority>()
                .HasMany(s => s.Employees)
                .WithOne(e => e.Seniority)
                .HasForeignKey(e => e.SeniorityId)
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

            modelBuilder.Entity<Employee>()
                .HasOne<Team>(t => t.Team)
                .WithOne(e => e.TeamLeader)
                .IsRequired()
                .HasForeignKey<Team>(t => t.TeamLeaderId);

            modelBuilder.Entity<TeamEmployees>()
                .HasKey(te => new { te.EmployeeId, te.TeamId });

            modelBuilder.Entity<TeamEmployees>()
                .HasOne(te => te.Team)
                .WithMany(t => t.TeamEmployees)
                .HasForeignKey(te => te.TeamId);

            modelBuilder.Entity<TeamEmployees>()
                .HasOne(te => te.Employee)
                .WithMany(e => e.TeamEmployees)
                .HasForeignKey(te => te.EmployeeId);
        }
    }
}
