# Tina + Cloudflare 生产启用说明

这份文档用于把当前项目接到：
- TinaCloud 可视化编辑后台
- Cloudflare 的生产静态部署

## 当前策略

项目里的 `/admin/` 现在采用两段式入口：
- Tina 变量齐全时：`tinacms build` 生成真正的 Tina 后台
- Tina 变量缺失时：保留 `public/admin/index.html` fallback 说明页

这样做的好处是：
- 前台博客不会因为 Tina 配置不全而部署失败
- 部署后可以非常直观地区分“后台未启用”和“后台已接通”

## 需要的环境变量

本地 `.env.local`：

```env
NEXT_PUBLIC_TINA_BRANCH=main
NEXT_PUBLIC_TINA_CLIENT_ID=d23177b2-2ffc-4cd6-8972-8efcfac91ad2
TINA_TOKEN=your_tina_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Cloudflare 生产环境：

```env
NEXT_PUBLIC_TINA_BRANCH=main
NEXT_PUBLIC_TINA_CLIENT_ID=d23177b2-2ffc-4cd6-8972-8efcfac91ad2
TINA_TOKEN=your_tina_token
NEXT_PUBLIC_SITE_URL=https://你的正式域名
```

注意：
- `NEXT_PUBLIC_SITE_URL` 要和 TinaCloud Dashboard 里的 `Site URL` 完全一致
- 生产环境建议填根域名，不要带 `/admin`
- `TINA_TOKEN` 必须作为 secret 保存

## TinaCloud Dashboard 需要核对

请确认：
1. `Client ID` 与 `NEXT_PUBLIC_TINA_CLIENT_ID` 一致
2. `Branch` 与 `NEXT_PUBLIC_TINA_BRANCH` 一致
3. `Site URL` 与 `NEXT_PUBLIC_SITE_URL` 一致
4. 仓库绑定到 `Humphrey-He/Mak-s-Bolg`
5. 需要进入后台的账号已经被加到 TinaCloud 协作者里

## 构建命令

推荐使用：

```bash
npm run tina:build
```

这个命令会在构建末尾自动运行：

```bash
npm run verify:tina-admin
```

## 如何判断 /admin 是否已经是真正的 Tina 入口

### 看构建日志

启用成功时，你会看到：

```txt
PASS: Tina admin built; /admin should open the TinaCloud login flow.
```

如果还是 fallback 页，会看到：

```txt
WARN: Tina admin was not built because environment variables are incomplete.
/admin will show the fallback setup page until Tina production variables are configured.
```

### 看线上页面

访问：

```txt
https://你的域名/admin/
```

结果应该是：
- 成功：出现 TinaCloud 登录页
- 未启用：出现项目内置的 fallback 说明页

## Cloudflare Pages 推荐配置

- Build command: `npm run tina:build`
- Output directory: `out`
- Production branch: `main`

## Cloudflare Workers Static Assets 推荐配置

- Build command: `npm run tina:build`
- Deploy command: `npx wrangler deploy`

仓库里已经有：
- `wrangler.jsonc`
- `public/admin/index.html`
- `scripts/verify-tina-admin.mjs`

## 常见问题

### 为什么不再用 Next 的 `/app/admin/page.tsx`

因为它会占用 `/admin` 路由，导致 Tina 构建出来的后台无法接管这个入口。
现在把它移除后，`/admin/` 才能真正交给 Tina 或 fallback 静态页。

### 为什么本地编辑建议用 `localhost:3000`

因为 Tina 本地编辑更适合跑在：

```txt
http://localhost:3000/admin/
```

而 `127.0.0.1:3010` 更适合静态导出后的预览，不适合作为 Tina 本地编辑主入口。
