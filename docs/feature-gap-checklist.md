# 功能缺口清单

更新日期：2026-04-24

基线说明：
- 单体基线文件：`E:\awesomeProject\Mak's Blog\cyber_pixel_blog_frontend (4).jsx`
- 当前拆分仓库：`E:\awesomeProject\Mak's Blog\Mak-s-Bolg-remote`
- 当前状态：`npm run build` 已通过，App Router 骨架可继续承接拆分

## 1. 当前已落地能力

已完成的基础拆分：
- App Router 页面骨架：`/`、`/blog`、`/projects`、`/agent`、`/backend`、`/about`、`/message`
- 全局布局组件：`Header`、`BackgroundGrid`、`ScanLine`、`SiteShell`
- 首页已拆出模块：`Hero`、`AgentFeatureCard`、`PersonaLab`、`BlogList`、`BackendSection`
- 二级页面已拆出模块：`ProjectsPage`、`AgentPage`
- 静态数据层：`copy.ts`、`posts.ts`、`projects.ts`、`backend.ts`、`readings.ts`
- 构建链路已修通：Next.js + Tailwind + TypeScript 可正常生产构建

## 2. 与单体版本的主要功能缺口

### P0：迁移主路径上缺失的首页模块

这些模块在单体版中已经存在，但当前 App Router 版首页还未承接：
- `GeekTerminal`
- `NextBlueprintCard`
- `SidebarSection`
- `RecentReadingSection`
- `FloatingHomeButton`
- `FloatingMascot`

影响：
- 首页信息密度明显低于单体版
- 单体版“赛博像素博客”的交互记忆点没有完整迁移
- 后续要做完整对齐时，首页仍需要二次大改

推荐落点：
- `components/home/GeekTerminal.tsx`
- `components/home/NextBlueprintCard.tsx`
- `components/home/SidebarSection.tsx`
- `components/home/RecentReadingSection.tsx`
- `components/layout/FloatingHomeButton.tsx`
- `components/layout/FloatingMascot.tsx`
- `app/page.tsx` 负责重新编排这些模块的顺序

### P0：Agent 页面只迁移了主介绍区，未迁移实验区

单体版里 Agent 相关能力分成两层：
- `AgentProjectPage`
- `AgentExperimentLab`

当前仓库只保留了 `AgentPage` 的核心介绍和简单沙盒，没有把实验特性区拆出来。

缺失内容：
- Experimental Features 区域
- Memory Capsules 区域
- Tool-Calling Timeline 区域
- Risk Control Toggles 区域

影响：
- 当前 `/agent` 更像概览页，不像完整的主题页
- 单体中最有辨识度的 Agent 交互能力没有迁过来

推荐落点：
- `components/agent/AgentExperimentLab.tsx`
- `components/agent/AgentMemoryCapsules.tsx`
- `components/agent/AgentTimeline.tsx`
- `components/agent/AgentRiskControls.tsx`
- `components/agent/AgentPage.tsx` 负责组合这些模块

### P0：Header 未迁移语言切换逻辑

单体版中有：
- `LanguageToggle`

当前仓库状态：
- `lib/i18n.ts` 只有工具函数
- `SiteShell`、`Hero`、`BlogList`、`ProjectsPage`、`AgentPage` 等都直接读取 `copy.zh`
- `Header` 没有语言切换入口

影响：
- 当前多语言只是数据结构存在，不是真正可用功能
- 后续任何文案模块继续拆分，都会重复硬编码 `copy.zh`

推荐落点：
- `components/layout/LanguageToggle.tsx`
- `components/providers/I18nProvider.tsx`
- `lib/i18n.ts` 扩展成 provider + hook
- `app/layout.tsx` 接入 provider

### P1：页面级内容仍未完全从单体对齐

虽然路由都在，但页面深度仍明显不足：
- `/about` 当前只有一个简单介绍卡片
- `/message` 当前只有静态表单壳
- `/projects` 当前只有项目卡片列表
- `/backend` 当前内容比单体版少，且最近阅读区还没有独立抽象

影响：
- 页面对外观感仍偏“骨架版”
- 单体中已经设计好的节奏和层级没有完全保留

推荐动作：
- 对照单体版逐页补齐文案块和辅助说明块
- 将大段静态描述迁入 `data/copy.ts`，避免组件内继续堆文本

