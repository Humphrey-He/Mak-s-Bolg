using System.ComponentModel.DataAnnotations;

namespace BlogCMS.Api.Entities;

public class Tag
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Slug { get; set; } = string.Empty;

    public int ArticleCount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
