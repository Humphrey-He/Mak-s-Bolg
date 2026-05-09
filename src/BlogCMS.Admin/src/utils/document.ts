import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export interface ParsedDocument {
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
}

/**
 * Parse frontmatter from MD/MDX content
 */
export function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const [, frontmatterStr, body] = match;
  const frontmatter: Record<string, unknown> = {};

  // Simple YAML parsing for basic key-value pairs
  frontmatterStr.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      frontmatter[key.trim()] = value;
    }
  });

  return { frontmatter, body };
}

/**
 * Extract title from MD/MDX content
 */
export function extractTitle(body: string, frontmatter: Record<string, unknown>): string {
  if (frontmatter.title) return String(frontmatter.title);

  // Try to find first H1 heading
  const h1Match = body.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();

  // Try to find first H2 heading
  const h2Match = body.match(/^##\s+(.+)$/m);
  if (h2Match) return h2Match[1].trim();

  return 'Untitled';
}

/**
 * Extract tags from frontmatter or content
 */
export function extractTags(frontmatter: Record<string, unknown>): string[] {
  if (frontmatter.tags) {
    const tags = frontmatter.tags;
    if (Array.isArray(tags)) return tags.map(String);
    if (typeof tags === 'string') return tags.split(',').map((t) => t.trim());
  }
  return [];
}

/**
 * Import MD/MDX file
 */
export async function importMdFile(file: File): Promise<ParsedDocument> {
  const content = await file.text();
  const { frontmatter, body } = parseFrontmatter(content);

  const title = extractTitle(body, frontmatter);
  const slug = frontmatter.slug
    ? String(frontmatter.slug)
    : title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
  const description = frontmatter.description ? String(frontmatter.description) : '';
  const tags = extractTags(frontmatter);

  // Remove frontmatter and title heading from body
  let cleanBody = body;
  if (body.match(/^#\s+.+$/m)) {
    cleanBody = body.replace(/^#\s+.+\n+/, '');
  }

  return { title, slug, description, content: cleanBody.trim(), tags };
}

/**
 * Import Word document
 */
export async function importWordFile(file: File): Promise<ParsedDocument> {
  const arrayBuffer = await file.arrayBuffer();

  // Convert to markdown using mammoth
  const result = await mammothConverter({ arrayBuffer });
  const content = result.value;

  const { frontmatter, body } = parseFrontmatter(content);
  const title = extractTitle(body, frontmatter);
  const slug = frontmatter.slug
    ? String(frontmatter.slug)
    : title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
  const description = frontmatter.description ? String(frontmatter.description) : '';
  const tags = extractTags(frontmatter);

  let cleanBody = body;
  if (body.match(/^#\s+.+$/m)) {
    cleanBody = body.replace(/^#\s+.+\n+/, '');
  }

  return { title, slug, description, content: cleanBody.trim(), tags };
}

// mammoth converter with proper typing
const mammothConverter = (options: { arrayBuffer: ArrayBuffer }) =>
  (mammoth as unknown as { convertToMarkdown: (opts: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string; messages: unknown[] }> }).convertToMarkdown(options);

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9一-龥]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Convert markdown to plain text (for Word export)
 */
function markdownToPlainText(md: string): string {
  return md
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    // Remove headers markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Normalize line breaks
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Convert markdown to LaTeX
 */
function markdownToLatex(md: string): string {
  let latex = md
    // Escape special LaTeX characters first
    .replace(/([\\{}$#%&_])/g, '\\$1')
    // Convert headers
    .replace(/^#### (.+)$/gm, '\\subsubsection{$1}')
    .replace(/^### (.+)$/gm, '\\paragraph{$1}')
    .replace(/^## (.+)$/gm, '\\subparagraph{$1}')
    .replace(/^# (.+)$/gm, '\\section{$1}')
    // Convert bold
    .replace(/\*\*(.+?)\*\*/g, '\\textbf{$1}')
    .replace(/__(.+?)__/g, '\\textbf{$1}')
    // Convert italic
    .replace(/\*(.+?)\*/g, '\\textit{$1}')
    .replace(/_(.+?)_/g, '\\textit{$1}')
    // Convert code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '\\begin{verbatim}\n$2\\end{verbatim}')
    // Convert inline code
    .replace(/`([^`]+)`/g, '\\texttt{$1}')
    // Convert links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '\\href{$2}{$1}')
    // Convert images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '\\begin{figure}[h]\n\\centering\n\\includegraphics{$2}\n\\caption{$1}\n\\end{figure}')
    // Convert blockquotes
    .replace(/^>\s+(.+)$/gm, '\\begin{quote}$1\\end{quote}')
    // Convert lists
    .replace(/^\s*[-*]\s+(.+)$/gm, '\\item $1')
    .replace(/^\s*(\d+)\.\s+(.+)$/gm, '\\item $2')
    // Convert horizontal rules
    .replace(/^[-*_]{3,}$/gm, '\\hline')
    // Convert line breaks to paragraphs
    .replace(/\n\n/g, '\n\\paragraph{}\n');

  return latex;
}

/**
 * Export article as Markdown
 */
export function exportAsMarkdown(article: {
  title: string;
  content: string;
  description?: string;
  tags?: string;
}): string {
  const { title, content, description, tags } = article;
  const frontmatter = [
    '---',
    `title: "${title}"`,
    `description: "${description || ''}"`,
    `date: "${new Date().toISOString().split('T')[0]}"`,
    tags ? `tags: [${tags.split(',').map((t) => `"${t.trim()}"`).join(', ')}]` : null,
    '---',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  return `${frontmatter}\n# ${title}\n\n${content}`;
}

/**
 * Export article as Word document
 */
export async function exportAsWord(article: {
  title: string;
  content: string;
  description?: string;
}): Promise<Blob> {
  const { title, content, description } = article;
  const plainText = markdownToPlainText(content);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
          }),
          ...(description
            ? [
                new Paragraph({
                  text: description,
                  heading: HeadingLevel.HEADING_2,
                }),
              ]
            : []),
          ...plainText.split('\n\n').map(
            (text) =>
              new Paragraph({
                children: [new TextRun(text)],
              })
          ),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Export article as LaTeX
 */
export function exportAsLatex(article: {
  title: string;
  content: string;
  description?: string;
  tags?: string;
}): string {
  const { title, content, description, tags } = article;
  const latexContent = markdownToLatex(content);

  return `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{hyperref}
\\usepackage{graphicx}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}

\\title{${title}}
\\author{Blog Author}
${description ? `\\date{${new Date().toLocaleDateString()}}` : ''}
${tags ? `\\usepackage[]{biblatex}` : ''}

\\begin{document}

\\maketitle

${latexContent}

\\end{document}`;
}
