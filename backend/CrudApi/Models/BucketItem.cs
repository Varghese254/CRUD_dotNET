using System.Collections.Generic;

namespace CrudApi.Models
{
    public class BucketItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal? EstimatedCost { get; set; }
        public string? Priority { get; set; }
        public DateTime? TargetDate { get; set; }
        public string? Category { get; set; }
        public bool Purchased { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Navigation property
        public List<BucketItemProductLink>? ProductLinks { get; set; }
    }
}