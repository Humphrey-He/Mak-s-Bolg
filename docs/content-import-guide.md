# 内容导入与图片路径说明

更新日期：2026-05-08

## 1. 技术文章文档位置

博客文章请放在：

- `content/posts/*.mdx`

每篇文章一个文件，文件名同时也是默认 slug 兜底。

例如：

- `content/posts/high-concurrency-go-cache.mdx`

## 2. Frontmatter 必填字段

推荐每篇文章至少包含：

```mdx
---
slug: "high-concurrency-go-cache"
title: "从零构建一个高并发 Go 缓存系统"
description: "记录 HCache 的分片设计、W-TinyLFU 准入策略、内存控制与多核并发优化实践。"
date: "2026-04-18"
tag: "Go / Cache"
readTime: "12 min"
top: true
featured: true
---
```

说明：

- 现在系统会优先读取 `frontmatter.slug`
- 如果没有 `slug`，才会退回使用文件名
- 最稳的做法是让 `slug` 和文件名保持一致

## 3. 图片位置

文章图片统一放在：

- `public/uploads/posts/<slug>/`

例如：

- `public/uploads/posts/high-concurrency-go-cache/overview.png`

## 4. 图片引用方式

在 MDX 里这样引用：

```mdx
![架构图](/uploads/posts/high-concurrency-go-cache/overview.png)
```

不要写本地绝对路径，也不要写 Windows 盘符路径。

## 5. 导入建议

推荐的导入顺序：

1. 新建文章文件到 `content/posts/`
2. 补 frontmatter
3. 把图片放到 `public/uploads/posts/<slug>/`
4. 在正文里用 `/uploads/...` 引用
5. 运行：
   - `npm run verify:static-mdx`
   - `npm run build`

## 6. TinaCMS 对齐说明

当前 Tina 配置已经与这套规则对齐：

- 文章源目录：`content/posts`
- 媒体目录：`public/uploads`
- 路由优先使用 `slug`
