using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CrudApi.Repositories;
using CrudApi.Models;
using CrudApi.DTOs;

namespace CrudApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IncomeController : ControllerBase
    {
        private readonly IncomeRepository _incomeRepository;

        public IncomeController(IncomeRepository incomeRepository)
        {
            _incomeRepository = incomeRepository;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                throw new UnauthorizedAccessException("User ID not found in token");
            
            return int.Parse(userIdClaim);
        }

        // GET: api/income
        [HttpGet]
        public async Task<IActionResult> GetIncomes([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var userId = GetUserId();
                
                // If month/year not provided, use current month/year
                var targetMonth = month ?? DateTime.Now.Month;
                var targetYear = year ?? DateTime.Now.Year;

                var incomes = await _incomeRepository.GetUserIncomes(userId, targetMonth, targetYear);
                var total = await _incomeRepository.GetMonthlyTotal(userId, targetMonth, targetYear);

                var incomeResponses = incomes.Select(i => new IncomeResponseDto
                {
                    Id = i.Id,
                    Amount = i.Amount,
                    Category = i.Category,
                    Date = i.Date,
                    Description = i.Description,
                    IsRecurring = i.IsRecurring,
                    CreatedAt = i.CreatedAt
                });

                return Ok(new
                {
                    incomes = incomeResponses,
                    total = total,
                    month = targetMonth,
                    year = targetYear
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching incomes", error = ex.Message });
            }
        }

        // GET: api/income/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetIncome(int id)
        {
            try
            {
                var userId = GetUserId();
                var income = await _incomeRepository.GetById(id, userId);

                if (income == null)
                    return NotFound(new { message = "Income not found" });

                var response = new IncomeResponseDto
                {
                    Id = income.Id,
                    Amount = income.Amount,
                    Category = income.Category,
                    Date = income.Date,
                    Description = income.Description,
                    IsRecurring = income.IsRecurring,
                    CreatedAt = income.CreatedAt
                };

                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching income", error = ex.Message });
            }
        }

        // POST: api/income
        [HttpPost]
        public async Task<IActionResult> CreateIncome([FromBody] CreateIncomeDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetUserId();

                var income = new Income
                {
                    UserId = userId,
                    Amount = dto.Amount,
                    Category = dto.Category,
                    Date = dto.Date,
                    Description = dto.Description ?? string.Empty,
                    IsRecurring = dto.IsRecurring
                };

                var id = await _incomeRepository.Create(income);

                var response = new IncomeResponseDto
                {
                    Id = id,
                    Amount = income.Amount,
                    Category = income.Category,
                    Date = income.Date,
                    Description = income.Description,
                    IsRecurring = income.IsRecurring,
                    CreatedAt = DateTime.Now
                };

                return CreatedAtAction(nameof(GetIncome), new { id = id }, response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating income", error = ex.Message });
            }
        }

        // PUT: api/income/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIncome(int id, [FromBody] UpdateIncomeDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetUserId();
                var existingIncome = await _incomeRepository.GetById(id, userId);

                if (existingIncome == null)
                    return NotFound(new { message = "Income not found" });

                existingIncome.Amount = dto.Amount;
                existingIncome.Category = dto.Category;
                existingIncome.Date = dto.Date;
                existingIncome.Description = dto.Description ?? string.Empty;
                existingIncome.IsRecurring = dto.IsRecurring;

                var updated = await _incomeRepository.Update(existingIncome);

                if (!updated)
                    return StatusCode(500, new { message = "Failed to update income" });

                return Ok(new { message = "Income updated successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating income", error = ex.Message });
            }
        }

        // DELETE: api/income/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome(int id)
        {
            try
            {
                var userId = GetUserId();
                var deleted = await _incomeRepository.Delete(id, userId);

                if (!deleted)
                    return NotFound(new { message = "Income not found" });

                return Ok(new { message = "Income deleted successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting income", error = ex.Message });
            }
        }

        // GET: api/income/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetIncomeSummary([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var userId = GetUserId();
                var targetMonth = month ?? DateTime.Now.Month;
                var targetYear = year ?? DateTime.Now.Year;

                var total = await _incomeRepository.GetMonthlyTotal(userId, targetMonth, targetYear);
                var categorySummary = await _incomeRepository.GetCategorySummary(userId, targetMonth, targetYear);

                return Ok(new
                {
                    total = total,
                    month = targetMonth,
                    year = targetYear,
                    categories = categorySummary
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching income summary", error = ex.Message });
            }
        }
    }
}