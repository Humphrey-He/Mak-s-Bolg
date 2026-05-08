# Tina + Cloudflare Pages 生产配置

这份文档用于把当前项目接到：

- TinaCloud 编辑后台
- Cloudflare Pages 静态托管

## 当前项目的本地配置核对

本地仓库里已经具备这些条件：

- Tina 配置文件存在：`tina/config.ts`
- 文章集合：`content/posts`
- 项目集合：`content/projects`
- Tina 构建脚本：`npm run tina:build`
- Next.js 静态导出：`next.config.js` 中 `output: "export"`

## 不能直接代替你确认的 Dashboard 项

下面这些值我无法直接读取你的 Tina Dashboard，只能由你在 TinaCloud 后台核对：

- `Client ID`
- `Site URL`
- 绑定的 GitHub 仓库
- 默认分支
- 编辑权限成员

## Dashboard 里应该核对什么

请在 TinaCloud 项目设置里确认：

1. `Client ID`
   - 应与本地环境变量 `NEXT_PUBLIC_TINA_CLIENT_ID` 完全一致

2. `Branch`
   - 应与本地 `NEXT_PUBLIC_TINA_BRANCH` 一致
   - 当前推荐值：`main`

3. `Site URL`
   - 必须是站点根地址，不带 `/admin`
   - 本地开发建议：`http://localhost:3000`
   - 生产环境建议：`https://你的正式域名`

4. `Repository`
   - 应绑定到当前 GitHub 仓库
   - 当前仓库：`Humphrey-He/Mak-s-Bolg`

## 为什么不推荐把本地 Site URL 设为 127.0.0.1:3010

`http://127.0.0.1:3010` 是当前静态预览地址，适合看导出后的页面，不是最适合 Tina 本地编辑的地址。

原因：

- Tina 本地编辑模式更适合跑在 `npm run tina:dev`
- Tina 官方本地模式通常使用 `http://localhost:3000/admin`
- `localhost` 和 `127.0.0.1` 在登录回调时属于不同 origin

结论：

- 本地编辑：`http://localhost:3000`
- 静态导出预览：`http://127.0.0.1:3010`

## 本地 `.env.local` 建议

```env
NEXT_PUBLIC_TINA_BRANCH=main
NEXT_PUBLIC_TINA_CLIENT_ID=d23177b2-2ffc-4cd6-8972-8efcfac91ad2
TINA_TOKEN=your_tina_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Cloudflare Pages 环境变量

在 Cloudflare Pages 项目设置中添加：

```env
NEXT_PUBLIC_TINA_BRANCH=main
NEXT_PUBLIC_TINA_CLIENT_ID=d23177b2-2ffc-4cd6-8972-8efcfac91ad2
TINA_TOKEN=your_tina_token
NEXT_PUBLIC_SITE_URL=https://你的正式域名
```

说明：

- `NEXT_PUBLIC_TINA_CLIENT_ID` 可以公开
- `TINA_TOKEN` 必须作为 secret 保存
- `NEXT_PUBLIC_SITE_URL` 要与 Tina Dashboard 的 `Site URL` 保持一致

## Cloudflare Pages 构建配置

推荐使用：

- Build command: `npm run tina:build`
- Output directory: `out`

Node 版本建议：

- `18` 或 `20`

## 为什么构建命令要用 tina:build

因为当前项目不只是导出博客页面，还要把 Tina 的 `/admin` 一起编进静态产物。

`npm run tina:build` 会执行：

1. 检查 Tina 环境变量
2. 如果环境变量齐全，执行 `tinacms build`
3. 执行 `next build`

这样有两种结果：

- 环境变量齐全：`out/` 里既有前台页面，也有 `/admin`
- 环境变量缺失：仍然会生成前台站点，避免 Cloudflare 构建失败

## 上线后的访问路径

- 前台首页：`https://你的正式域名/`
- Tina 后台：`https://你的正式域名/admin/`

## 上线后如果 Tina 登录弹窗不关闭，优先检查

1. Dashboard 里的 `Site URL` 是否和正式域名完全一致
2. `NEXT_PUBLIC_TINA_CLIENT_ID` 是否和 Dashboard 的 `Client ID` 一致
3. 当前登录用户是否被授权编辑这个项目
4. 是否误用了 `localhost` / `127.0.0.1`

## 发布前检查表

- `npm run build` 通过
- `npm run tina:build` 通过
- `out/admin/index.html` 存在
- `NEXT_PUBLIC_SITE_URL` 与 Dashboard Site URL 一致
- Cloudflare Pages Build command 是 `npm run tina:build`
- Cloudflare Pages Output directory 是 `out`
