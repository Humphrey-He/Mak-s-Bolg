using System.Text;
using System.Text.RegularExpressions;
using BlogCMS.Api.Entities;

namespace BlogCMS.Api.Services;

public class MdxService
{
    private readonly string _postsPath;

    public MdxService(IConfiguration configuration)
    {
        _postsPath = configuration["Content:PostsPath"]
            ?? Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "content", "posts");
    }

    public string GenerateMdx(Article article)
    {
        var sb = new StringBuilder();
        sb.AppendLine("---");
        sb.AppendLine($"title: \"{EscapeString(article.Title)}\"");
        sb.AppendLine($"description: \"{EscapeString(article.Description)}\"");
        sb.AppendLine($"date: \"{article.PublishedAt?.ToString("yyyy-MM-dd") ?? DateTime.Now.ToString("yyyy-MM-dd")}\"");
        sb.AppendLine($"tag: \"{article.Tag}\"");
        sb.AppendLine($"readTime: \"{article.ReadTimeMinutes} min\"");
        sb.AppendLine($"top: {article.IsTop.ToString().ToLower()}");
        sb.AppendLine($"featured: {article.IsFeatured.ToString().ToLower()}");
        sb.AppendLine("---");
        sb.AppendLine();
        sb.Append(article.Content);

        return sb.ToString();
    }

    public string GetFilePath(string slug)
    {
        return Path.Combine(_postsPath, $"{slug}.mdx");
    }

    public async Task WriteMdxAsync(Article article)
    {
        var content = GenerateMdx(article);
        var filePath = GetFilePath(article.Slug);

        Directory.CreateDirectory(_postsPath);
        await File.WriteAllTextAsync(filePath, content, Encoding.UTF8);
    }

    public int CalculateReadTime(string content)
    {
        // Average reading speed: 200 words per minute
        const int wordsPerMinute = 200;

        // Strip MDX/markdown syntax for word count
        var plainText = Regex.Replace(content, @"```[\s\S]*?```", " "); // Remove code blocks
        plainText = Regex.Replace(plainText, @"`[^`]+`", " "); // Remove inline code
        plainText = Regex.Replace(plainText, @"!\[.*?\]\(.*?\)", " "); // Remove images
        plainText = Regex.Replace(plainText, @"\[([^\]]+)\]\([^\)]+\)", "$1"); // Replace links with text
        plainText = Regex.Replace(plainText, @"[#*_~>`\-]", " "); // Remove markdown symbols
        plainText = Regex.Replace(plainText, @"\s+", " "); // Normalize whitespace

        var wordCount = plainText.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
        var readTime = Math.Max(1, (int)Math.Ceiling((double)wordCount / wordsPerMinute));

        return readTime;
    }

    public (string? content, string? error) ReadMdx(string slug)
    {
        try
        {
            var filePath = GetFilePath(slug);
            if (!File.Exists(filePath))
            {
                return (null, "File not found");
            }

            var content = File.ReadAllText(filePath, Encoding.UTF8);
            return (content, null);
        }
        catch (Exception ex)
        {
            return (null, ex.Message);
        }
    }

    private static string EscapeString(string value)
    {
        return value
            .Replace("\\", "\\\\")
            .Replace("\"", "\\\"")
            .Replace("\n", " ")
            .Replace("\r", "");
    }
}
