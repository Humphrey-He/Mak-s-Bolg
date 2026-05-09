//! Validation Rules
//!
//! Validates MDX articles against defined rules.

use crate::parser::mdx::ParsedArticle;
use regex::Regex;

/// Validation error with code and message
#[derive(Debug, Clone)]
pub struct ValidationError {
    pub code: String,
    pub message: String,
    pub line: Option<usize>,
}

/// Validate an article against all rules
pub fn validate(article: &ParsedArticle) -> Vec<ValidationError> {
    let mut errors = Vec::new();

    // E001: title empty or > 100 chars
    if article.frontmatter.title.is_empty() {
        errors.push(ValidationError {
            code: "E001".to_string(),
            message: "title is empty".to_string(),
            line: None,
        });
    } else if article.frontmatter.title.len() > 100 {
        errors.push(ValidationError {
            code: "E001".to_string(),
            message: format!("title exceeds 100 characters ({} chars)", article.frontmatter.title.len()),
            line: None,
        });
    }

    // E002: slug format (filename) invalid
    let slug_re = Regex::new(r"^[a-z0-9]+(?:-[a-z0-9]+)*$").unwrap();
    if !slug_re.is_match(&article.slug) {
        errors.push(ValidationError {
            code: "E002".to_string(),
            message: format!("slug '{}' has invalid format (should be lowercase with hyphens)", article.slug),
            line: None,
        });
    }

    // E003: date format not YYYY-MM-DD
    let date_re = Regex::new(r"^\d{4}-\d{2}-\d{2}$").unwrap();
    if !date_re.is_match(&article.frontmatter.date) {
        errors.push(ValidationError {
            code: "E003".to_string(),
            message: format!("date '{}' is not in YYYY-MM-DD format", article.frontmatter.date),
            line: None,
        });
    }

    // E004: tag format incorrect (should be "Lang / Category")
    let tag_re = Regex::new(r"^.+\s/\s.+$").unwrap();
    if !tag_re.is_match(&article.frontmatter.tag) {
        errors.push(ValidationError {
            code: "E004".to_string(),
            message: format!("tag '{}' should be in format 'Lang / Category'", article.frontmatter.tag),
            line: None,
        });
    }

    // E005: content is empty
    if article.content.trim().is_empty() {
        errors.push(ValidationError {
            code: "E005".to_string(),
            message: "content is empty".to_string(),
            line: None,
        });
    }

    // W001: description > 200 chars
    if article.frontmatter.description.len() > 200 {
        errors.push(ValidationError {
            code: "W001".to_string(),
            message: format!("description exceeds 200 characters ({} chars)", article.frontmatter.description.len()),
            line: None,
        });
    }

    // W002: no code blocks found
    if article.code_blocks.is_empty() {
        errors.push(ValidationError {
            code: "W002".to_string(),
            message: "no code blocks found".to_string(),
            line: None,
        });
    }

    errors
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::parser::mdx::Frontmatter;

    fn create_test_article(title: &str, slug: &str, date: &str, tag: &str, content: &str) -> ParsedArticle {
        ParsedArticle {
            slug: slug.to_string(),
            frontmatter: Frontmatter {
                title: title.to_string(),
                description: "Test description".to_string(),
                date: date.to_string(),
                tag: tag.to_string(),
                read_time: "10 min".to_string(),
                top: false,
                featured: false,
            },
            content: content.to_string(),
            code_blocks: vec!["```go\ncode\n```".to_string()],
            links: vec![],
        }
    }

    #[test]
    fn test_valid_article() {
        let article = create_test_article(
            "Valid Title",
            "valid-slug",
            "2026-05-08",
            "Go / Cache",
            "Some content",
        );
        let errors = validate(&article);
        assert!(errors.is_empty(), "Expected no errors, got {:?}", errors);
    }

    #[test]
    fn test_empty_title() {
        let article = create_test_article("", "valid-slug", "2026-05-08", "Go / Cache", "Content");
        let errors = validate(&article);
        assert!(errors.iter().any(|e| e.code == "E001"));
    }

    #[test]
    fn test_title_too_long() {
        let article = create_test_article(
            &"A".repeat(101),
            "valid-slug",
            "2026-05-08",
            "Go / Cache",
            "Content",
        );
        let errors = validate(&article);
        assert!(errors.iter().any(|e| e.code == "E001"));
    }

    #[test]
    fn test_invalid_slug() {
        let article = create_test_article(
            "Title",
            "Invalid_Slug",
            "2026-05-08",
            "Go / Cache",
            "Content",
        );
        let errors = validate(&article);
        assert!(errors.iter().any(|e| e.code == "E002"));
    }

    #[test]
    fn test_invalid_date() {
        let article = create_test_article("Title", "valid-slug", "05-08-2026", "Go / Cache", "Content");
        let errors = validate(&article);
        assert!(errors.iter().any(|e| e.code == "E003"));
    }

    #[test]
    fn test_invalid_tag() {
        let article = create_test_article("Title", "valid-slug", "2026-05-08", "InvalidTag", "Content");
        let errors = validate(&article);
        assert!(errors.iter().any(|e| e.code == "E004"));
    }

    #[test]
    fn test_empty_content() {
        let article = create_test_article("Title", "valid-slug", "2026-05-08", "Go / Cache", "");
        let errors = validate(&article);
        assert!(errors.iter().any(|e| e.code == "E005"));
    }

    #[test]
    fn test_description_too_long() {
        let article = ParsedArticle {
            slug: "valid-slug".to_string(),
            frontmatter: Frontmatter {
                title: "Title".to_string(),
                description: "A".repeat(201),
                date: "2026-05-08".to_string(),
                tag: "Go / Cache".to_string(),
                read_time: "10 min".to_string(),
                top: false,
                featured: false,
            },
            content: "Content".to_string(),
            code_blocks: vec![],
            links: vec![],
        };
        let errors = validate(&article);
        assert!(errors.iter().any(|e| e.code == "W001"));
    }

    #[test]
    fn test_no_code_blocks() {
        let article = create_test_article("Title", "valid-slug", "2026-05-08", "Go / Cache", "Content");
        let errors = validate(&article);
        assert!(errors.iter().any(|e| e.code == "W002"));
    }
}
