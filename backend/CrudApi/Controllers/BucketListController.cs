using CrudApi.DTOs;
using CrudApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CrudApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BucketListController : ControllerBase
    {
        private readonly BucketListRepository _bucketListRepository;

        public BucketListController(BucketListRepository bucketListRepository)
        {
            _bucketListRepository = bucketListRepository;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        // GET: api/bucketlist
        [HttpGet]
        public async Task<IActionResult> GetUserBucketItems()
        {
            try
            {
                var userId = GetUserId();
                var items = await _bucketListRepository.GetUserBucketItems(userId);
                
                var result = items.Select(item => new BucketItemDto
                {
                    Id = item.Id,
                    ItemName = item.ItemName,
                    Description = item.Description,
                    EstimatedCost = item.EstimatedCost,
                    Priority = item.Priority,
                    TargetDate = item.TargetDate,
                    Category = item.Category,
                    Purchased = item.Purchased,
                    ProductLinks = item.ProductLinks?.Select(link => new BucketItemProductLinkDto
                    {
                        Id = link.Id,
                        Platform = link.Platform,
                        ProductUrl = link.ProductUrl
                    }).ToList()
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching bucket list", error = ex.Message });
            }
        }

        // GET: api/bucketlist/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBucketItem(int id)
        {
            try
            {
                var userId = GetUserId();
                var item = await _bucketListRepository.GetBucketItemById(id, userId);

                if (item == null)
                    return NotFound(new { message = "Bucket item not found" });

                var result = new BucketItemDto
                {
                    Id = item.Id,
                    ItemName = item.ItemName,
                    Description = item.Description,
                    EstimatedCost = item.EstimatedCost,
                    Priority = item.Priority,
                    TargetDate = item.TargetDate,
                    Category = item.Category,
                    Purchased = item.Purchased,
                    ProductLinks = item.ProductLinks?.Select(link => new BucketItemProductLinkDto
                    {
                        Id = link.Id,
                        Platform = link.Platform,
                        ProductUrl = link.ProductUrl
                    }).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching bucket item", error = ex.Message });
            }
        }

        // POST: api/bucketlist
        [HttpPost]
        public async Task<IActionResult> CreateBucketItem([FromBody] CreateBucketItemDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetUserId();
                var id = await _bucketListRepository.CreateBucketItem(userId, dto);

                return CreatedAtAction(nameof(GetBucketItem), new { id }, new { id, message = "Bucket item created successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating bucket item", error = ex.Message });
            }
        }

        // PUT: api/bucketlist/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBucketItem(int id, [FromBody] UpdateBucketItemDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetUserId();
                var updated = await _bucketListRepository.UpdateBucketItem(id, userId, dto);

                if (!updated)
                    return NotFound(new { message = "Bucket item not found" });

                return Ok(new { message = "Bucket item updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating bucket item", error = ex.Message });
            }
        }

        // PATCH: api/bucketlist/{id}/toggle-purchased
        [HttpPatch("{id}/toggle-purchased")]
        public async Task<IActionResult> TogglePurchased(int id, [FromBody] TogglePurchasedDto dto)
        {
            try
            {
                var userId = GetUserId();
                var toggled = await _bucketListRepository.TogglePurchased(id, userId, dto.Purchased);

                if (!toggled)
                    return NotFound(new { message = "Bucket item not found" });

                return Ok(new { message = $"Item marked as {(dto.Purchased ? "achieved" : "pending")}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating status", error = ex.Message });
            }
        }

        // DELETE: api/bucketlist/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBucketItem(int id)
        {
            try
            {
                var userId = GetUserId();
                var deleted = await _bucketListRepository.DeleteBucketItem(id, userId);

                if (!deleted)
                    return NotFound(new { message = "Bucket item not found" });

                return Ok(new { message = "Bucket item deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting bucket item", error = ex.Message });
            }
        }

        // GET: api/bucketlist/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            try
            {
                var userId = GetUserId();
                var summary = await _bucketListRepository.GetSummary(userId);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching summary", error = ex.Message });
            }
        }
    }
}