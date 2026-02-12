using Microsoft.AspNetCore.Mvc;
using CrudApi.Repositories;
using CrudApi.Models;

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

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repository.GetAll();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> Create(User user)
        {
            await _repository.Create(user);
            return Ok();
        }
    }
}
