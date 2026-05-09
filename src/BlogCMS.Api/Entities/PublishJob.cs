using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlogCMS.Api.Entities;

public class PublishJob
{
    public int Id { get; set; }

    public int ArticleId { get; set; }

    [ForeignKey(nameof(ArticleId))]
    public Article? Article { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pending";
    // Pending / Running / Succeeded / Failed / Retrying

    [MaxLength(2000)]
    public string? ErrorMessage { get; set; }

    [MaxLength(40)]
    public string? CommitSha { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? StartedAt { get; set; }

    public DateTime? FinishedAt { get; set; }

    public int RetryCount { get; set; }

    [MaxLength(500)]
    public string? PublicUrl { get; set; }
}
