#!/usr/bin/env node
/**
 * MDX Frontmatter Validator
 * Validates MDX files against the blog's frontmatter schema
 *
 * Error codes:
 * - E001: title empty or > 100 chars
 * - E002: slug (filename) has invalid chars
 * - E003: date format not YYYY-MM-DD
 * - E004: tag format incorrect (must be "Lang / Category")
 * - E005: content is empty
 * - W001: description > 200 chars
 * - W002: no code blocks found
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');

// Tag format: "Lang / Category" or simple tag
const TAG_PATTERN = /^[\w\-\s\/\.]+$/;

function getSlugFromFilename(filename) {
  return filename.replace(/\.mdx?$/, '');
}

function validateSlug(slug) {
  // Slug should only contain alphanumeric, hyphens, and underscores
  return /^[a-zA-Z0-9_-]+$/.test(slug);
}

function validateDate(dateStr) {
  // YYYY-MM-DD format
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateStr)) {
    return false;
  }
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
}

function validateTag(tag) {
  if (!tag || typeof tag !== 'string') {
    return false;
  }
  return TAG_PATTERN.test(tag) && tag.length <= 50;
}

function parseFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    return { frontmatter: {}, content: content };
  }

  const fmString = fmMatch[1];
  const frontmatter = {};
  const contentWithoutFm = content.slice(fmMatch[0].length);

  // Simple YAML-like parsing for frontmatter
  const lines = fmString.split('\n');
  let currentKey = null;
  let currentValue = '';
  let inMultiline = false;

  for (const line of lines) {
    // Check for multiline string ending
    if (inMultiline) {
      if (line.match(/^(\s*)"?\s*$/)) {
        // End of multiline
        frontmatter[currentKey] = currentValue.trim();
        inMultiline = false;
        currentKey = null;
        currentValue = '';
      } else {
        currentValue += '\n' + line;
      }
      continue;
    }

    // Check for multiline string start
    const multilineMatch = line.match(/^(\w+):\s*\|\s*$/);
    if (multilineMatch) {
      currentKey = multilineMatch[1];
      inMultiline = true;
      continue;
    }

    // Simple key: value parsing
    const keyValueMatch = line.match(/^(\w+):\s*["']?(.*?)["']?\s*$/);
    if (keyValueMatch) {
      const key = keyValueMatch[1];
      let value = keyValueMatch[2];

      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      frontmatter[key] = value;
    }
  }

  return { frontmatter, content: contentWithoutFm };
}

function validateMdxFile(filepath) {
  const filename = path.basename(filepath);
  const slug = getSlugFromFilename(filename);
  const errors = [];
  const warnings = [];

  const content = fs.readFileSync(filepath, 'utf-8');
  const { frontmatter, content: body } = parseFrontmatter(content);

  // E001: title empty or > 100 chars
  const title = frontmatter.title || '';
  if (!title || title.length === 0) {
    errors.push({ code: 'E001', message: 'title is empty' });
  } else if (title.length > 100) {
    errors.push({ code: 'E001', message: `title exceeds 100 characters (${title.length})` });
  }

  // E002: slug has invalid chars
  if (!validateSlug(slug)) {
    errors.push({ code: 'E002', message: `slug "${slug}" contains invalid characters` });
  }

  // E003: date format not YYYY-MM-DD
  const date = frontmatter.date || '';
  if (!date) {
    errors.push({ code: 'E003', message: 'date is missing' });
  } else if (!validateDate(date)) {
    errors.push({ code: 'E003', message: `date "${date}" is not in YYYY-MM-DD format` });
  }

  // E004: tag format incorrect
  const tag = frontmatter.tag || '';
  if (!tag) {
    errors.push({ code: 'E004', message: 'tag is missing' });
  } else if (!validateTag(tag)) {
    errors.push({ code: 'E004', message: `tag "${tag}" has invalid format` });
  }

  // E005: content is empty
  const trimmedBody = body.trim();
  if (!trimmedBody || trimmedBody.length === 0) {
    errors.push({ code: 'E005', message: 'content body is empty' });
  }

  // W001: description > 200 chars
  const description = frontmatter.description || '';
  if (description.length > 200) {
    warnings.push({ code: 'W001', message: `description exceeds 200 characters (${description.length})` });
  }

  // W002: no code blocks found
  const codeBlockMatch = body.match(/```[\s\S]*?```/g);
  if (!codeBlockMatch || codeBlockMatch.length === 0) {
    warnings.push({ code: 'W002', message: 'no code blocks found' });
  }

  return { filename, slug, errors, warnings };
}

function main() {
  console.log('='.repeat(60));
  console.log('MDX Frontmatter Validator');
  console.log('='.repeat(60));
  console.log();

  // Get all MDX files
  let files;
  try {
    files = fs.readdirSync(POSTS_DIR)
      .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
      .map(f => path.join(POSTS_DIR, f));
  } catch (err) {
    console.error(`Error reading posts directory: ${err.message}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log('No MDX files found in content/posts/');
    process.exit(0);
  }

  console.log(`Found ${files.length} MDX file(s)\n`);

  let totalErrors = 0;
  let totalWarnings = 0;
  const allResults = [];

  for (const filepath of files) {
    const result = validateMdxFile(filepath);
    allResults.push(result);

    if (result.errors.length > 0 || result.warnings.length > 0) {
      console.log(`File: ${result.filename}`);
      console.log(`Slug: ${result.slug}`);

      if (result.errors.length > 0) {
        console.log('  ERRORS:');
        for (const err of result.errors) {
          console.log(`    [${err.code}] ${err.message}`);
        }
      }

      if (result.warnings.length > 0) {
        console.log('  WARNINGS:');
        for (const warn of result.warnings) {
          console.log(`    [${warn.code}] ${warn.message}`);
        }
      }
      console.log();
    }

    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
  }

  // Summary
  console.log('-'.repeat(60));
  console.log('SUMMARY');
  console.log('-'.repeat(60));
  console.log(`Total files: ${files.length}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);
  console.log();

  if (totalErrors > 0) {
    console.log('VALIDATION FAILED: Errors found');
    console.log();
    console.log('Error codes:');
    console.log('  E001: title empty or > 100 chars');
    console.log('  E002: slug (filename) has invalid chars');
    console.log('  E003: date format not YYYY-MM-DD');
    console.log('  E004: tag format incorrect');
    console.log('  E005: content is empty');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('VALIDATION PASSED with warnings');
    console.log();
    console.log('Warning codes:');
    console.log('  W001: description > 200 chars');
    console.log('  W002: no code blocks found');
    process.exit(0);
  } else {
    console.log('VALIDATION PASSED: All files conform to schema');
    process.exit(0);
  }
}

main();
