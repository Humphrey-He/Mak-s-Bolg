//! RSS command

use crate::parser::mdx::parse_mdx;
use anyhow::{Context, Result};
use chrono::Utc;
use std::fs;
use std::path::Path;

/// Run the RSS command
pub fn run(
    path: &str,
    base_url: &str,
    output: &str,
    title: &str,
    description: &str,
) -> Result<()> {
    let path = Path::new(path);

    // Collect all MDX files
    let mut articles = Vec::new();

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
            Ok(article) => articles.push(article),
            Err(e) => eprintln!("[WARN] Skipping {}: {}", entry.path().display(), e),
        }
    }

    // Sort by date descending
    articles.sort_by(|a, b| b.frontmatter.date.cmp(&a.frontmatter.date));

    // Generate RSS
    let base_url = base_url.trim_end_matches('/');
    let now = Utc::now().format("%a, %d %b %Y %H:%M:%S GMT").to_string();

    let mut xml = String::new();
    xml.push_str(r#"<?xml version="1.0" encoding="UTF-8"?>"#);
    xml.push_str("\n");
    xml.push_str(r#"<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">"#);
    xml.push_str("\n");
    xml.push_str("  <channel>\n");
    xml.push_str(&format!("    <title>{}</title>\n", escape_xml(title)));
    xml.push_str(&format!("    <description>{}</description>\n", escape_xml(description)));
    xml.push_str(&format!("    <link>{}</link>\n", base_url));
    xml.push_str(&format!("    <lastBuildDate>{}</lastBuildDate>\n", now));
    xml.push_str(&format!("    <atom:link href=\"{}/feed.xml\" rel=\"self\" type=\"application/rss+xml\"/>\n", base_url));
    xml.push_str("    <language>zh-cn</language>\n");

    for article in articles.iter().take(20) {
        let url = format!("{}/{}", base_url, article.slug);
        let pub_date = format_rss_date(&article.frontmatter.date);

        xml.push_str("    <item>\n");
        xml.push_str(&format!("      <title>{}</title>\n", escape_xml(&article.frontmatter.title)));
        xml.push_str(&format!("      <link>{}</link>\n", url));
        xml.push_str(&format!("      <guid>{}</guid>\n", url));
        xml.push_str(&format!("      <description>{}</description>\n", escape_xml(&article.frontmatter.description)));
        xml.push_str(&format!("      <pubDate>{}</pubDate>\n", pub_date));
        xml.push_str(&format!("      <category>{}</category>\n", escape_xml(&article.frontmatter.tag)));
        xml.push_str("    </item>\n");
    }

    xml.push_str("  </channel>\n");
    xml.push_str("</rss>\n");

    fs::write(output, xml)?;
    println!("RSS feed generated: {}", output);

    Ok(())
}

fn escape_xml(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&apos;")
}

fn format_rss_date(date: &str) -> String {
    // Convert YYYY-MM-DD to RSS date format
    // Example: 2026-05-08 -> Sat, 08 May 2026 00:00:00 GMT
    if let Ok(parsed) = chrono::NaiveDate::parse_from_str(date, "%Y-%m-%d") {
        parsed.format("%a, %d %b %Y 00:00:00 GMT").to_string()
    } else {
        date.to_string()
    }
}
