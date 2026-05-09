# Content Engine CLI

A Rust-based CLI tool for validating, indexing, and generating feeds from blog MDX content.

## Features

- **Validate**: Check MDX frontmatter and content for errors
- **Index**: Build a Tantivy search index from MDX files
- **Sitemap**: Generate XML sitemap for SEO
- **RSS**: Generate RSS 2.0 feed

## Installation

```bash
cargo build --release
```

The binary will be at `target/release/content-cli.exe` (or `content-cli` on Unix).

## Usage

### Validate

Check a single file:
```bash
content-cli validate content/posts/wtinylfu-algorithm.mdx
```

Check all files in a directory:
```bash
content-cli validate content/posts/
```

### Index

Build search index:
```bash
content-cli index content/posts/ --out public/search-index.json
```

### Sitemap

Generate sitemap:
```bash
content-cli sitemap content/posts/ --base-url https://shuhong.icu --out public/sitemap.xml
```

### RSS

Generate RSS feed:
```bash
content-cli rss content/posts/ \
  --base-url https://shuhong.icu \
  --out public/feed.xml \
  --title "书鸿 · Juno Mak" \
  --description "Backend engineering blog"
```

## Validation Rules

### Errors (Exxx)
- **E001**: title empty or exceeds 100 characters
- **E002**: slug format invalid (should be lowercase with hyphens)
- **E003**: date not in YYYY-MM-DD format
- **E004**: tag not in "Lang / Category" format
- **E005**: content is empty

### Warnings (Wxxx)
- **W001**: description exceeds 200 characters
- **W002**: no code blocks found

## MDX Frontmatter Format

```yaml
---
title: "Article Title"
description: "Article description"
date: "2026-05-08"
tag: "Go / Cache"
readTime: "15 min"
top: true
featured: false
---
```

## License

MIT
