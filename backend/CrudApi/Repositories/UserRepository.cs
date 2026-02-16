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

        public async Task Create(User user)
        {
            var query = @"INSERT INTO users (name, email, password, role)
                          VALUES (@Name, @Email, @Password, @Role)";
            using var connection = _context.CreateConnection();
            await connection.ExecuteAsync(query, user);
        }
    }
}
