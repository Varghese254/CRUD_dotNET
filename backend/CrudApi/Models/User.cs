namespace CrudApi.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "user";

        public DateTime Created_At { get; set; }

        public DateTime Updated_At { get; set; }

        public string? OtpCode { get; set; }
        
        public DateTime? OtpExpiry { get; set; }
    }
}
