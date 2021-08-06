namespace HumanResourcesManager.Models
{
    public class PersonDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public EmployeeAddressDTO EmployeeAddress {get; set;}
    }
}
