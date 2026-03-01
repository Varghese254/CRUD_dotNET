using System;
using System.Collections.Generic;

namespace CrudApi.DTOs
{
    // Response DTOs
    public class BucketItemDto
    {
        public int Id { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal? EstimatedCost { get; set; }
        public string? Priority { get; set; }
        public DateTime? TargetDate { get; set; }
        public string? Category { get; set; }
        public bool Purchased { get; set; }
        public List<BucketItemProductLinkDto>? ProductLinks { get; set; }
    }

    public class BucketItemProductLinkDto
    {
        public int Id { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string ProductUrl { get; set; } = string.Empty;
    }

    // Request DTOs
    public class CreateBucketItemDto
    {
        public string ItemName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal? EstimatedCost { get; set; }
        public string? Priority { get; set; }
        public DateTime? TargetDate { get; set; }
        public string? Category { get; set; }
        public bool Purchased { get; set; } = false;
        public List<CreateProductLinkDto>? ProductLinks { get; set; }
    }

    public class UpdateBucketItemDto
    {
        public string ItemName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal? EstimatedCost { get; set; }
        public string? Priority { get; set; }
        public DateTime? TargetDate { get; set; }
        public string? Category { get; set; }
        public bool Purchased { get; set; }
        public List<CreateProductLinkDto>? ProductLinks { get; set; }
    }

    public class CreateProductLinkDto
    {
        public string Platform { get; set; } = string.Empty;
        public string ProductUrl { get; set; } = string.Empty;
    }

    public class TogglePurchasedDto
    {
        public bool Purchased { get; set; }
    }

    // Summary DTO
    public class BucketListSummaryDto
    {
        public int TotalItems { get; set; }
        public int PurchasedItems { get; set; }
        public int PendingItems { get; set; }
        public decimal TotalEstimatedCost { get; set; }
        public decimal PurchasedCost { get; set; }
        public decimal PendingCost { get; set; }
        public Dictionary<string, int> ItemsByCategory { get; set; } = new();
        public Dictionary<string, int> ItemsByPriority { get; set; } = new();
    }
}