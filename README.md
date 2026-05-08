# 书鸿 · Juno Mak Blog

这是一个基于 Next.js App Router 的个人技术博客，当前采用：

- Next.js 静态导出
- Cloudflare Pages 友好部署
- `content/posts/*.mdx` 作为文章源
- TinaCMS 作为可视化内容编辑后台

## 安装

```bash
npm install
```

## 本地开发

普通开发模式：

```bash
npm run dev
```

适合：

- 改页面样式
- 调整组件结构
- 编写和修改内容

## 本地 Tina 编辑

如果你要在本地使用 Tina 编辑器，请运行：

```bash
npm run tina:dev
```

然后打开：

```txt
http://localhost:3000/admin
```

建议本地 `.env.local` 至少包含：

```env
NEXT_PUBLIC_TINA_BRANCH=main
NEXT_PUBLIC_TINA_CLIENT_ID=your_tina_client_id
TINA_TOKEN=your_tina_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 生产构建

纯静态导出：

```bash
npm run build
```

如果要把 Tina 管理后台一起编进产物，使用：

```bash
npm run tina:build
```

说明：

- 如果 Tina 环境变量齐全，会同时构建 `/admin`
- 如果 Tina 环境变量缺失，会自动回退成普通静态构建，保证前台博客仍可部署

构建完成后，静态产物会输出到：

```txt
out/
```

## 正确预览方式

这个项目启用了：

```txt
output: "export"
```

所以它是静态导出站点。预览导出结果时不要使用 `npm run start`，而是：

```bash
npm run build
npm run preview:static
```

默认预览地址：

```txt
http://127.0.0.1:3010
```

## 为什么不能用 `npm run start`

因为 `next start` 适合 Next 服务端运行模式，不适用于：

```txt
output: "export"
```

继续使用 `npm run start` 很容易出现：

- 页面样式异常
- 资源路径和静态部署不一致
- 看到的不是最终导出站点

## 内容目录

### 文章

```txt
content/posts/*.mdx
```

### 图片

```txt
public/uploads/posts/<slug>/
```

示例：

```txt
public/uploads/posts/high-concurrency-go-cache/overview.png
```

正文引用：

```mdx
![架构图](/uploads/posts/high-concurrency-go-cache/overview.png)
```

## 内容校验

导入文章后建议先跑：

```bash
npm run verify:static-mdx
```

然后再跑：

```bash
npm run build
```

## 目录说明

```txt
app/                  App Router 页面
components/           页面与 UI 组件
content/posts/        博客文章 MDX 源文件
data/                 静态文案与展示数据
docs/                 项目文档
lib/                  内容读取与工具函数
public/uploads/       文章图片与静态资源
scripts/              校验脚本
styles/               全局样式
tina/                 TinaCMS 配置
```

## Cloudflare Pages 部署

推荐配置：

- Build command: `npm run tina:build`
- Output directory: `out`

说明：

- 这个命令现在是“兼容模式”
- 有 Tina 环境变量时：构建前台 + Tina admin
- 没有 Tina 环境变量时：只构建前台，不会让部署失败

参考文档：

- [docs/cloudflare-pages-static-export.md](./docs/cloudflare-pages-static-export.md)
- [docs/content-import-guide.md](./docs/content-import-guide.md)
- [docs/tina-cloudflare-production.md](./docs/tina-cloudflare-production.md)

## Cloudflare Workers 静态部署

如果你的 Cloudflare 项目使用的是 `wrangler deploy`，而不是 Pages 的“仅上传构建目录”模式，这个仓库现在也已经兼容。

- Wrangler 配置文件：`wrangler.jsonc`
- 静态资源目录：`out`
- 部署前先运行：

```bash
npm run tina:build
```

然后执行：

```bash
npx wrangler deploy
```

这个配置会把站点当作静态资源部署，不再触发 OpenNext 的 Next.js Workers 迁移流程。
