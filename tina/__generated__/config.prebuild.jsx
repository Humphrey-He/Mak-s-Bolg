// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "\u535A\u5BA2\u6587\u7AE0",
        path: "content/posts",
        format: "mdx",
        ui: {
          router: ({ document }) => {
            const doc = document;
            return `/blog/${doc.slug || doc._sys.filename}`;
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "\u6807\u9898",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "slug",
            label: "URL Slug",
            required: true,
            description: "\u5EFA\u8BAE\u4E0E\u6587\u4EF6\u540D\u4FDD\u6301\u4E00\u81F4\uFF0C\u4F8B\u5982 high-concurrency-go-cache"
          },
          {
            type: "datetime",
            name: "date",
            label: "\u53D1\u5E03\u65E5\u671F",
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "\u6458\u8981",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "tag",
            label: "\u6807\u7B7E"
          },
          {
            type: "string",
            name: "readTime",
            label: "\u9605\u8BFB\u65F6\u95F4"
          },
          {
            type: "boolean",
            name: "top",
            label: "\u7F6E\u9876"
          },
          {
            type: "boolean",
            name: "featured",
            label: "\u7CBE\u9009"
          },
          {
            type: "rich-text",
            name: "body",
            label: "\u6B63\u6587",
            isBody: true
          }
        ]
      },
      {
        name: "project",
        label: "\u9879\u76EE",
        path: "content/projects",
        format: "mdx",
        ui: {
          router: ({ document }) => {
            const doc = document;
            return `/projects/${doc.slug || doc._sys.filename}`;
          }
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "\u9879\u76EE\u540D\u79F0",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "slug",
            label: "URL Slug",
            required: true
          },
          {
            type: "string",
            name: "type",
            label: "\u9879\u76EE\u7C7B\u578B"
          },
          {
            type: "string",
            name: "desc",
            label: "\u63CF\u8FF0",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "repoUrl",
            label: "\u4ED3\u5E93\u5730\u5740"
          },
          {
            type: "string",
            name: "techStack",
            label: "\u6280\u672F\u6808",
            list: true
          },
          {
            type: "string",
            name: "highlights",
            label: "\u6838\u5FC3\u4EAE\u70B9",
            list: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "\u6B63\u6587",
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
