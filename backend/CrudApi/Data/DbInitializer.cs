// Data/DbInitializer.cs
using Dapper;

namespace CrudApi.Data
{
    public class DbInitializer
    {
        private readonly DapperContext _context;

        public DbInitializer(DapperContext context)
        {
            _context = context;
        }

        public void Initialize()
        {
            using var connection = _context.CreateConnection();
            
            // Create users table
            var createTableQuery = @"
                CREATE TABLE IF NOT EXISTS users (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role ENUM('admin', 'user') DEFAULT 'user',
                    otp_code VARCHAR(6) NULL,
                    otp_expiry DATETIME NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                );";
            connection.Execute(createTableQuery);

            // Create incomes table
            var createIncomesTable = @"
                CREATE TABLE IF NOT EXISTS incomes (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    user_id INT NOT NULL,
                    amount DECIMAL(10,2) NOT NULL,
                    category VARCHAR(50) NOT NULL,
                    date DATE NOT NULL,
                    description TEXT,
                    is_recurring BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    INDEX idx_user_date (user_id, date)
                );";
            connection.Execute(createIncomesTable);

            // Create expenses table
            var createExpensesTable = @"
                CREATE TABLE IF NOT EXISTS expenses (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    user_id INT NOT NULL,
                    amount DECIMAL(10,2) NOT NULL,
                    category VARCHAR(50) NOT NULL,
                    date DATE NOT NULL,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    INDEX idx_user_date (user_id, date)
                );";
            connection.Execute(createExpensesTable);

            // Create bucket_list table
            var createBucketListTable = @"
                CREATE TABLE IF NOT EXISTS bucket_list (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    user_id INT NOT NULL,
                    item_name VARCHAR(255) NOT NULL,
                    description TEXT,
                    estimated_cost DECIMAL(10,2),
                    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
                    target_date DATE,
                    category VARCHAR(50) DEFAULT 'other',
                    purchased BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    INDEX idx_user_purchased (user_id, purchased)
                );";
            connection.Execute(createBucketListTable);

            // Create bucket_list_product_links table
            var createProductLinksTable = @"
                CREATE TABLE IF NOT EXISTS bucket_list_product_links (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    bucket_item_id INT NOT NULL,
                    platform ENUM('amazon', 'flipkart', 'other') NOT NULL,
                    product_url TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (bucket_item_id) REFERENCES bucket_list(id) ON DELETE CASCADE,
                    INDEX idx_bucket_item (bucket_item_id)
                );";
            connection.Execute(createProductLinksTable);
        }
    }
}