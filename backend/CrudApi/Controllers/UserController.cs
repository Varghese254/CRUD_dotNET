using Microsoft.AspNetCore.Mvc;
using CrudApi.Repositories;
using CrudApi.Models;
using CrudApi.DTOs;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace CrudApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _repository;

       private readonly IConfiguration _configuration;

public UserController(UserRepository repository, IConfiguration configuration)
{
    _repository = repository;
    _configuration = configuration;
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

    bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);

    if (!isPasswordValid)
        return Unauthorized(new { message = "Invalid password" });

    // 🔐 Generate JWT
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role)
    };

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])
    );

    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.Now.AddMinutes(
        Convert.ToDouble(_configuration["Jwt:DurationInMinutes"])
      ),
        signingCredentials: creds
    );

    var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

    return Ok(new
    {
        token = jwtToken,
        user.Id,
        user.Name,
        user.Email,
        user.Role
    });
}

    }
}
