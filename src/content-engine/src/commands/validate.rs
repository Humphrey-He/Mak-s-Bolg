//! Validate command

use crate::parser::mdx::{parse_mdx, ParsedArticle};
use crate::validator::rules::validate;
use anyhow::{Context, Result};
use std::fs;
use std::path::Path;

/// Run the validate command
pub fn run(path: &str) -> Result<()> {
    let path = Path::new(path);

    if path.is_file() {
        validate_file(path)?;
    } else if path.is_dir() {
        validate_directory(path)?;
    } else {
        anyhow::bail!("Path does not exist: {}", path.display());
    }

    Ok(())
}

fn validate_file(path: &Path) -> Result<()> {
    let content = fs::read_to_string(path)
        .with_context(|| format!("Failed to read file: {}", path.display()))?;

    let filename = path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("unknown");

    match parse_mdx(&content, filename) {
        Ok(article) => {
            let errors = validate(&article);

            if errors.is_empty() {
                println!("[OK] {}", path.display());
            } else {
                for error in &errors {
                    let line_info = error.line.map(|l| format!(":{}", l)).unwrap_or_default();
                    if error.code.starts_with('E') {
                        eprintln!("[{}] {}{} - {}", path.display(), error.code, line_info, error.message);
                    } else {
                        println!("[{}] {}{} - {}", path.display(), error.code, line_info, error.message);
                    }
                }
            }
        }
        Err(e) => {
            eprintln!("[PARSE ERROR] {} - {}", path.display(), e);
        }
    }

    Ok(())
}

fn validate_directory(path: &Path) -> Result<()> {
    let mut has_errors = false;

    for entry in walkdir::WalkDir::new(path)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().map(|ext| ext == "mdx").unwrap_or(false))
    {
        if let Err(e) = validate_file(entry.path()) {
            eprintln!("[ERROR] {} - {}", entry.path().display(), e);
            has_errors = true;
        }
    }

    if has_errors {
        anyhow::bail!("Validation completed with errors");
    }

    Ok(())
}
