import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "博客文章",
        path: "content/posts",
        format: "mdx",
        ui: {
          router: ({ document }) => { const doc = document as { slug?: string; _sys: { filename: string } }; return `/blog/${doc.slug || doc._sys.filename}`; },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "标题",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "URL Slug",
            required: true,
            description: "建议与文件名保持一致，例如 high-concurrency-go-cache",
          },
          {
            type: "datetime",
            name: "date",
            label: "发布日期",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "摘要",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "tag",
            label: "标签",
          },
          {
            type: "string",
            name: "series",
            label: "系列栏目",
            description: "例如 Redis 核心原理与实战、Kubernetes、Go Modules",
          },
          {
            type: "string",
            name: "seriesSlug",
            label: "系列 Slug",
            description: "稳定英文标识，例如 redis-core、kubernetes、go-modules",
          },
          {
            type: "number",
            name: "seriesOrder",
            label: "系列内排序",
          },
          {
            type: "string",
            name: "readTime",
            label: "阅读时间",
          },
          {
            type: "boolean",
            name: "top",
            label: "置顶",
          },
          {
            type: "boolean",
            name: "featured",
            label: "精选",
          },
          {
            type: "rich-text",
            name: "body",
            label: "正文",
            isBody: true,
          },
        ],
      },
      {
        name: "project",
        label: "项目",
        path: "content/projects",
        format: "mdx",
        ui: {
          router: ({ document }) => { const doc = document as { slug?: string; _sys: { filename: string } }; return `/projects/${doc.slug || doc._sys.filename}`; },
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "项目名称",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "URL Slug",
            required: true,
          },
          {
            type: "string",
            name: "type",
            label: "项目类型",
          },
          {
            type: "string",
            name: "desc",
            label: "描述",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "repoUrl",
            label: "仓库地址",
          },
          {
            type: "string",
            name: "techStack",
            label: "技术栈",
            list: true,
          },
          {
            type: "string",
            name: "highlights",
            label: "核心亮点",
            list: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "正文",
            isBody: true,
          },
        ],
      },
    ],
  },
});

