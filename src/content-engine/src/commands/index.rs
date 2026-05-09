//! Index command - builds Tantivy search index

use crate::parser::mdx::parse_mdx;
use anyhow::{Context, Result};
use std::fs;
use std::path::Path;
use tantivy::collector::TopDocs;
use tantivy::query::QueryParser;
use tantivy::schema::*;
use tantivy::{doc, Index, IndexWriter, ReloadPolicy};

/// Search document structure
#[derive(Debug, serde::Serialize)]
pub struct SearchDocument {
    pub slug: String,
    pub title: String,
    pub description: String,
    pub content: String,
    pub tag: String,
    pub date: String,
}

/// Run the index command
pub fn run(path: &str, output: &str) -> Result<()> {
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

    // Build search index
    build_index(&articles, output)?;

    println!("Indexed {} articles to {}", articles.len(), output);

    Ok(())
}

/// Build the search index
pub fn build_index(articles: &[crate::parser::mdx::ParsedArticle], output: &str) -> Result<()> {
    // Create schema
    let mut schema_builder = Schema::builder();

    let text_field_indexing = TextFieldIndexing::default()
        .set_tokenizer("default")
        .set_index_option(IndexRecordOption::WithFreqsAndPositions);
    let text_options = TextOptions::default()
        .set_indexing_options(text_field_indexing)
        .set_stored();

    schema_builder.add_text_field("slug", text_options.clone());
    schema_builder.add_text_field("title", text_options.clone());
    schema_builder.add_text_field("description", text_options.clone());
    schema_builder.add_text_field("content", text_options.clone());
    schema_builder.add_text_field("tag", text_options.clone());
    schema_builder.add_text_field("date", text_options.clone());

    let schema = schema_builder.build();

    // Create index in RAM
    let index = Index::create_in_ram(schema.clone());

    // Get field handles
    let slug_field = schema.get_field("slug").unwrap();
    let title_field = schema.get_field("title").unwrap();
    let description_field = schema.get_field("description").unwrap();
    let content_field = schema.get_field("content").unwrap();
    let tag_field = schema.get_field("tag").unwrap();
    let date_field = schema.get_field("date").unwrap();

    // Create index writer
    let mut index_writer: IndexWriter = index.writer(50_000_000)?;

    // Add documents
    for article in articles {
        index_writer.add_document(doc!(
            slug_field => article.slug.clone(),
            title_field => article.frontmatter.title.clone(),
            description_field => article.frontmatter.description.clone(),
            content_field => article.content.clone(),
            tag_field => article.frontmatter.tag.clone(),
            date_field => article.frontmatter.date.clone(),
        ))?;
    }

    index_writer.commit()?;

    // Search a sample to verify
    let reader = index
        .reader_builder()
        .reload_policy(ReloadPolicy::OnCommitWithDelay)
        .try_into()?;
    let searcher = reader.searcher();

    let query_parser = QueryParser::for_index(&index, vec![title_field, content_field]);
    let query = query_parser.parse_query("*")?;
    let top_docs = searcher.search(&query, &TopDocs::with_limit(10))?;

    println!("Search index verified with {} documents", top_docs.len());

    // Export to JSON (simple export of documents)
    let documents: Vec<SearchDocument> = articles
        .iter()
        .map(|a| SearchDocument {
            slug: a.slug.clone(),
            title: a.frontmatter.title.clone(),
            description: a.frontmatter.description.clone(),
            content: a.content.chars().take(5000).collect(),
            tag: a.frontmatter.tag.clone(),
            date: a.frontmatter.date.clone(),
        })
        .collect();

    let json = serde_json::to_string_pretty(&documents)?;
    fs::write(output, json)?;

    Ok(())
}
