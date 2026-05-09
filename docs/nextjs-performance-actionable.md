# Next.js 博客性能优化：针对当前项目的精准执行版

> 本文档基于对项目代码的逐一对照，筛选出对当前项目**高收益、低破坏**的优化项，摒弃原文档中"比你当前实际问题更重"的部分，形成可直接执行的优化清单。

---

## 一、当前项目真实状态评估

### 已做得较好的部分

1. **前后台代码已分离** — 博客前台 Next.js 和 `BlogCMS.Admin` 是分开的两套代码，没有看到前台直接 import 后台编辑器 / Antd / CMS 页面。"CMS 代码误进前台 bundle" 的最大风险已基本避开。

2. **MDX 渲染走构建 / 服务端路径** — 文章详情页 `evaluate + remark/rehype` 跑在服务端渲染阶段，没有 `hljs.highlightAll()` 这种典型的客户端高亮模式。

3. **文章内容源是本地 MDX 文件** — 对静态导出友好。

### 仍需优化的部分

1. **`use client` 组件数量偏多** — `Header.tsx`、`Hero.tsx`、`StartHere.tsx`、`BackgroundGrid.tsx`、`BlogList.tsx`、`template.tsx` 全部是 client 组件，涵盖了整个首页和全局布局。

2. **`framer-motion` 覆盖面偏大** — `template.tsx`、`Header.tsx`、`BlogList.tsx` 三处均有 motion 使用，把很多本来可以静态输出的区域变成了 hydration 成本的一部分。

3. **`KaTeX` 和 `highlight` CSS 是全站加载** — `globals.css` 里直接 `@import "katex/dist/katex.min.css"` 和 `@import "highlight.js/styles/github-dark.css"`，对文章页没问题，但对首页、项目页、关于页属于"全站为少数页面买单"。

4. **首页文章区是较重的交互块** — `BlogList.tsx` 包含搜索、标签过滤、Top 5 carousel、翻页，全部是 client 组件。

---

## 二、优化项分级执行清单

### P0 — 高收益，几乎不影响视觉

#### 1. 把 `katex` / `highlight` CSS 从全局挪到文章详情页

**文件：** `styles/globals.css`

**改动：** 删除这两行全局 import

```css
/* 删除这两行 */
@import "katex/dist/katex.min.css";
@import "highlight.js/styles/github-dark.css";
```

**改为：** 只在文章详情页加载

在 `app/blog/[slug]/page.tsx` 的组件树顶层（ArticleDetail 组件或 article 外层 div）通过 `useEffect` 动态注入 CSS link，或者在 `next/head` 里条件引入。

**收益：** 首页、项目页、关于页减少约 30-50KB CSS 传输量。

---

#### 2. 弱化 `app/template.tsx` 全局页面切换动画

**文件：** `app/template.tsx`

**当前问题：** 全局页面切换都经过 template.tsx，如果里面有 framer-motion 动画，每次路由切换都会触发全页动画，增加 TBT。

**建议改动：** 将 `template.tsx` 里的 motion 动画降到最小，或改用 CSS transition。页面切换不需要"重"，用户感知不强但主线程成本不小。

**收益：** 每次页面切换的 JS 执行量下降，TBT 中等幅度改善。

---

#### 3. 检查 `BlogList.tsx` 能否拆出更小的 client 区块

**文件：** `components/blog/BlogList.tsx`

**当前问题：** 整个 `BlogList` 是一个大 client 组件，包含 Top5 carousel、FilterBar、翻页、列表渲染。首页加载时，整个组件树都要 hydration。

**建议改动：**

- `TopPostCard` 和 `ArticleListItem` 本身是静态展示，可以保持 motion 但考虑是否整个 list 都要 client
- `FilterBar`（搜索 + 标签过滤）必须是 client，但它不需要带动整个列表一起 hydration
- 可以把 `pagedPosts` 的分页逻辑提到 Server Component 层，只把 `FilterBar` 和翻页按钮做成独立的 client island

**简化思路：**

```tsx
// Server Component：负责数据分页
const filteredPosts = posts.filter(...); // 在 server 层算好
const pagedPosts = filteredPosts.slice((page-1)*pageSize, page*pageSize);

// Client Component：只负责交互
<FilterBar ... />
<ArticleList items={pagedPosts} />
```

