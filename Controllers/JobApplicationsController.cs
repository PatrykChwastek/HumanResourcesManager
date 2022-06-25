using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HumanResourcesManager.Context;
using HumanResourcesManager.Models;
using System.IO;
using HumanResourcesManager.Services.JobApplicationRepo;
using AutoMapper;

namespace HumanResourcesManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationsController : ControllerBase
    {
        private readonly IJobApplicationRepository _jobApplicationRepository;
        private readonly IMapper _mapper;

        public JobApplicationsController(IJobApplicationRepository jobApplicationRepository, IMapper autoMapper)
        {
            _jobApplicationRepository = jobApplicationRepository;
            _mapper = autoMapper;
        }

        // GET: api/JobApplications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobApplicationDTO>>> GetJobApplications(
            int page, int size, long position, long jobOffer)
        {
            var jobApplicatios = _jobApplicationRepository.GetJobApplications(jobOffer,position);
            var mappedJobApplicatios = _mapper.Map<List<JobApplicationDTO>>(jobApplicatios);
            var totalJobApplications = _jobApplicationRepository.JobApplicationsCount(jobApplicatios);

            var pageOfJobApplications = new Pagination(page, size, await totalJobApplications);
            return Ok(await pageOfJobApplications.InitPagination(mappedJobApplicatios.AsQueryable()));
        }

        // GET: api/JobApplications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<JobApplicationDTO>> GetJobApplication(long id)
        {
            var jobApplication = await _jobApplicationRepository.GetJobApplication(id);

            if (jobApplication == null)
            {
                return NotFound();
            }
            var mapedJobApplication = _mapper.Map<JobApplicationDTO>(jobApplication);
            return mapedJobApplication;
        }

        // GET: api/JobApplications/cv/5
        [HttpGet("cv/{id}")]
        public async Task<ActionResult> GetJobApplicationCV(long id)
        {
            var jobApplication = await _jobApplicationRepository.GetJobApplication(id);

            if (jobApplication == null)
            {
                return NotFound();
            }
            var bytes = await System.IO.File.ReadAllBytesAsync(jobApplication.CVPath);
            return File(bytes, "text/plain", Path.GetFileName(jobApplication.CVPath));
        }

        [HttpPost]
        public async Task<ActionResult<JobApplicationDTO>> PostJobApplication([FromForm]JobApplicationDTO jobApplication)
        {
            var extension = "." + jobApplication.CVFile.FileName.Split('.')[jobApplication.CVFile.FileName.Split('.').Length - 1];
            if (extension.Equals(".pdf"))
            {
                jobApplication.CVPath = await WriteFile(jobApplication.CVFile);
                var mapedJobApplication = _mapper.Map<JobApplication>(jobApplication);

                var jobApplicationEntity = await _jobApplicationRepository.CreateJobApplication(mapedJobApplication);
                var jobApplicationDTO = _mapper.Map<JobApplicationDTO>(jobApplicationEntity);
                return Created("get", jobApplicationDTO);
            }

            return BadRequest(new { message = "Invalid file extension. Required PDF format" });
        }

        // DELETE: api/JobApplications/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<JobApplication>> DeleteJobApplication(long id)
        {
            if (await _jobApplicationRepository.DeleteJobApplication(id))
            {
                await _jobApplicationRepository.Save();
                return NoContent();
            }

            return StatusCode(500, "Server Error: JobApplication not exist");
        }

        private async Task<string> WriteFile(IFormFile file)
        {
            string fileName;
            string path = "";
            try
            {
                var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
                fileName = DateTime.Now.Ticks + extension; //Create a new Name for the file due to security reasons.

                var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\CVfiles");

                if (!Directory.Exists(pathBuilt))
                {
                    Directory.CreateDirectory(pathBuilt);
                }

                path = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\CVfiles",
                   fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

            }
            catch (Exception e)
            {
                //log error
            }

                return path;
        }
    }
}
