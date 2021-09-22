using HumanResourcesManager.Context;
using HumanResourcesManager.Services;
using HumanResourcesManager.Services.EmployeeRepo;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AutoMapper;
using HumanResourcesManager.Services.DepartmentRepo;
using HumanResourcesManager.Services.PositionRepo;
using HumanResourcesManager.Services.PermissionRepo;
using HumanResourcesManager.Services.TeamRepo;
using HumanResourcesManager.Services.SIngletonProvider;
using HumanResourcesManager.Services.EmployeeTaskRepo;
using HumanResourcesManager.Services.UserRepo;

namespace HumanResourcesManager
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers().AddNewtonsoftJson(options =>
            options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
            services.AddDbContext<MDBContext>(options => options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IEmployeeRepository, EmployeeRepository>();
            services.AddScoped<IDepartmentRepository, DepartmentRepository>();
            services.AddScoped<IPositionRepository, PositionRepository>();
            services.AddScoped<IPermissionRepository, PermissionRepository>();
            services.AddScoped<ITeamRepository, TeamRepository>();
            services.AddScoped<IEmployeeTaskRepository, EmployeeTaskRepository>();
            services.AddSingleton<ISingletonProvider, SingletonProvider>();
            services.AddAutoMapper(typeof(Startup));
            services.AddCors();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowAnyOrigin()
                .SetIsOriginAllowed(origin => true)
                .AllowCredentials());

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
