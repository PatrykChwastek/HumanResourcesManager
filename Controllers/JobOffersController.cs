using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HumanResourcesManager.Context;
using HumanResourcesManager.Models.Entity;
using HumanResourcesManager.Services.JobOfferRepo;
using AutoMapper;
using HumanResourcesManager.Models.DTO;

namespace HumanResourcesManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobOffersController : ControllerBase
    {
        private readonly IJobOfferRepository _jobOfferRepository;
        private readonly IMapper _mapper;

        public JobOffersController(IMapper mapper, IJobOfferRepository jobOfferRepository)
        {
            _mapper = mapper;
            _jobOfferRepository = jobOfferRepository;
        }

        // GET: api/JobOffers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobOfferDTO>>> GetJobOffers(string name, long position)
        {
            var jobOffers = await _jobOfferRepository.GetJobOffers(name, position).ToListAsync();
            var mappedJobOffers = _mapper.Map<List<JobOfferDTO>>(jobOffers);
            return Ok(mappedJobOffers);
        }

        // GET: api/JobOffers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<JobOfferDTO>> GetJobOffer(long id)
        {
            var jobOffer = await _jobOfferRepository.GetJobOffer(id);

            if (jobOffer == null)
            {
                return NotFound();
            }
            return _mapper.Map<JobOfferDTO>(jobOffer);
        }

        // PUT: api/JobOffers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJobOffer(long id, JobOfferDTO jobOffer)
        {
            if (id != jobOffer.Id)
            {
                return BadRequest();
            }
            var mappedJobOffer = _mapper.Map<JobOffer>(jobOffer);
            await _jobOfferRepository.PutJobOffer(id, mappedJobOffer);

            return NoContent();
        }

        // POST: api/JobOffers
        [HttpPost]
        public async Task<ActionResult<JobOfferDTO>> PostJobOffer([FromBody]JobOfferDTO _jobOffer)
        {
            var mappedJobOffer = _mapper.Map<JobOffer>(_jobOffer);
            var jobOfferEntity = await _jobOfferRepository.CreateJobOffer(mappedJobOffer);
            var jobOfferDTO = _mapper.Map<JobOfferDTO>(jobOfferEntity);

            return Created("get", jobOfferDTO);
        }

        // DELETE: api/JobOffers/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<JobOfferDTO>> DeleteJobOffer(long id)
        {
            if (await _jobOfferRepository.DeleteJobOffer(id))
            {
                await _jobOfferRepository.Save();
                return NoContent();
            }

            return StatusCode(500, "Server Error: Job Offer not exist");
        }
    }
}
