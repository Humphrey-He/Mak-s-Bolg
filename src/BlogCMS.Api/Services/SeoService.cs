using System.Text;
using System.Xml;
using Microsoft.EntityFrameworkCore;
using BlogCMS.Api.Data;
using BlogCMS.Api.Entities;

namespace BlogCMS.Api.Services;

public class SeoService
{
    private readonly BlogDbContext _context;
    private readonly string _baseUrl;

    public SeoService(BlogDbContext context, IConfiguration configuration)
    {
        _context = context;
        _baseUrl = configuration["NEXT_PUBLIC_SITE_URL"]?.TrimEnd('/') ?? "https://shuhong.icu";
    }

    public async Task<string> GenerateSitemapAsync()
    {
        var articles = await _context.Articles
            .Where(a => a.Status == ArticleStatus.Published)
            .OrderByDescending(a => a.PublishedAt)
            .ToListAsync();

        var sb = new StringBuilder();
        sb.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        sb.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

        foreach (var article in articles)
        {
            var lastMod = (article.PublishedAt ?? article.CreatedAt).ToString("yyyy-MM-dd");
            var url = $"{_baseUrl}/blog/{article.Slug}";

            sb.AppendLine("  <url>");
            sb.AppendLine($"    <loc>{XmlEncode(url)}</loc>");
            sb.AppendLine($"    <lastmod>{lastMod}</lastmod>");
            sb.AppendLine("    <changefreq>monthly</changefreq>");
            sb.AppendLine("    <priority>0.8</priority>");
            sb.AppendLine("  </url>");
        }

        sb.AppendLine("</urlset>");

        return sb.ToString();
    }

    public async Task<string> GenerateRssFeedAsync()
    {
        var articles = await _context.Articles
            .Where(a => a.Status == ArticleStatus.Published)
            .OrderByDescending(a => a.PublishedAt)
            .Take(20)
            .ToListAsync();

        var sb = new StringBuilder();
        sb.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        sb.AppendLine("<rss version=\"2.0\">");
        sb.AppendLine("  <channel>");
        sb.AppendLine("    <title>书鸿 · Juno Mak</title>");
        sb.AppendLine($"    <link>{_baseUrl}</link>");
        sb.AppendLine("    <description>Backend, cloud native, gateway, cache, object storage and AI Agent engineering blog.</description>");

        foreach (var article in articles)
        {
            var pubDate = article.PublishedAt?.ToString("ddd, dd MMM yyyy HH:mm:ss GMT") ?? DateTime.UtcNow.ToString("ddd, dd MMM yyyy HH:mm:ss GMT");
            var url = $"{_baseUrl}/blog/{article.Slug}";

            sb.AppendLine("    <item>");
            sb.AppendLine($"      <title>{XmlEncode(article.Title)}</title>");
            sb.AppendLine($"      <link>{XmlEncode(url)}</link>");
            sb.AppendLine($"      <pubDate>{pubDate}</pubDate>");
            sb.AppendLine($"      <description>{XmlEncode(article.Description)}</description>");
            sb.AppendLine("    </item>");
        }

        sb.AppendLine("  </channel>");
        sb.AppendLine("</rss>");

        return sb.ToString();
    }

    private static string XmlEncode(string value)
    {
        if (string.IsNullOrEmpty(value)) return value;
        return value
            .Replace("&", "&amp;")
            .Replace("<", "&lt;")
            .Replace(">", "&gt;")
            .Replace("\"", "&quot;")
            .Replace("'", "&apos;");
    }
}
