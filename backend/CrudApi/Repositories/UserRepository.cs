using Dapper;
using CrudApi.Data;
using CrudApi.Models;

namespace CrudApi.Repositories
{
    public class UserRepository
    {
        private readonly DapperContext _context;

        public UserRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmail(string email)
        {
            var query = "SELECT * FROM users WHERE email = @Email";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(query, new { Email = email });
        }

        public async Task<User?> GetById(int id)
        {
            var query = "SELECT * FROM users WHERE id = @Id";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(query, new { Id = id });
        }

        public async Task Create(User user)
        {
            var query = @"INSERT INTO users (name, email, password, role)
                          VALUES (@Name, @Email, @Password, @Role)";
            using var connection = _context.CreateConnection();
            await connection.ExecuteAsync(query, user);
        }

        public async Task UpdateOtp(string email, string otpCode, DateTime expiry)
        {
            var query = @"UPDATE users 
                         SET otp_code = @OtpCode, otp_expiry = @Expiry 
                         WHERE email = @Email";
            using var connection = _context.CreateConnection();
            await connection.ExecuteAsync(query, new { OtpCode = otpCode, Expiry = expiry, Email = email });
        }

        public async Task<bool> VerifyOtp(string email, string otpCode)
        {
            var query = @"SELECT COUNT(*) FROM users 
                         WHERE email = @Email 
                         AND otp_code = @OtpCode 
                         AND otp_expiry > NOW()";
            using var connection = _context.CreateConnection();
            var count = await connection.ExecuteScalarAsync<int>(query, new { Email = email, OtpCode = otpCode });
            return count > 0;
        }

        public async Task UpdatePassword(string email, string newPassword)
        {
            var query = @"UPDATE users 
                         SET password = @Password, otp_code = NULL, otp_expiry = NULL 
                         WHERE email = @Email";
            using var connection = _context.CreateConnection();
            await connection.ExecuteAsync(query, new { Password = newPassword, Email = email });
        }

        public async Task ClearOtp(string email)
        {
            var query = @"UPDATE users 
                         SET otp_code = NULL, otp_expiry = NULL 
                         WHERE email = @Email";
            using var connection = _context.CreateConnection();
            await connection.ExecuteAsync(query, new { Email = email });
        }
    }
}