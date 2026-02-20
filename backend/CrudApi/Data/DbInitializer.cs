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
                );
            ";

            using var connection = _context.CreateConnection();
            connection.Execute(createTableQuery);
        }
    }
}