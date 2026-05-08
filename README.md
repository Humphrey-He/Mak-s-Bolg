# 书鸦 · Juno Mak Blog

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

如果你暂时不需要线上 Tina 编辑后台，也可以只用：

- Build command: `npm run build`
- Output directory: `out`

参考文档：

- [docs/cloudflare-pages-static-export.md](./docs/cloudflare-pages-static-export.md)
- [docs/content-import-guide.md](./docs/content-import-guide.md)
- [docs/tina-cloudflare-production.md](./docs/tina-cloudflare-production.md)
