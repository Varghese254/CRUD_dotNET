using Dapper;
using CrudApi.Data;
using CrudApi.DTOs;

namespace CrudApi.Repositories
{
    public class DashboardRepository
    {
        private readonly DapperContext _context;

        public DashboardRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<DashboardDataDto> GetDashboardData(int userId, int month, int year)
        {
            using var connection = _context.CreateConnection();
            
            // Get total income for the month
            var incomeQuery = @"
                SELECT COALESCE(SUM(amount), 0) 
                FROM incomes 
                WHERE user_id = @UserId 
                AND MONTH(date) = @Month 
                AND YEAR(date) = @Year";
            
            var totalIncome = await connection.ExecuteScalarAsync<decimal>(incomeQuery, new { UserId = userId, Month = month, Year = year });

            // Get total expenses for the month
            var expenseQuery = @"
                SELECT COALESCE(SUM(amount), 0) 
                FROM expenses 
                WHERE user_id = @UserId 
                AND MONTH(date) = @Month 
                AND YEAR(date) = @Year";
            
            var totalExpense = await connection.ExecuteScalarAsync<decimal>(expenseQuery, new { UserId = userId, Month = month, Year = year });

            // Calculate balance
            var balance = totalIncome - totalExpense;

            // Get category-wise expense breakdown
            var categoryQuery = @"
                SELECT 
                    category,
                    COALESCE(SUM(amount), 0) as Amount
                FROM expenses 
                WHERE user_id = @UserId 
                AND MONTH(date) = @Month 
                AND YEAR(date) = @Year
                GROUP BY category
                ORDER BY Amount DESC";
            
            var categoryExpenses = (await connection.QueryAsync(categoryQuery, new { UserId = userId, Month = month, Year = year }))
                .Select(x => new CategoryBreakdownDto
                {
                    Category = x.category,
                    Amount = x.Amount,
                    Percentage = totalExpense > 0 ? Math.Round((x.Amount / totalExpense) * 100, 1) : 0
                }).ToList();

            // Get top 3 spending categories
            var topCategories = categoryExpenses.Take(3).ToList();

            // Get recent transactions (last 10)
            var recentQuery = @"
                (SELECT 
                    'income' as Type,
                    id,
                    amount,
                    category,
                    description,
                    date
                FROM incomes 
                WHERE user_id = @UserId)
                UNION ALL
                (SELECT 
                    'expense' as Type,
                    id,
                    amount,
                    category,
                    description,
                    date
                FROM expenses 
                WHERE user_id = @UserId)
                ORDER BY date DESC
                LIMIT 10";
            
            var recentTransactions = (await connection.QueryAsync(recentQuery, new { UserId = userId }))
                .Select(x => new RecentTransactionDto
                {
                    Id = x.id,
                    Type = x.Type,
                    Amount = x.amount,
                    Category = x.category,
                    Description = x.description,
                    Date = x.date
                }).ToList();

            // Get budget progress (if you implement budget table later)
            var budgets = new List<BudgetProgressDto>();

            var dashboardData = new DashboardDataDto
            {
                Summary = new DashboardSummaryDto
                {
                    TotalIncome = totalIncome,
                    TotalExpense = totalExpense,
                    Balance = balance,
                    MonthlySavings = balance,
                    SavingsRate = totalIncome > 0 ? Math.Round((balance / totalIncome) * 100, 1) : 0
                },
                CategoryExpenses = categoryExpenses,
                TopCategories = topCategories,
                RecentTransactions = recentTransactions,
                Budgets = budgets
            };

            return dashboardData;
        }

        public async Task<decimal> GetCurrentBalance(int userId)
        {
            using var connection = _context.CreateConnection();
            
            var totalIncome = await connection.ExecuteScalarAsync<decimal>(
                "SELECT COALESCE(SUM(amount), 0) FROM incomes WHERE user_id = @UserId",
                new { UserId = userId });

            var totalExpense = await connection.ExecuteScalarAsync<decimal>(
                "SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE user_id = @UserId",
                new { UserId = userId });

            return totalIncome - totalExpense;
        }
    }
}