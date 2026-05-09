using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogCMS.Api.Data;
using BlogCMS.Api.Entities;

namespace BlogCMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MediaController : ControllerBase
{
    private readonly BlogDbContext _context;
    private readonly ILogger<MediaController> _logger;
    private readonly string _uploadPath;
    private readonly string _baseUrl;

    private static readonly HashSet<string> AllowedMimeTypes = new()
    {
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml"
    };

    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

    public MediaController(BlogDbContext context, ILogger<MediaController> logger, IConfiguration configuration)
    {
        _context = context;
        _logger = logger;
        _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "public", "uploads", "media");
        _baseUrl = configuration["NEXT_PUBLIC_SITE_URL"]?.TrimEnd('/') ?? "https://shuhong.icu";

        Directory.CreateDirectory(_uploadPath);
    }

    [HttpGet]
    public async Task<ActionResult<MediaListDto>> GetMedia(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.Media.OrderByDescending(m => m.CreatedAt);

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(m => new MediaDto
            {
                Id = m.Id,
                FileName = m.FileName,
                OriginalName = m.OriginalName,
                Url = m.Url,
                MimeType = m.MimeType,
                FileSize = m.FileSize,
                Width = m.Width,
                Height = m.Height,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync();

        return Ok(new MediaListDto
        {
            Items = items,
            Total = total,
            Page = page,
            PageSize = pageSize
        });
    }

    [HttpPost("upload")]
    public async Task<ActionResult<MediaDto>> UploadMedia(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file provided" });
        }

        if (file.Length > MaxFileSize)
        {
            return BadRequest(new { message = "File size exceeds 5MB limit" });
        }

        if (!AllowedMimeTypes.Contains(file.ContentType.ToLower()))
        {
            return BadRequest(new { message = "Only image files (jpg, png, gif, webp, svg) are allowed" });
        }

        try
        {
            // Generate unique filename
            var extension = Path.GetExtension(file.FileName).ToLower();
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(_uploadPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Get image dimensions (if applicable)
            int width = 0;
            int height = 0;

            if (file.ContentType == "image/jpeg" || file.ContentType == "image/png" ||
                file.ContentType == "image/gif" || file.ContentType == "image/webp")
            {
                try
                {
                    using var image = SixLabors.ImageSharp.Image.Load(filePath);
                    width = image.Width;
                    height = image.Height;
                }
                catch
                {
                    // Ignore dimension reading errors
                }
            }

            // Create database entry
            var media = new Media
            {
                FileName = fileName,
                OriginalName = file.FileName,
                Url = $"/uploads/media/{fileName}",
                MimeType = file.ContentType,
                FileSize = file.Length,
                Width = width,
                Height = height,
                CreatedAt = DateTime.UtcNow
            };

            _context.Media.Add(media);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Uploaded media file: {FileName}", fileName);

            return Ok(new MediaDto
            {
                Id = media.Id,
                FileName = media.FileName,
                OriginalName = media.OriginalName,
                Url = media.Url,
                MimeType = media.MimeType,
                FileSize = media.FileSize,
                Width = media.Width,
                Height = media.Height,
                CreatedAt = media.CreatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload media file");
            return StatusCode(500, new { message = "Failed to upload file" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMedia(int id)
    {
        var media = await _context.Media.FindAsync(id);
        if (media == null)
        {
            return NotFound(new { message = "Media not found" });
        }

        // Delete physical file
        var filePath = Path.Combine(_uploadPath, media.FileName);
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }

        _context.Media.Remove(media);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted media file: {FileName}", media.FileName);

        return NoContent();
    }

    [HttpGet("by-url")]
    public async Task<ActionResult<MediaDto>> GetMediaByUrl([FromQuery] string url)
    {
        var media = await _context.Media.FirstOrDefaultAsync(m => m.Url == url);
        if (media == null)
        {
            return NotFound(new { message = "Media not found" });
        }

        return Ok(new MediaDto
        {
            Id = media.Id,
            FileName = media.FileName,
            OriginalName = media.OriginalName,
            Url = media.Url,
            MimeType = media.MimeType,
            FileSize = media.FileSize,
            Width = media.Width,
            Height = media.Height,
            CreatedAt = media.CreatedAt
        });
    }
}

public class MediaDto
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string OriginalName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string MimeType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class MediaListDto
{
    public List<MediaDto> Items { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
