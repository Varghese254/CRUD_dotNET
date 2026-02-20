using Dapper;
using CrudApi.Data;
using CrudApi.Models;

namespace CrudApi.Repositories
{
    public class IncomeRepository
    {
        private readonly DapperContext _context;

        public IncomeRepository(DapperContext context)
        {
            _context = context;
        }

        // Create new income
        public async Task<int> Create(Income income)
        {
            var query = @"
                INSERT INTO incomes (user_id, amount, category, date, description, is_recurring, created_at, updated_at)
                VALUES (@UserId, @Amount, @Category, @Date, @Description, @IsRecurring, NOW(), NOW());
                SELECT LAST_INSERT_ID();";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, income);
        }

        // Get all incomes for a user with optional filters
        public async Task<IEnumerable<Income>> GetUserIncomes(int userId, int? month = null, int? year = null)
        {
            var query = "SELECT * FROM incomes WHERE user_id = @UserId";
            
            if (month.HasValue && year.HasValue)
            {
                query += " AND MONTH(date) = @Month AND YEAR(date) = @Year";
            }
            
            query += " ORDER BY date DESC";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<Income>(query, new { 
                UserId = userId, 
                Month = month, 
                Year = year 
            });
        }

        // Get income by id
        public async Task<Income?> GetById(int id, int userId)
        {
            var query = "SELECT * FROM incomes WHERE id = @Id AND user_id = @UserId";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Income>(query, new { Id = id, UserId = userId });
        }

        // Update income
        public async Task<bool> Update(Income income)
        {
            var query = @"
                UPDATE incomes 
                SET amount = @Amount, 
                    category = @Category, 
                    date = @Date, 
                    description = @Description, 
                    is_recurring = @IsRecurring,
                    updated_at = NOW()
                WHERE id = @Id AND user_id = @UserId";

            using var connection = _context.CreateConnection();
            var rowsAffected = await connection.ExecuteAsync(query, income);
            return rowsAffected > 0;
        }

        // Delete income
        public async Task<bool> Delete(int id, int userId)
        {
            var query = "DELETE FROM incomes WHERE id = @Id AND user_id = @UserId";
            using var connection = _context.CreateConnection();
            var rowsAffected = await connection.ExecuteAsync(query, new { Id = id, UserId = userId });
            return rowsAffected > 0;
        }

        // Get total income for a user in a specific month/year
        public async Task<decimal> GetMonthlyTotal(int userId, int month, int year)
        {
            var query = @"
                SELECT COALESCE(SUM(amount), 0) 
                FROM incomes 
                WHERE user_id = @UserId 
                AND MONTH(date) = @Month 
                AND YEAR(date) = @Year";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<decimal>(query, new { UserId = userId, Month = month, Year = year });
        }

        // Get income summary by category for a user
        public async Task<IEnumerable<CategorySummary>> GetCategorySummary(int userId, int month, int year)
        {
            var query = @"
                SELECT category, COALESCE(SUM(amount), 0) as Total
                FROM incomes 
                WHERE user_id = @UserId 
                AND MONTH(date) = @Month 
                AND YEAR(date) = @Year
                GROUP BY category
                ORDER BY Total DESC";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<CategorySummary>(query, new { UserId = userId, Month = month, Year = year });
        }
    }

    public class CategorySummary
    {
        public string Category { get; set; } = string.Empty;
        public decimal Total { get; set; }
    }
}