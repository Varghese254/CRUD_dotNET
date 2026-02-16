using Microsoft.AspNetCore.Mvc;
using CrudApi.Repositories;
using CrudApi.Models;
using CrudApi.DTOs;
using BCrypt.Net;

namespace CrudApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _repository;

        public UserController(UserRepository repository)
        {
            _repository = repository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var existingUser = await _repository.GetByEmail(dto.Email);

            if (existingUser != null)
                return BadRequest(new { message = "Email already exists" });

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = hashedPassword,
                Role = "user"
            };

            await _repository.Create(user);

            return Ok(new { message = "User registered successfully" });
        }
    }
}