**收益：** 首页 hydration 量明显下降，CLS 改善（静态内容不需要 hydration）。

---

### P1 — 中等收益，需要接受一点页面手感变化

#### 4. 检查 `Header`、`Hero`、`StartHere` 是否真的都需要 client

**文件：** `components/layout/Header.tsx`、`components/home/Hero.tsx`、`components/home/StartHere.tsx`

**分析：**

- `Header` 使用了 `usePathname` — 这是合理的 client 用途，保留
- `Hero` 里用了 `framer-motion` — 如果只是静态展示动画，可以考虑改 CSS animation 或直接去掉 motion
- `StartHere` 如果只是静态展示，理论上可以是 Server Component

**建议：** 逐个检查，如果 motion 不是核心视觉体验，把这三处的 framer-motion 改成 CSS 动画或直接移除。

**收益：** hydration 成本下降，首页 TBT 改善。

---

#### 5. 收缩 `BlogList` 的 framer-motion 范围

**文件：** `components/blog/BlogList.tsx`

**当前：** Top5 carousel 和文章列表都有 motion 动画。

**建议：** 
- Top5 carousel 的 `motion.div` 可以保留，但检查 `transition` 参数是否过于复杂
- `ArticleListItem` 的 `initial={{ opacity: 0, y: 14 }}` 动画对性能影响不大，可以保留或改成 CSS
- 如果追求极致，可以把 Top5 carousel 的动画改用 CSS scroll-snap 实现，完全去掉 JS 动画

**收益：** 减少 JS 动画计算，CLS 更稳定。

---

### P2 — 跑 bundle analyzer 再决定

#### 6. 安装 `@next/bundle-analyzer` 做体积分析

```bash
npm install @next/bundle-analyzer
```

在 `next.config.js` 里加入：

```js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  // 原有配置
});
```

然后：

```bash
ANALYZE=true npm run build
```

打开 `.next/analyze/client.html` 和 `.next/analyze/server.html`，看最大 chunk 是谁。如果不是 `framer-motion`、`katex`、`highlight`，说明整体 bundle 控制得还不错，可以不用进一步"大动干戈"。

**这个步骤的价值：** 现在是"猜测热点在哪"，跑完 bundle analyzer 之后是"知道热点在哪"，再决定要不要继续做结构级优化。

---

## 三、优化后预估效果

### 如果只做 P0 三项（katex/highlight CSS 迁移、template 动画降级、BlogList 拆分）

- 首屏 JS 体感下降：**15% - 25%**
- Lighthouse Performance：**大概率提升一个档位**（25 → 40-55 区间）
- TBT：中等幅度改善（主线程阻塞减少）
- LCP：小改善
- 视觉变化：**几乎无感知**

### 如果再加上 P1 两项（Header/Hero/StartHere motion 收缩、BlogList motion 降级）

- 首屏 JS：**25% - 35%** 量级下降
- TBT：可能出现明显改善
- Lighthouse Performance：**50-70** 区间是有可能的
- 代价：页面的"动感"稍弱，但博客内容展示为主，损失有限

---

## 四、不值得现在做的项

以下建议**价值不高或破坏性太大**，暂时不建议做：

| 建议 | 原因 |
|------|------|
| 大幅砍首页动效 | 当前博客"赛博感"是视觉特色，一刀切砍掉影响太大 |
| 把首页列表改成纯静态 | 搜索和标签过滤是合理需求，全去掉不划算 |
| 迁移到其他框架 | 成本极高，收益不成比例 |
| 全量去掉 framer-motion | 可以优化，但不必激进 |

---

## 五、执行顺序建议

```
第 1 天：做 P0-1（katex/highlight CSS 迁移），无视觉变化，验证容易
第 2 天：做 P0-2（template 动画降级）和 P0-3（BlogList 拆分）
第 3 天：做 P1-4 和 P1-5（motion 收缩）
第 4 天：跑 bundle analyzer，验证热点分布
第 5 天：根据 analyzer 结果，决定要不要做进一步的深层次优化
```

---

## 六、一句话总结

> 当前项目最值得做的不是"大刀阔斧重构"，而是三件小事：① 把 katex/highlight CSS 限制到文章页；② 把 template 的页面切换动画降到最低；③ 把 BlogList 的 hydration 范围缩小。其余结构级优化等跑完 bundle analyzer 再决定。
