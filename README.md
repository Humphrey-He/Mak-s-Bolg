# Juno Mak Blog

这是一个基于 Next.js App Router 的个人技术博客，当前采用：
- Next.js 静态导出
- Cloudflare 友好的静态资源部署
- `content/posts/*.mdx` 管理文章
- TinaCMS 管理可视化编辑后台

## 安装

```bash
npm install
```

## 本地开发

普通开发模式：

```bash
npm run dev
```

适合页面结构、样式和组件联调。

## 本地 Tina 编辑

如果你要在本地启用 Tina 编辑器：

```bash
npm run tina:dev
```

然后访问：

```txt
http://localhost:3000/admin/
```

建议本地 `.env.local` 至少包含：

```env
NEXT_PUBLIC_TINA_BRANCH=main
NEXT_PUBLIC_TINA_CLIENT_ID=your_tina_client_id
TINA_TOKEN=your_tina_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 生产构建

纯静态站构建：

```bash
npm run build
```

带 Tina 管理后台的生产构建：

```bash
npm run tina:build
```

这个命令会：
- 先检查 Tina 环境变量
- 环境齐全时构建 Tina `/admin`
- 环境不齐全时保留 `/admin` fallback 说明页
- 始终继续构建前台博客
- 构建后自动校验 `/admin` 最终输出状态

## Tina 管理入口策略

现在 `/admin/` 已经不是 Next 页面了，而是：
- 有完整 Tina 生产变量时：显示 TinaCloud 登录页
- 缺少 Tina 生产变量时：显示 fallback 说明页

部署后可以直接通过两种方式判断是否启用成功：
- 构建日志出现 `PASS: Tina admin built; /admin should open the TinaCloud login flow.`
- 打开 `https://你的域名/admin/`，看到 TinaCloud 登录页而不是说明页

也可以手动运行：

```bash
npm run verify:tina-admin
```

## 正确预览方式

这个项目启用了：

```txt
output: "export"
```

所以不要用 `npm run start` 预览导出结果，而是：

```bash
npm run build
npm run preview:static
```

默认预览地址：

```txt
http://127.0.0.1:3010/
```

## 内容目录

文章：

```txt
content/posts/*.mdx
```

图片：

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
npm run build
```

## Cloudflare 构建建议

Cloudflare Pages 推荐：
- Build command: `npm run tina:build`
- Output directory: `out`

Cloudflare Workers Static Assets 推荐：
- Build command: `npm run tina:build`
- Deploy command: `npx wrangler deploy`

## 参考文档

- `docs/content-import-guide.md`
- `docs/tina-cloudflare-production.md`
- `docs/cloudflare-workers-static-assets.md`
