using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogCMS.Api.Data;
using BlogCMS.Api.Entities;
using BlogCMS.Api.Services;

namespace BlogCMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ArticlesController : ControllerBase
{
    private readonly BlogDbContext _context;
    private readonly GitService _gitService;
    private readonly MdxService _mdxService;
    private readonly ILogger<ArticlesController> _logger;

    public ArticlesController(
        BlogDbContext context,
        GitService gitService,
        MdxService mdxService,
        ILogger<ArticlesController> logger)
    {
        _context = context;
        _gitService = gitService;
        _mdxService = mdxService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ArticleListDto>>> GetArticles(
        [FromQuery] ArticleStatus? status = null,
        [FromQuery] string? tag = null)
    {
        var query = _context.Articles.AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(a => a.Status == status.Value);
        }

        if (!string.IsNullOrEmpty(tag))
        {
            query = query.Where(a => a.Tag == tag);
        }

        var articles = await query
            .OrderByDescending(a => a.PublishedAt ?? a.CreatedAt)
            .Select(a => new ArticleListDto
            {
                Id = a.Id,
                Title = a.Title,
                Slug = a.Slug,
                Description = a.Description,
                Tag = a.Tag,
                ReadTimeMinutes = a.ReadTimeMinutes,
                IsTop = a.IsTop,
                IsFeatured = a.IsFeatured,
                Status = a.Status,
                PublishedAt = a.PublishedAt,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            })
            .ToListAsync();

        return Ok(articles);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ArticleDto>> GetArticle(string slug)
    {
        Article? article;

        if (int.TryParse(slug, out var id))
        {
            article = await _context.Articles.FindAsync(id);
        }
        else
        {
            article = await _context.Articles.FirstOrDefaultAsync(a => a.Slug == slug);
        }

        if (article == null)
        {
            return NotFound(new { message = "Article not found" });
        }

        return Ok(MapToDto(article));
    }

    [HttpPost]
    public async Task<ActionResult<ArticleDto>> CreateArticle([FromBody] CreateArticleRequest request)
    {
        // Validate slug uniqueness
        if (await _context.Articles.AnyAsync(a => a.Slug == request.Slug))
        {
            return BadRequest(new { message = $"Article with slug '{request.Slug}' already exists" });
        }

        var article = new Article
        {
            Title = request.Title,
            Slug = request.Slug,
            Description = request.Description ?? string.Empty,
            Content = request.Content ?? string.Empty,
            Tag = request.Tag ?? string.Empty,
            CoverImageUrl = request.CoverImageUrl,
            ReadTimeMinutes = _mdxService.CalculateReadTime(request.Content ?? string.Empty),
            IsTop = request.IsTop,
            IsFeatured = request.IsFeatured,
            Status = ArticleStatus.Draft,
            FilePath = $"content/posts/{request.Slug}.mdx",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Articles.Add(article);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetArticle), new { slug = article.Slug }, MapToDto(article));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ArticleDto>> UpdateArticle(int id, [FromBody] UpdateArticleRequest request)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null)
        {
            return NotFound(new { message = "Article not found" });
        }

        article.Title = request.Title ?? article.Title;
        article.Description = request.Description ?? article.Description;
        article.Content = request.Content ?? article.Content;
        article.Tag = request.Tag ?? article.Tag;
        article.CoverImageUrl = request.CoverImageUrl ?? article.CoverImageUrl;

        if (!string.IsNullOrEmpty(request.Content))
        {
            article.ReadTimeMinutes = _mdxService.CalculateReadTime(request.Content);
        }

