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

        public async Task<IEnumerable<User>> GetAll()
        {
            var query = "SELECT * FROM Users";
            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<User>(query);
        }

        public async Task Create(User user)
        {
            var query = "INSERT INTO Users (Name, Email) VALUES (@Name, @Email)";
            using var connection = _context.CreateConnection();
            await connection.ExecuteAsync(query, user);
        }
    }
}
