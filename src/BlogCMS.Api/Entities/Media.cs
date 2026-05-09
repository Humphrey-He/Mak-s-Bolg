using System.ComponentModel.DataAnnotations;

namespace BlogCMS.Api.Entities;

public class Media
{
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    [MaxLength(255)]
    public string OriginalName { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Url { get; set; } = string.Empty;

    [MaxLength(100)]
    public string MimeType { get; set; } = string.Empty;

    public long FileSize { get; set; }

    public int Width { get; set; }

    public int Height { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
