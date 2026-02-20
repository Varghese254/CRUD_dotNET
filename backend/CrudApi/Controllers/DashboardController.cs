using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CrudApi.Repositories;

namespace CrudApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Make sure this is present
    public class DashboardController : ControllerBase
    {
        private readonly DashboardRepository _dashboardRepository;

        public DashboardController(DashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                // Log all claims for debugging
                var claims = User.Claims.Select(c => $"{c.Type}: {c.Value}").ToList();
                Console.WriteLine("Available claims: " + string.Join(", ", claims));
                
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            
            return int.Parse(userIdClaim);
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardData([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var userId = GetUserId();
                Console.WriteLine($"Fetching dashboard data for user: {userId}");
                
                var targetMonth = month ?? DateTime.Now.Month;
                var targetYear = year ?? DateTime.Now.Year;

                var data = await _dashboardRepository.GetDashboardData(userId, targetMonth, targetYear);
                
                return Ok(data);
            }
            catch (UnauthorizedAccessException ex)
            {
                Console.WriteLine($"Unauthorized: {ex.Message}");
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }
    }
}