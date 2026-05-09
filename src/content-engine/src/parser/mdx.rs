//! MDX Parser
//!
//! Parses MDX files extracting frontmatter and content.

use anyhow::{anyhow, Result};
use regex::Regex;
use serde::{Deserialize, Serialize};

/// Frontmatter extracted from MDX
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Frontmatter {
    pub title: String,
    pub description: String,
    pub date: String,
    pub tag: String,
    #[serde(rename = "readTime")]
    pub read_time: String,
    pub top: bool,
    pub featured: bool,
}

/// Parsed article with frontmatter and content
#[derive(Debug, Clone)]
pub struct ParsedArticle {
    pub slug: String,
    pub frontmatter: Frontmatter,
    pub content: String,
    pub code_blocks: Vec<String>,
    pub links: Vec<String>,
}

/// Parse MDX content and extract frontmatter
pub fn parse_mdx(content: &str, filename: &str) -> Result<ParsedArticle> {
    // Extract frontmatter between --- markers
    let frontmatter_re = Regex::new(r"(?s)^---\n(.*?)\n---").unwrap();

    let captures = frontmatter_re
        .captures(content)
        .ok_or_else(|| anyhow!("Missing frontmatter delimiter in {}", filename))?;

    let frontmatter_str = &captures[1];

    // Parse YAML-like frontmatter
    let frontmatter = parse_frontmatter(frontmatter_str)?;

    // Extract content after frontmatter
    let content_start = captures.get(0).unwrap().end();
    let article_content = content[content_start..].trim();

    // Extract code blocks
    let code_blocks = extract_code_blocks(article_content);

    // Extract links
    let links = extract_links(article_content);

    // Derive slug from filename
    let slug = filename
        .trim_end_matches(".mdx")
        .to_string();

    Ok(ParsedArticle {
        slug,
        frontmatter,
        content: article_content.to_string(),
        code_blocks,
        links,
    })
}

fn parse_frontmatter(frontmatter_str: &str) -> Result<Frontmatter> {
    let mut title = String::new();
    let mut description = String::new();
    let mut date = String::new();
    let mut tag = String::new();
    let mut read_time = String::new();
    let mut top = false;
    let mut featured = false;

    for line in frontmatter_str.lines() {
        let line = line.trim();

        if let Some(value) = extract_yaml_field(line, "title") {
            title = value;
        } else if let Some(value) = extract_yaml_field(line, "description") {
            description = value;
        } else if let Some(value) = extract_yaml_field(line, "date") {
            date = value;
        } else if let Some(value) = extract_yaml_field(line, "tag") {
            tag = value;
        } else if let Some(value) = extract_yaml_field(line, "readTime") {
            read_time = value;
        } else if let Some(value) = extract_yaml_bool(line, "top") {
            top = value;
        } else if let Some(value) = extract_yaml_bool(line, "featured") {
            featured = value;
        }
    }

    if title.is_empty() {
        anyhow::bail!("title is required");
    }

    Ok(Frontmatter {
        title,
        description,
        date,
        tag,
        read_time,
        top,
        featured,
    })
}

fn extract_yaml_field(line: &str, field: &str) -> Option<String> {
    let pattern = format!("^{}:", field);
    if line.starts_with(&pattern) {
        let value = line[pattern.len()..].trim();
        // Remove surrounding quotes if present
        let value = value.trim_matches('"').trim_matches('\'');
        Some(value.to_string())
    } else {
        None
    }
}

fn extract_yaml_bool(line: &str, field: &str) -> Option<bool> {
    let pattern = format!("^{}:", field);
    if line.starts_with(&pattern) {
        let value = line[pattern.len()..].trim();
        match value {
            "true" => Some(true),
            "false" => Some(false),
            _ => None,
        }
    } else {
        None
    }
}

fn extract_code_blocks(content: &str) -> Vec<String> {
    let re = Regex::new(r"```[\s\S]*?```").unwrap();
    re.find_iter(content)
        .map(|m| m.as_str().to_string())
        .collect()
}

fn extract_links(content: &str) -> Vec<String> {
    let re = Regex::new(r"\[([^\]]+)\]\(([^)]+)\)").unwrap();
    re.captures_iter(content)
        .filter_map(|cap| {
            let url = cap.get(2)?.as_str().to_string();
            // Filter out anchor links and external URLs
            if url.starts_with("http://") || url.starts_with("https://") || url.starts_with('/') {
                Some(url)
            } else {
                None
            }
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_frontmatter() {
        let content = r#"---
title: "Test Title"
description: "Test description"
date: "2026-05-08"
tag: "Go / Cache"
readTime: "10 min"
top: true
featured: false
---

## Content"#;

        let result = parse_mdx(content, "test.mdx");
        assert!(result.is_ok());

        let article = result.unwrap();
        assert_eq!(article.slug, "test");
        assert_eq!(article.frontmatter.title, "Test Title");
        assert_eq!(article.frontmatter.date, "2026-05-08");
        assert!(article.frontmatter.top);
    }

    #[test]
    fn test_extract_code_blocks() {
        let content = r#"Some text with ```go code block ``` and more text"#;
        let blocks = extract_code_blocks(content);
        assert_eq!(blocks.len(), 1);
    }
}