        article.IsTop = request.IsTop ?? article.IsTop;
        article.IsFeatured = request.IsFeatured ?? article.IsFeatured;
        article.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(MapToDto(article));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteArticle(int id)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null)
        {
            return NotFound(new { message = "Article not found" });
        }

        // If article was published, delete the MDX file and push
        if (article.Status == ArticleStatus.Published)
        {
            var filePath = _mdxService.GetFilePath(article.Slug);
            if (System.IO.File.Exists(filePath))
            {
                var (success, message) = await _gitService.DeleteFileAsync(
                    filePath,
                    $"docs: delete article {article.Title}");
                if (!success)
                {
                    _logger.LogWarning("Failed to delete MDX file: {Message}", message);
                }
            }
        }

        _context.Articles.Remove(article);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/publish")]
    public async Task<ActionResult<PublishJobDto>> PublishArticle(int id)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null)
        {
            return NotFound(new { message = "Article not found" });
        }

        // Create publish job
        var job = new PublishJob
        {
            ArticleId = article.Id,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };
        _context.PublishJobs.Add(job);
        await _context.SaveChangesAsync();

        // Process publish synchronously for MVP
        job.Status = "Running";
        job.StartedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        try
        {
            // Step 1: Pull latest
            var (pullSuccess, pullMessage, _) = await _gitService.PullAsync();
            if (!pullSuccess)
            {
                throw new Exception($"Pull failed: {pullMessage}");
            }

            // Step 2: Write MDX file
            article.PublishedAt = DateTime.UtcNow;
            article.Status = ArticleStatus.Published;
            article.UpdatedAt = DateTime.UtcNow;

            await _mdxService.WriteMdxAsync(article);

            // Step 3: Commit and push
            var filePath = _mdxService.GetFilePath(article.Slug);
            var (pushSuccess, pushMessage, commitSha) = await _gitService.CommitAndPushAsync(
                filePath,
                $"docs: publish article {article.Title}");

            if (!pushSuccess)
            {
                throw new Exception($"Push failed: {pushMessage}");
            }

            // Update job as succeeded
            job.Status = "Succeeded";
            job.CommitSha = commitSha;
            job.FinishedAt = DateTime.UtcNow;
            article.LastCommitSha = commitSha;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Published article {Title} with commit {CommitSha}", article.Title, commitSha);

            return Ok(new PublishJobDto
            {
                Id = job.Id,
                ArticleId = job.ArticleId,
                Status = job.Status,
                ErrorMessage = job.ErrorMessage,
                CommitSha = job.CommitSha,
                CreatedAt = job.CreatedAt,
                StartedAt = job.StartedAt,
                FinishedAt = job.FinishedAt,
                RetryCount = job.RetryCount
            });
        }
        catch (Exception ex)
        {
            job.Status = "Failed";
            job.ErrorMessage = ex.Message;
            job.FinishedAt = DateTime.UtcNow;
            job.RetryCount++;
            await _context.SaveChangesAsync();

            _logger.LogError(ex, "Failed to publish article {Title}", article.Title);

            return StatusCode(500, new PublishJobDto
            {
                Id = job.Id,
                ArticleId = job.ArticleId,
                Status = job.Status,
                ErrorMessage = job.ErrorMessage,
                CreatedAt = job.CreatedAt,
                StartedAt = job.StartedAt,
                FinishedAt = job.FinishedAt,
                RetryCount = job.RetryCount
            });
        }
    }

    [HttpGet("/api/jobs/{id}")]
    public async Task<ActionResult<PublishJobDto>> GetJob(int id)
    {
        var job = await _context.PublishJobs
            .Include(j => j.Article)
            .FirstOrDefaultAsync(j => j.Id == id);

        if (job == null)
        {
            return NotFound(new { message = "Job not found" });
        }

        return Ok(new PublishJobDto
        {
            Id = job.Id,
            ArticleId = job.ArticleId,
            Status = job.Status,
            ErrorMessage = job.ErrorMessage,
            CommitSha = job.CommitSha,
            CreatedAt = job.CreatedAt,
            StartedAt = job.StartedAt,
            FinishedAt = job.FinishedAt,
            RetryCount = job.RetryCount
        });
    }

    private static ArticleDto MapToDto(Article article)
    {
        return new ArticleDto
        {
            Id = article.Id,
            Title = article.Title,
            Slug = article.Slug,
            Description = article.Description,
            Content = article.Content,
            Tag = article.Tag,
            ReadTimeMinutes = article.ReadTimeMinutes,
            IsTop = article.IsTop,
            IsFeatured = article.IsFeatured,
            Status = article.Status,
            FilePath = article.FilePath,
            LastCommitSha = article.LastCommitSha,
            PublishedAt = article.PublishedAt,
            CreatedAt = article.CreatedAt,
            UpdatedAt = article.UpdatedAt,
            CoverImageUrl = article.CoverImageUrl
        };
    }
}

public class ArticleListDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Tag { get; set; } = string.Empty;
    public int ReadTimeMinutes { get; set; }
    public bool IsTop { get; set; }
    public bool IsFeatured { get; set; }
    public ArticleStatus Status { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ArticleDto : ArticleListDto
{
    public string Content { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string? LastCommitSha { get; set; }
    public string? CoverImageUrl { get; set; }
}

public class CreateArticleRequest
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Content { get; set; }
    public string? Tag { get; set; }
    public string? CoverImageUrl { get; set; }
    public bool IsTop { get; set; }
    public bool IsFeatured { get; set; }
}

public class UpdateArticleRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Content { get; set; }
    public string? Tag { get; set; }
    public string? CoverImageUrl { get; set; }
    public bool? IsTop { get; set; }
    public bool? IsFeatured { get; set; }
}

public class PublishJobDto
{
    public int Id { get; set; }
    public int ArticleId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
    public string? CommitSha { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public int RetryCount { get; set; }
}
