using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogCMS.Api.Data;
using BlogCMS.Api.Entities;

namespace BlogCMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TagsController : ControllerBase
{
    private readonly BlogDbContext _context;

    public TagsController(BlogDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TagDto>>> GetTags()
    {
        var tags = await _context.Tags
            .OrderBy(t => t.Name)
            .Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name,
                Slug = t.Slug,
                ArticleCount = t.ArticleCount
            })
            .ToListAsync();

        return Ok(tags);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TagDto>> GetTag(int id)
    {
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null)
        {
            return NotFound(new { message = "Tag not found" });
        }

        return Ok(new TagDto
        {
            Id = tag.Id,
            Name = tag.Name,
            Slug = tag.Slug,
            ArticleCount = tag.ArticleCount
        });
    }

    [HttpPost]
    public async Task<ActionResult<TagDto>> CreateTag([FromBody] CreateTagRequest request)
    {
        // Validate slug uniqueness
        if (await _context.Tags.AnyAsync(t => t.Slug == request.Slug))
        {
            return BadRequest(new { message = $"Tag with slug '{request.Slug}' already exists" });
        }

        var tag = new Tag
        {
            Name = request.Name,
            Slug = request.Slug,
            ArticleCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        _context.Tags.Add(tag);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTag), new { id = tag.Id }, new TagDto
        {
            Id = tag.Id,
            Name = tag.Name,
            Slug = tag.Slug,
            ArticleCount = tag.ArticleCount
        });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TagDto>> UpdateTag(int id, [FromBody] UpdateTagRequest request)
    {
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null)
        {
            return NotFound(new { message = "Tag not found" });
        }

        if (!string.IsNullOrEmpty(request.Name))
        {
            tag.Name = request.Name;
        }

        if (!string.IsNullOrEmpty(request.Slug))
        {
            // Validate slug uniqueness
            if (await _context.Tags.AnyAsync(t => t.Slug == request.Slug && t.Id != id))
            {
                return BadRequest(new { message = $"Tag with slug '{request.Slug}' already exists" });
            }
            tag.Slug = request.Slug;
        }

        await _context.SaveChangesAsync();

        return Ok(new TagDto
        {
            Id = tag.Id,
            Name = tag.Name,
            Slug = tag.Slug,
            ArticleCount = tag.ArticleCount
        });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTag(int id)
    {
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null)
        {
            return NotFound(new { message = "Tag not found" });
        }

        _context.Tags.Remove(tag);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("update-counts")]
    public async Task<ActionResult> UpdateArticleCounts()
    {
        var tags = await _context.Tags.ToListAsync();
        var articles = await _context.Articles
            .Where(a => a.Status == ArticleStatus.Published && !string.IsNullOrEmpty(a.Tag))
            .ToListAsync();

        foreach (var tag in tags)
        {
            tag.ArticleCount = articles.Count(a =>
                a.Tag.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(t => t.Trim())
                    .Contains(tag.Name, StringComparer.OrdinalIgnoreCase));
        }

        await _context.SaveChangesAsync();
        return Ok();
    }
}

public class TagDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int ArticleCount { get; set; }
}

public class CreateTagRequest
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}

public class UpdateTagRequest
{
    public string? Name { get; set; }
    public string? Slug { get; set; }
}
