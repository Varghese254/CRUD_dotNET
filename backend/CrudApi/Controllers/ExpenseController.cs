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
    public class ExpenseController : ControllerBase
    {
        private readonly ExpenseRepository _expenseRepository;

        public ExpenseController(ExpenseRepository expenseRepository)
        {
            _expenseRepository = expenseRepository;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                throw new UnauthorizedAccessException("User ID not found in token");
            
            return int.Parse(userIdClaim);
        }

        // GET: api/expense
        [HttpGet]
        public async Task<IActionResult> GetExpenses([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var userId = GetUserId();
                var targetMonth = month ?? DateTime.Now.Month;
                var targetYear = year ?? DateTime.Now.Year;

                var expenses = await _expenseRepository.GetUserExpenses(userId, targetMonth, targetYear);
                var total = await _expenseRepository.GetMonthlyTotal(userId, targetMonth, targetYear);

                var expenseResponses = expenses.Select(e => new ExpenseResponseDto
                {
                    Id = e.Id,
                    Amount = e.Amount,
                    Category = e.Category,
                    Date = e.Date,
                    Description = e.Description,
                    CreatedAt = e.CreatedAt
                });

                return Ok(new
                {
                    expenses = expenseResponses,
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
                return StatusCode(500, new { message = "An error occurred while fetching expenses", error = ex.Message });
            }
        }

        // GET: api/expense/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetExpense(int id)
        {
            try
            {
                var userId = GetUserId();
                var expense = await _expenseRepository.GetById(id, userId);

                if (expense == null)
                    return NotFound(new { message = "Expense not found" });

                var response = new ExpenseResponseDto
                {
                    Id = expense.Id,
                    Amount = expense.Amount,
                    Category = expense.Category,
                    Date = expense.Date,
                    Description = expense.Description,
                    CreatedAt = expense.CreatedAt
                };

                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching expense", error = ex.Message });
            }
        }

        // POST: api/expense
        [HttpPost]
        public async Task<IActionResult> CreateExpense([FromBody] CreateExpenseDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetUserId();

                var expense = new Expense
                {
                    UserId = userId,
                    Amount = dto.Amount,
                    Category = dto.Category,
                    Date = dto.Date,
                    Description = dto.Description ?? string.Empty
                };

                var id = await _expenseRepository.Create(expense);

                var response = new ExpenseResponseDto
                {
                    Id = id,
                    Amount = expense.Amount,
                    Category = expense.Category,
                    Date = expense.Date,
                    Description = expense.Description,
                    CreatedAt = DateTime.Now
                };

                return CreatedAtAction(nameof(GetExpense), new { id = id }, response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating expense", error = ex.Message });
            }
        }

        // PUT: api/expense/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] UpdateExpenseDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetUserId();
                var existingExpense = await _expenseRepository.GetById(id, userId);

                if (existingExpense == null)
                    return NotFound(new { message = "Expense not found" });

                existingExpense.Amount = dto.Amount;
                existingExpense.Category = dto.Category;
                existingExpense.Date = dto.Date;
                existingExpense.Description = dto.Description ?? string.Empty;

                var updated = await _expenseRepository.Update(existingExpense);

                if (!updated)
                    return StatusCode(500, new { message = "Failed to update expense" });

                return Ok(new { message = "Expense updated successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating expense", error = ex.Message });
            }
        }

        // DELETE: api/expense/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            try
            {
                var userId = GetUserId();
                var deleted = await _expenseRepository.Delete(id, userId);

                if (!deleted)
                    return NotFound(new { message = "Expense not found" });

                return Ok(new { message = "Expense deleted successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting expense", error = ex.Message });
            }
        }

        // GET: api/expense/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetExpenseSummary([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var userId = GetUserId();
                var targetMonth = month ?? DateTime.Now.Month;
                var targetYear = year ?? DateTime.Now.Year;

                var total = await _expenseRepository.GetMonthlyTotal(userId, targetMonth, targetYear);
                var categorySummary = await _expenseRepository.GetCategorySummary(userId, targetMonth, targetYear);
                var topCategories = await _expenseRepository.GetTopCategories(userId, targetMonth, targetYear);

                return Ok(new
                {
                    total = total,
                    month = targetMonth,
                    year = targetYear,
                    categories = categorySummary,
                    topCategories = topCategories
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching expense summary", error = ex.Message });
            }
        }
    }
}