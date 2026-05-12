# 项目状态检查报告（2026-05-12）

## 1. 结论

当前主工作树为 `Mak-s-Bolg-main-merge`，分支为 `main`，本地已与 `origin/main` 对齐。项目可以正常静态构建并导出，博客内容链路、Next.js static export、Live2D 看板娘基础功能均可用。

需要注意的主要风险是：

- Tina Admin 生产环境变量未配置完整，`/admin` 当前仍会显示 fallback setup page。
- `public/live2d/models/shiroko` 体积约 39.19 MB，白子模型会显著增加静态资源体积。
- 工作树里仍有临时截图文件未跟踪，不建议提交。

## 2. Git 状态

最近关键提交：

```text
868fec9 ux: clarify mascot expression menu
eabb15a fix: prevent mascot events from forcing expressions
6d83663 feat: add Shiroko expressions and mascot events
1b609ab perf: keep Live2D mascot mounted across routes
a8cf6c1 feat: improve Shiroko Live2D presentation
```

当前未跟踪文件：

```text
docs/live2d-mascot-extension-roadmap.md
tmp-live2d-fit-hiyori.png
tmp-live2d-fit-shiroko.png
tmp-live2d-left-bottom.png
tmp-live2d-local-anchor.png
tmp-live2d-local-final.png
tmp-live2d-local-scaled.png
tmp-live2d-shiroko-large.png
```

说明：

- `docs/live2d-mascot-extension-roadmap.md` 是未提交的规划文档，内容部分已落后于当前实现状态。
- `tmp-live2d-*.png` 是本地调试截图，应继续保持未提交或后续清理。

## 3. 验证结果

已执行：

```bash
npm run verify:static-mdx
npm run verify:tina-admin
npm run build
```

结果：

| 检查项 | 结果 | 说明 |
| --- | --- | --- |
| `verify:static-mdx` | 通过 | static export、MDX 内容目录、博客详情路由、首页/博客内容读取链路均通过 |
| `verify:tina-admin` | 警告 | Tina 生产环境变量缺失，Admin 未构建 |
| `next build` | 通过 | 生成 61 个静态页面并成功导出到 `out` |

Tina 缺失变量：

```text
NEXT_PUBLIC_TINA_CLIENT_ID
TINA_TOKEN
NEXT_PUBLIC_TINA_BRANCH
NEXT_PUBLIC_SITE_URL
```

## 4. 项目技术栈

核心框架：

- Next.js `15.5.18`
- React latest
- Tailwind CSS
- MDX 内容系统
- TinaCMS
- Cloudflare Workers Static Assets / `wrangler.jsonc`

Live2D 相关依赖：

```text
pixi.js@6.5.10
pixi-live2d-display@0.4.0
```

静态部署配置：

- `next.config.js` 使用 `output: "export"` 与 `trailingSlash: true`
- `wrangler.jsonc` 指向 `./out`
- Cloudflare assets 启用 `force-trailing-slash`

## 5. 内容规模

当前内容统计：

| 内容类型 | 数量 |
| --- | ---: |
| `content/posts` | 46 |
| `content/projects` | 4 |
| `content/readings` | 0 |
| `content` 下文件总数 | 50 |

构建路由摘要：

- 首页 `/`
- 固定页面：`/about`、`/agent`、`/backend`、`/blog`、`/message`、`/projects`、`/readings`
- 博客详情：`/blog/[slug]`
- 项目详情：`/projects/[slug]`

## 6. Live2D 看板娘状态

当前模型：

| 模型 | 文件数 | 体积 | 状态 |
| --- | ---: | ---: | --- |
| Hiyori | 17 | 4.69 MB | 可加载，支持基础动作 |
| Wanko | 17 | 0.85 MB | 可加载，支持基础动作 |
| Shiroko / 神宫白子 | 18 | 39.19 MB | 可加载，已接入 8 个表情/配件 |

白子已接入表情/配件：

```text
default
daimao
daimao-eye-shake
apron
photo
pen
tap
cat-filter
glasses
```

当前交互能力：

- 桌面端显示，移动端隐藏。
- 固定在浏览器视口，页面滚动时跟随视口。
- 可拖拽并保存位置。
- 模型切换保存到 `localStorage["juno-mascot-model-id"]`。
- 表情/配件保存到 `localStorage["juno-mascot-expression"]`。
- 通过 `角色/表情` 菜单切换模型和白子表情。
- 鼠标移动通过 Live2D 原生 `focus()` 做视角跟随。
- 页面内路由切换时看板娘保持挂载，不重复加载模型。

当前限制：

- 白子的 `.model3.json` 没有 motion 声明，主要依赖基础模型、物理和 expression。
- Hiyori / Wanko 的 motion 资源还没有做完整动作菜单。
- 白子和 Wanko 没有有效 HitAreas，点击头部/身体的精确命中区交互暂不稳定。
- 白子模型体积较大，不适合默认强制加载给所有用户。

## 7. 已知风险

### 7.1 Tina Admin 未完成生产配置

`npm run verify:tina-admin` 提示 Tina 环境变量缺失。若需要线上 `/admin` 可用，需要在 Cloudflare 或部署环境中配置：

```text
NEXT_PUBLIC_TINA_CLIENT_ID
TINA_TOKEN
NEXT_PUBLIC_TINA_BRANCH
NEXT_PUBLIC_SITE_URL
```

### 7.2 Live2D 大模型性能

白子模型约 39.19 MB。对于低带宽或低性能设备，可能出现：

- 首次切换加载慢。
- WebGL 初始化耗时。
- Cloudflare 静态资源传输压力增加。

建议后续增加：

- 模型加载中状态。
- 模型资源预加载策略。
- 低性能模式。
- 按用户选择懒加载，不将大模型作为默认模型。

### 7.3 临时文件管理

根目录存在多张 `tmp-live2d-*.png` 调试截图。它们不影响构建，但会干扰工作树状态。建议后续删除或移动到不纳入 Git 的临时目录。

## 8. 下一步建议

优先级建议：

1. 配置 Tina 生产环境变量，让 `/admin` 从 fallback setup page 进入可用状态。
2. 清理根目录临时截图，保持工作树干净。
3. 更新 `docs/live2d-mascot-extension-roadmap.md`，使其与当前白子表情已接入的事实一致。
4. 给 Hiyori / Wanko 增加完整 motion 菜单。
5. 为 Live2D 增加加载中 UI、失败重试和低性能模式。
6. 如果需要白子头部/身体点击事件，先补充并验证有效 `HitAreas`。

