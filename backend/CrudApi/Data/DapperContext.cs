using MySqlConnector;
using System.Data;

namespace CrudApi.Data
{
    public class DapperContext
    {
        private readonly string _connectionString;

        public DapperContext(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException("DefaultConnection is not configured.");
        }

        public IDbConnection CreateConnection()
            => new MySqlConnection(_connectionString);
    }
}
