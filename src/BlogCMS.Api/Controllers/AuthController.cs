using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using BlogCMS.Api.Data;
using BlogCMS.Api.Entities;

namespace BlogCMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly BlogDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(BlogDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var admin = await _context.Admins
            .FirstOrDefaultAsync(a => a.Username == request.Username);

        if (admin == null || !BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        // Update last login
        admin.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Generate JWT
        var token = GenerateJwtToken(admin);

        return Ok(new LoginResponse
        {
            Token = token,
            User = new UserInfo
            {
                Id = admin.Id,
                Username = admin.Username,
                DisplayName = admin.DisplayName,
                Email = admin.Email
            }
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public ActionResult Logout()
    {
        // JWT is stateless, so logout is handled client-side
        return Ok(new { message = "Logged out successfully" });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserInfo>> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out var id))
        {
            return Unauthorized();
        }

        var admin = await _context.Admins.FindAsync(id);
        if (admin == null)
        {
            return NotFound();
        }

        return Ok(new UserInfo
        {
            Id = admin.Id,
            Username = admin.Username,
            DisplayName = admin.DisplayName,
            Email = admin.Email
        });
    }

    private string GenerateJwtToken(Admin admin)
    {
        var key = _configuration["Jwt:Key"] ?? "DefaultSecretKeyForBlogCMSThatIsAtLeast32Chars!";
        var issuer = _configuration["Jwt:Issuer"] ?? "BlogCMS";
        var expiryDays = int.Parse(_configuration["Jwt:ExpiryDays"] ?? "7");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
            new Claim(ClaimTypes.Name, admin.Username),
            new Claim(ClaimTypes.Email, admin.Email ?? "")
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: issuer,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(expiryDays),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public UserInfo User { get; set; } = null!;
}

public class UserInfo
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
