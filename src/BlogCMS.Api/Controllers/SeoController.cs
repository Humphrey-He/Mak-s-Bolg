using Microsoft.AspNetCore.Mvc;
using BlogCMS.Api.Services;

namespace BlogCMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeoController : ControllerBase
{
    private readonly SeoService _seoService;

    public SeoController(SeoService seoService)
    {
        _seoService = seoService;
    }

    [HttpGet("sitemap")]
    public async Task<IActionResult> GetSitemap()
    {
        var sitemap = await _seoService.GenerateSitemapAsync();
        return Content(sitemap, "application/xml");
    }

    [HttpGet("rss")]
    public async Task<IActionResult> GetRss()
    {
        var rss = await _seoService.GenerateRssFeedAsync();
        return Content(rss, "application/xml");
    }
}
