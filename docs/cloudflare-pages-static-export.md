# Cloudflare Pages 静态部署说明

更新日期：2026-05-08

适用仓库：
- `E:\awesomeProject\Mak's Blog\Mak-s-Bolg-remote`

当前部署模式：
- Next.js App Router
- `output: "export"` 静态导出
- 文章源使用 `content/posts/*.mdx`
- 构建产物输出到 `out/`

## 1. 当前项目为什么适合 Cloudflare Pages

这个项目现在已经满足 Cloudflare Pages 的低成本静态部署条件：

- 没有必须依赖在线服务器的 SSR
- 博客页面都可以在构建阶段预生成
- `blog/[slug]` 使用 `generateStaticParams`
- Next.js 已开启静态导出

当前关键配置在：
- [next.config.js](/E:/awesomeProject/Mak's%20Blog/Mak-s-Bolg-remote/next.config.js)

## 2. 文章管理方式

现在文章统一放在：
- `content/posts/*.mdx`

每篇文章需要 frontmatter，例如：

```mdx
---
title: "从零构建一个高并发 Go 缓存系统"
description: "记录 HCache 的分片设计、W-TinyLFU 准入策略、内存控制与多核并发优化实践。"
date: "2026-04-18"
tag: "Go / Cache"
readTime: "12 min"
top: true
featured: true
---

## 为什么要自己做缓存

正文从这里开始。
```

## 3. 本地检查命令

开发：

```bash
npm run dev
```

静态导出前检查：

```bash
npm run verify:static-mdx
```

生产构建：

```bash
npm run build
```

构建成功后，静态文件会输出到：

```txt
out/
```

## 4. Cloudflare Pages 配置

如果你使用 GitHub 连接 Cloudflare Pages，建议这样配置：

- Framework preset: `Next.js (Static HTML Export)`
- Build command: `npm run build`
- Build output directory: `out`
- Production branch: `main`

如果 Cloudflare 后台没有自动识别，也可以手动填写上面三项。

## 5. 部署步骤

1. 把当前仓库推到 GitHub
2. 登录 Cloudflare Dashboard
3. 打开 `Workers & Pages`
4. 选择 `Create application`
5. 选择 `Pages`
6. 选择 `Import an existing Git repository`
7. 选择这个仓库
8. 在构建配置里填：
   - Build command: `npm run build`
   - Output directory: `out`
9. 点击部署

部署成功后，你会先得到一个：

```txt
https://<project-name>.pages.dev
```

## 6. 自定义域名

如果你后面要绑定自己的域名：

1. 进入 Pages 项目设置
2. 选择 `Custom domains`
3. 添加你的域名
4. 按 Cloudflare 提示补 DNS

如果域名本身就在 Cloudflare 管理，绑定会比较顺。

## 7. 当前方案的边界

这套方案适合当前阶段，但也有明确边界：

- 适合静态博客和项目展示
- 适合 MDX 内容管理
- 不适合直接上需要实时服务器逻辑的功能

如果以后你要增加这些能力：

- 留言 API
- 登录
- 评论系统
- 管理后台
- 动态搜索

可以考虑两种升级路线：

### 路线 A：继续留在 Cloudflare

- 静态页面仍放 Pages
- 动态能力补到 Workers / Pages Functions

### 路线 B：切到完整 Next.js 托管

- 例如 Vercel 或 Cloudflare Workers 上的 Next.js 适配方案

## 8. 当前已经完成的改动

为了支持这套方案，仓库里已经完成：

- `next.config.js` 开启静态导出
- 新增 `lib/posts.ts` 作为 MDX 内容层
- 新增 `content/posts/*.mdx` 文章源
- 首页和 `/blog` 已改为从 MDX 读取文章摘要
- `/blog/[slug]` 已改为静态详情页
- 新增 `npm run verify:static-mdx` 回归检查脚本

## 9. 推荐下一步

最推荐继续做的事情：

1. 再补 3 到 5 篇真实 MDX 文章，把内容层跑起来
2. 修掉移动端导航和 Blog 顶部焦点区的真实交互问题
3. 视需要增加 `blog/[slug]` 的目录、上一篇/下一篇、代码高亮
