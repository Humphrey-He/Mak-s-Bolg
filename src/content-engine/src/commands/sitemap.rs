//! Sitemap command

use crate::parser::mdx::parse_mdx;
use anyhow::{Context, Result};
use std::fs;
use std::path::Path;

/// Run the sitemap command
pub fn run(path: &str, base_url: &str, output: &str) -> Result<()> {
    let path = Path::new(path);

    // Collect all MDX files with their slugs
    let mut items = Vec::new();

    for entry in walkdir::WalkDir::new(path)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().map(|ext| ext == "mdx").unwrap_or(false))
    {
        let content = fs::read_to_string(entry.path())
            .with_context(|| format!("Failed to read: {}", entry.path().display()))?;

        let filename = entry
            .path()
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("unknown");

        match parse_mdx(&content, filename) {
            Ok(article) => {
                items.push((article.slug, article.frontmatter.date));
            }
            Err(e) => eprintln!("[WARN] Skipping {}: {}", entry.path().display(), e),
        }
    }

    // Sort by date descending
    items.sort_by(|a, b| b.1.cmp(&a.1));

    // Generate sitemap
    let mut xml = String::new();
    xml.push_str(r#"<?xml version="1.0" encoding="UTF-8"?>"#);
    xml.push_str("\n");
    xml.push_str(r#"<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">"#);
    xml.push_str("\n");

    let base_url = base_url.trim_end_matches('/');

    for (slug, date) in &items {
        let url = format!("{}/{}", base_url, slug);
        xml.push_str("  <url>\n");
        xml.push_str(&format!("    <loc>{}</loc>\n", url));
        xml.push_str(&format!("    <lastmod>{}</lastmod>\n", date));
        xml.push_str("    <changefreq>weekly</changefreq>\n");
        xml.push_str("    <priority>0.8</priority>\n");
        xml.push_str("  </url>\n");
    }

    xml.push_str("</urlset>\n");

    fs::write(output, xml)?;
    println!("Sitemap generated: {}", output);

    Ok(())
}
