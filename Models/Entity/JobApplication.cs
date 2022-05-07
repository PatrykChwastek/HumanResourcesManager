using HumanResourcesManager.Models.Entity;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HumanResourcesManager.Models
{
    public class JobApplication
    {
        [Key]
        public long Id { get; set; }
        public long PersonId { get; set; }
        public Person Person { get; set; }
        public string Content { get; set; }
        public long PositionId { get; set; }
        public Position Position { get; set; }
        public DateTime ApplicationDate { get; set; }
        public int ExpectedSalary { get; set; }
        public string CVPath { get; set; }
        public long JobOfferId { get; set; }
        public JobOffer JobOffer { get; set; }
    }
}
