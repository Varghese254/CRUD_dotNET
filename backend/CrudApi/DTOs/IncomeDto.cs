using System.ComponentModel.DataAnnotations;

namespace CrudApi.DTOs
{
    public class CreateIncomeDto
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        public string Description { get; set; } = string.Empty;

        public bool IsRecurring { get; set; }
    }

    public class UpdateIncomeDto
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        public string Description { get; set; } = string.Empty;

        public bool IsRecurring { get; set; }
    }

    public class IncomeResponseDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Category { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsRecurring { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}