using Dapper;
using CrudApi.Data;
using CrudApi.Models;

namespace CrudApi.Repositories
{
    public class ExpenseRepository
    {
        private readonly DapperContext _context;

        public ExpenseRepository(DapperContext context)
        {
            _context = context;
        }

        // Create new expense
        public async Task<int> Create(Expense expense)
        {
            var query = @"
                INSERT INTO expenses (user_id, amount, category, date, description, created_at, updated_at)
                VALUES (@UserId, @Amount, @Category, @Date, @Description, NOW(), NOW());
                SELECT LAST_INSERT_ID();";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, expense);
        }

        // Get all expenses for a user with optional filters
        public async Task<IEnumerable<Expense>> GetUserExpenses(int userId, int? month = null, int? year = null)
        {
            var query = @"
                SELECT 
                    id as Id, 
                    user_id as UserId, 
                    amount as Amount, 
                    category as Category, 
                    date as Date, 
                    description as Description, 
                    created_at as CreatedAt, 
                    updated_at as UpdatedAt 
                FROM expenses 
                WHERE user_id = @UserId";
            
            if (month.HasValue && year.HasValue)
            {
                query += " AND MONTH(date) = @Month AND YEAR(date) = @Year";
            }
            
            query += " ORDER BY date DESC";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<Expense>(query, new { 
                UserId = userId, 
                Month = month, 
                Year = year 
            });
        }

        // Get expense by id
        public async Task<Expense?> GetById(int id, int userId)
        {
            var query = @"
                SELECT 
                    id as Id, 
                    user_id as UserId, 
                    amount as Amount, 
                    category as Category, 
                    date as Date, 
                    description as Description, 
                    created_at as CreatedAt, 
                    updated_at as UpdatedAt 
                FROM expenses 
                WHERE id = @Id AND user_id = @UserId";
            
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Expense>(query, new { Id = id, UserId = userId });
        }

        // Update expense
        public async Task<bool> Update(Expense expense)
        {
            var query = @"
                UPDATE expenses 
                SET amount = @Amount, 
                    category = @Category, 
                    date = @Date, 
                    description = @Description, 
                    updated_at = NOW()
                WHERE id = @Id AND user_id = @UserId";

            using var connection = _context.CreateConnection();
            var rowsAffected = await connection.ExecuteAsync(query, expense);
            return rowsAffected > 0;
        }

        // Delete expense
        public async Task<bool> Delete(int id, int userId)
        {
            var query = "DELETE FROM expenses WHERE id = @Id AND user_id = @UserId";
            using var connection = _context.CreateConnection();
            var rowsAffected = await connection.ExecuteAsync(query, new { Id = id, UserId = userId });
            return rowsAffected > 0;
        }

        // Get total expenses for a user in a specific month/year
        public async Task<decimal> GetMonthlyTotal(int userId, int month, int year)
        {
            var query = @"
                SELECT COALESCE(SUM(amount), 0) 
                FROM expenses 
                WHERE user_id = @UserId 
                AND MONTH(date) = @Month 
                AND YEAR(date) = @Year";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<decimal>(query, new { UserId = userId, Month = month, Year = year });
        }

        // Get expense summary by category for a user
        public async Task<IEnumerable<CategoryExpenseSummary>> GetCategorySummary(int userId, int month, int year)
        {
            var query = @"
                SELECT category, COALESCE(SUM(amount), 0) as Total
                FROM expenses 
                WHERE user_id = @UserId 
                AND MONTH(date) = @Month 
                AND YEAR(date) = @Year
                GROUP BY category
                ORDER BY Total DESC";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<CategoryExpenseSummary>(query, new { UserId = userId, Month = month, Year = year });
        }

        // Get top spending categories
        public async Task<IEnumerable<TopCategory>> GetTopCategories(int userId, int month, int year, int limit = 3)
        {
            var totalQuery = "SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE user_id = @UserId AND MONTH(date) = @Month AND YEAR(date) = @Year";
            
            var query = @"
                SELECT category, COALESCE(SUM(amount), 0) as Amount
                FROM expenses 
                WHERE user_id = @UserId 
                AND MONTH(date) = @Month 
                AND YEAR(date) = @Year
                GROUP BY category
                ORDER BY Amount DESC
                LIMIT @Limit";

            using var connection = _context.CreateConnection();
            var total = await connection.ExecuteScalarAsync<decimal>(totalQuery, new { UserId = userId, Month = month, Year = year });
            
            var categories = await connection.QueryAsync<TopCategory>(query, new { 
                UserId = userId, 
                Month = month, 
                Year = year,
                Limit = limit 
            });

            foreach (var cat in categories)
            {
                cat.Percentage = total > 0 ? Math.Round((cat.Amount / total) * 100, 1) : 0;
            }

            return categories;
        }
    }

    public class CategoryExpenseSummary
    {
        public string Category { get; set; } = string.Empty;
        public decimal Total { get; set; }
    }

    public class TopCategory
    {
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal Percentage { get; set; }
    }
}