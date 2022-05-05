using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HumanResourcesManager.Models
{
    public class JobApplicationDTO
    {
        public long Id { get; set; }
        public PersonDTO Person { get; set; }
        public string Content { get; set; }
        public PositionDTO Position { get; set; }
        public DateTime ApplicationDate { get; set; }
        public int ExpectedSalary { get; set; }
        public string CVPath { get; set; }
        public long JobOfferId { get; set; }
    }
}
