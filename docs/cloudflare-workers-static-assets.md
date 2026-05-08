# Cloudflare Workers 静态资源部署

当前项目是：

- Next.js 静态导出
- 构建产物输出到 `out/`

如果 Cloudflare 使用的是：

```bash
npx wrangler deploy
```

那么这个仓库现在会通过 `wrangler.jsonc` 按“静态资源 Worker”方式部署，而不是被 Wrangler 自动识别成需要 OpenNext 的 Next.js Workers 项目。

## 为什么之前会失败

之前的失败日志里，Wrangler 自动检测到了：

- Framework: Next.js
- Output Directory: `.next`

然后它触发了 OpenNext 迁移和 `npx opennextjs-cloudflare build`。

但当前项目启用了：

```txt
output: "export"
```

这是纯静态导出，不会生成 OpenNext 所需的：

```txt
.next/standalone/.next/server/pages-manifest.json
```

所以会报 `ENOENT`。

## 现在的修复方式

仓库已新增：

- [wrangler.jsonc](/E:/awesomeProject/Mak's%20Blog/Mak-s-Bolg-remote/wrangler.jsonc)

关键配置：

- `name: "mak-blog"`
- `assets.directory: "./out"`
- `html_handling: "force-trailing-slash"`
- `not_found_handling: "404-page"`

这会让 `wrangler deploy` 直接上传 `out/` 中的静态资源。

## 本地构建顺序

先构建：

```bash
npm run tina:build
```

再部署：

```bash
npx wrangler deploy
```

## 如果要启用 Tina 管理后台

`npm run tina:build` 会在环境变量完整时一并构建 Tina admin。

缺少 Tina 变量时：

- 前台博客仍然能构建
- `/admin` 不会变成真实 Tina 编辑后台

需要的变量：

```env
NEXT_PUBLIC_TINA_BRANCH=main
NEXT_PUBLIC_TINA_CLIENT_ID=你的_client_id
TINA_TOKEN=你的_token
NEXT_PUBLIC_SITE_URL=https://你的正式域名
```
