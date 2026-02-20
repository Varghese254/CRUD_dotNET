namespace CrudApi.DTOs
{
    public class DashboardSummaryDto
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal Balance { get; set; }
        public decimal BudgetUsed { get; set; }
        public decimal MonthlySavings { get; set; }
        public decimal SavingsRate { get; set; }
    }

    public class RecentTransactionDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty; // "income" or "expense"
        public decimal Amount { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }

    public class CategoryBreakdownDto
    {
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal Percentage { get; set; }
    }

    public class BudgetProgressDto
    {
        public string Category { get; set; } = string.Empty;
        public decimal Budget { get; set; }
        public decimal Spent { get; set; }
        public decimal Remaining { get; set; }
        public decimal Percentage { get; set; }
    }

    public class DashboardDataDto
    {
        public DashboardSummaryDto Summary { get; set; } = new();
        public List<BudgetProgressDto> Budgets { get; set; } = new();
        public List<CategoryBreakdownDto> CategoryExpenses { get; set; } = new();
        public List<CategoryBreakdownDto> TopCategories { get; set; } = new();
        public List<RecentTransactionDto> RecentTransactions { get; set; } = new();
    }
}