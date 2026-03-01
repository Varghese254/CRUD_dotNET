using System;

namespace CrudApi.Models
{
    public class BucketItemProductLink
    {
        public int Id { get; set; }
        public int BucketItemId { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string ProductUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}