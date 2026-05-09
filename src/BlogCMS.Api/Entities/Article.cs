using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlogCMS.Api.Entities;

public class Article
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Tag { get; set; } = string.Empty;

    public int ReadTimeMinutes { get; set; }

    public bool IsTop { get; set; }

    public bool IsFeatured { get; set; }

    public ArticleStatus Status { get; set; } = ArticleStatus.Draft;

    [MaxLength(500)]
    public string FilePath { get; set; } = string.Empty;

    [MaxLength(40)]
    public string? LastCommitSha { get; set; }

    public DateTime? PublishedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public int? CoverImageId { get; set; }
    public Media? CoverImage { get; set; }
}
