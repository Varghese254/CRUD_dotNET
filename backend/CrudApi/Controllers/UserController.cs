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

        // ================= REGISTER =================
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
                Role = "user" // default role
            };

            await _repository.Create(user);

            return Ok(new { message = "User registered successfully" });
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _repository.GetByEmail(dto.Email);

            if (user == null)
                return Unauthorized(new { message = "User not found" });

            // 🔐 Correct BCrypt verification
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);

            if (!isPasswordValid)
                return Unauthorized(new { message = "Invalid password" });

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role
            });
        }
    }
}
