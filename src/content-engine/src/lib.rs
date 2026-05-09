//! Content Engine Library
//!
//! Provides MDX parsing, validation, and content processing utilities.

pub mod parser;
pub mod validator;
pub mod commands;

pub use parser::mdx::{parse_mdx, Frontmatter, ParsedArticle};
pub use validator::rules::{validate, ValidationError};
