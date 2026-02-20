using Microsoft.AspNetCore.Mvc;
using CrudApi.Repositories;
using CrudApi.Models;
using CrudApi.DTOs;
using CrudApi.Services;
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
        private readonly IEmailService _emailService;

        public UserController(UserRepository repository, IConfiguration configuration, IEmailService emailService)
        {
            _repository = repository;
            _configuration = configuration;
            _emailService = emailService;
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
                Role = "user"
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

        // ================= FORGOT PASSWORD =================
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            var user = await _repository.GetByEmail(dto.Email);
            
            if (user == null)
            {
                // Return success even if user doesn't exist for security
                return Ok(new { message = "If your email is registered, you will receive an OTP" });
            }

            // Generate 6-digit OTP
            var otpCode = new Random().Next(100000, 999999).ToString();
            var expiry = DateTime.Now.AddMinutes(10);

            await _repository.UpdateOtp(dto.Email, otpCode, expiry);

            // Send OTP via email
            await _emailService.SendOtpEmailAsync(dto.Email, otpCode);

            return Ok(new { message = "OTP sent successfully" });
        }

        // ================= VERIFY OTP =================
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(VerifyOtpDto dto)
        {
            var isValid = await _repository.VerifyOtp(dto.Email, dto.OtpCode);

            if (!isValid)
            {
                return BadRequest(new { message = "Invalid or expired OTP" });
            }

            return Ok(new { message = "OTP verified successfully" });
        }

        // ================= RESET PASSWORD =================
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            if (dto.NewPassword != dto.ConfirmPassword)
            {
                return BadRequest(new { message = "Passwords do not match" });
            }

            var isValid = await _repository.VerifyOtp(dto.Email, dto.OtpCode); // You might want to pass OTP here

            if (!isValid)
            {
                return BadRequest(new { message = "Invalid or expired OTP" });
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _repository.UpdatePassword(dto.Email, hashedPassword);

            return Ok(new { message = "Password reset successfully" });
        }
    }
}