### P1：详情页与内容型路由尚未开始

单体版虽然也是前端原型，但已经暗示了这些后续入口；当前仓库仍未建立：
- `blog/[slug]`
- `projects/[slug]`
- 可扩展的文章详情视图
- 项目详情页/文档入口页

影响：
- 现在只是“列表展示型博客”，不是内容站
- 后续接 API、MDX、CMS 时还需要再次改路由结构

推荐落点：
- `app/blog/[slug]/page.tsx`
- `app/projects/[slug]/page.tsx`
- `data/posts.ts`、`data/projects.ts` 增加 slug 和 detail 字段

### P1：留言和订阅仍是视觉占位，未接交互结果

当前缺口：
- 留言表单没有提交状态
- 没有前端校验
- 没有提交成功/失败反馈
- 订阅区还未迁入当前仓库

影响：
- 用户能看到入口，但无法完成真实动作
- 产品体验会停在“展示稿”阶段

推荐落点：
- `components/message/MessageForm.tsx`
- `components/home/SubscribePanel.tsx`
- 如果暂时不接后端，可先做本地校验 + mock 提交反馈

### P2：文案与编码质量仍需要系统清理

虽然当前项目已经能构建，但从单体拷贝来的中文文案仍存在这些问题：
- 部分组件和数据文件文案有乱码痕迹
- README 仍是乱码内容
- 首页和子页面中的中文显示质量不一致

影响：
- 不影响当前 build
- 但会影响后续继续拆分时的判断成本和最终观感

建议优先清理文件：
- `README.md`
- `data/copy.ts`
- `data/posts.ts`
- `data/backend.ts`
- `data/projects.ts`
- `data/readings.ts`
- `components/home/*`
- `components/agent/*`
- `components/backend/*`

## 3. 单体模块 vs 当前仓库映射

已迁移：
- `Icon`
- `localize`
- `PixelButton`
- `ScanLine`
- `BackgroundGrid`
- `Header`
- `PersonaLab`
- `AgentFeatureCard`
- `Hero`
- `BlogList`
- `BackendSection`
- `ProjectsPage`
- `AboutPage` 的基础壳
- `MessagePage` 的基础壳

未迁移：
- `LanguageToggle`
- `GeekTerminal`
- `AssistantMascot`
- `NextBlueprintCard`
- `AgentExperimentLab`
- `RecentReadingSection`
- `SidebarSection`
- `FloatingHomeButton`
- `FloatingMascot`

部分迁移：
- `AgentProjectPage` -> 当前 `AgentPage` 仅完成主介绍区，未补实验区
- `AboutPage` -> 当前只有简化版
- `MessagePage` -> 当前只有表单壳
- `BackendSection` -> 当前结构在，但细节和文案还未完全对齐

## 4. 推荐迁移顺序

### 第一阶段：把首页补回完整体验
- 补 `NextBlueprintCard`
- 补 `GeekTerminal`
- 补 `SidebarSection`
- 补 `FloatingHomeButton`
- 视时间决定是否补 `FloatingMascot`

### 第二阶段：把 Agent 页补成完整主题页
- 补 `AgentExperimentLab`
- 补相关子模块：memory、timeline、risk controls
- 重组 `/agent` 页面结构

### 第三阶段：把 i18n 从“数据结构”升级为“可运行能力”
- 加 provider
- 加 toggle
- 改掉全局 `copy.zh` 直读

### 第四阶段：把展示站升级成内容站
- 建 `blog/[slug]`
- 建 `projects/[slug]`
- 为 posts/projects 数据补充 slug 与 detail 内容

### 第五阶段：清理内容质量
- 统一中文文案
- 修 README
- 收敛静态文案来源

## 5. 建议形成的 docs 交付物

如果后续继续拆分，建议在 `docs/` 下继续补两份文档：
- `docs/component-migration-map.md`
  - 记录单体函数与拆分组件的一一映射
- `docs/page-migration-order.md`
  - 记录每一页的迁移顺序、依赖关系和完成状态

## 6. 下一步最值得做的事情

最推荐直接进入的实现项：
- 首页补齐 `NextBlueprintCard`、`GeekTerminal`、`SidebarSection`

原因：
- 这三块都来自单体首页
- 写入边界清晰
- 对整体完成度提升最大
- 不会马上引入后端依赖
