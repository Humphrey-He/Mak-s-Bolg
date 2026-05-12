# Live2D 看板娘与换装能力实施方案

## 背景

当前博客已经有一个轻量版看板娘原型：

```txt
components/layout/MascotCompanion.tsx
components/layout/SiteShell.tsx
styles/globals.css
```

这个原型用 React + SVG + CSS 实现：

- 左下角固定角色。
- 待机漂浮和呼吸动画。
- 自动眨眼。
- 鼠标移动时头部和眼睛跟随。
- 点击或悬停展示气泡台词。
- 支持隐藏和恢复。

它的优点是零外部模型、零大依赖、静态部署稳定；缺点是并不是真正 Live2D，不能使用 `.model3.json`、`.moc3`、`motion3.json`、`physics3.json` 等模型资源，也不能做真实模型换装。

下一阶段目标是把它升级为支持 Live2D 模型和换装能力的博客看板娘。

## 当前执行决策

本阶段已确认：

```txt
第一版不提交任何 Live2D 模型资源。
第一版换装按“切换整套模型”设计。
先接入 Live2D 架构和运行时依赖，但无模型时默认使用 SVG fallback。
```

已选依赖版本：

```txt
pixi.js@6.5.10
pixi-live2d-display@0.4.0
```

选择 Pixi v6 的原因是 `pixi-live2d-display@0.4.0` 的 peer dependencies 面向 Pixi v6 生态，直接使用 Pixi v8 容易出现运行时或类型兼容问题。

## 目标

第一目标：

```txt
在不影响文章阅读和 Cloudflare 静态部署的前提下，为博客增加可配置的 Live2D 看板娘能力。
```

具体能力：

- 加载 Live2D Cubism 3/4 模型。
- 保留左下角固定展示和气泡提示。
- 鼠标移动时角色视角跟随。
- 点击角色触发台词、动作或表情。
- 支持隐藏 / 恢复。
- 支持“换装”或“换角色”入口。
- 移动端默认不展示或展示低成本入口。
- 无模型资源时自动回退到当前 SVG 看板娘。

## 换装的定义

“换装”在 Web Live2D 中有三种实现方式，需要明确区分。

### 1. 切换整套模型

每套衣服对应一个完整模型目录：

```txt
public/live2d/models/girl-normal/girl-normal.model3.json
public/live2d/models/girl-summer/girl-summer.model3.json
public/live2d/models/girl-winter/girl-winter.model3.json
```

前端通过配置切换 `model3.json`。

优点：

- 最稳定。
- 对模型内部参数要求低。
- 最适合第一版上线。

缺点：

- 模型资源体积更大。
- 不同模型之间动作、表情名称可能不一致。

### 2. 切换贴图

部分模型或旧式看板娘方案支持通过 texture 切换衣服。

优点：

- 资源复用较好。

缺点：

- 不是所有 Cubism 3/4 模型都适配。
- 前端库支持差异较大。
- 容易和模型授权、资源结构绑定。

### 3. 模型内部参数换装

衣服、外套、发饰等部件提前做进模型，通过参数、表情或动作切换：

```txt
Expression: summer
Expression: winter
ParamCloth: 0 / 1
Motion: ChangeCloth
```

优点：

- 体验最好。
- 可以做平滑过渡和动作联动。

缺点：

- 要求模型制作者提前做好部件和参数。
- 前端只能触发，不能凭空生成衣服。

第一阶段建议采用“切换整套模型”，后续再兼容表达式或参数换装。

## 推荐技术路线

### 阶段一：配置层与回退机制

保留当前 SVG 看板娘，新增配置文件：

```txt
data/mascot.ts
```

配置内容包括：

```ts
export const mascotConfig = {
  enabled: true,
  mode: "svg-fallback",
  defaultModelId: "fallback",
  models: [
    {
      id: "fallback",
      name: "默认助手",
      type: "svg"
    }
  ],
  messages: [
    "哇，你终于回来啦～",
    "今天也要把复杂问题拆小一点。"
  ]
};
```

收益：

- 当前功能变成可配置。
- 以后增加 Live2D 不需要大改 UI。
- 无模型资源时仍然可用。

### 阶段二：引入 Live2D 渲染层

优先选择：

```txt
pixi.js + pixi-live2d-display
```

原因：

- 可控性最高。
- 能直接加载 `.model3.json`。
- 容易保留当前 UI、气泡、隐藏按钮和换装菜单。
- 后续可控制 motion、expression、focus、参数。

新增文件建议：

```txt
components/layout/Live2DMascot.tsx
components/layout/MascotCompanion.tsx
data/mascot.ts
types/live2d.ts
```

`MascotCompanion` 负责外层 UI：

- 固定定位。
- 气泡。
- 隐藏 / 恢复。
- 换装菜单。
- SVG fallback。
- 选择 Live2D 或 SVG 渲染层。

`Live2DMascot` 负责模型渲染：

- 创建 Pixi application。
- 加载模型。
- 绑定鼠标视角跟随。
- 播放 idle motion。
- 点击播放 tap motion 或 expression。
- 组件卸载时释放资源。

### 阶段三：换装菜单

换装菜单第一版只切换整套模型：

```txt
默认
夏日
冬日
```

用户选择存入：

```txt
localStorage["juno-mascot-model-id"]
```

如果模型加载失败：

```txt
显示错误提示 -> 自动回退 SVG fallback
```

### 阶段四：高级换装

当模型支持表达式或参数时，再扩展：

```txt
expression: happy / shy / summer / winter
parameter: ParamCloth
motion: ChangeCloth
```

配置示例：

```ts
{
  id: "girl",
  name: "默认角色",
  type: "live2d",
  modelPath: "/live2d/models/girl/girl.model3.json",
  idleMotionGroup: "Idle",
  tapMotionGroup: "TapBody",
  outfits: [
    {
      id: "summer",
      name: "夏日",
      type: "expression",
      expression: "summer"
    },
    {
      id: "winter",
      name: "冬日",
      type: "expression",
      expression: "winter"
    }
  ]
}
```

## 模型资源目录

建议使用：

```txt
public/live2d/models/<model-id>/
├── <model-id>.model3.json
├── <model-id>.moc3
├── <model-id>.physics3.json
├── textures/
│   └── texture_00.png
├── motions/
│   ├── idle.motion3.json
│   └── tap_body.motion3.json
└── expressions/
    ├── happy.exp3.json
    └── shy.exp3.json
```

注意：

- 模型必须确认授权允许网站使用。
- 不建议直接复制其他网站的模型资源。
- 模型文件会增加静态资源体积，需要控制数量。

## 影响范围

### 前端组件

预计影响：

```txt
components/layout/MascotCompanion.tsx
components/layout/SiteShell.tsx
components/layout/Live2DMascot.tsx
styles/globals.css
data/mascot.ts
```

当前 `SiteShell` 已经挂载了 `MascotCompanion`。后续主要在 `MascotCompanion` 内部扩展，不需要每个页面单独接入。

### 依赖

如果使用 `pixi-live2d-display`，预计新增：

```txt
pixi.js
pixi-live2d-display
```

可能影响：

- 首次加载 JS 体积增加。
- 构建耗时略增。
- 需要确保只在客户端动态加载，避免 SSR 报错。

规避方式：

- `Live2DMascot` 使用 dynamic import。
- 只在桌面端加载 Live2D runtime。
- 移动端默认不加载模型。
- 模型资源懒加载，用户隐藏后不重复初始化。

### 静态部署

项目当前是 Next.js static export，模型资源放在 `public/live2d` 可以直接由 Cloudflare 静态托管。

需要注意：

- 模型资源路径必须使用绝对路径，例如 `/live2d/models/girl/girl.model3.json`。
- 不要依赖 Node runtime。
- 不要在构建阶段读取远程模型资源。

### UI 与阅读体验

风险：

- 左下角可能遮挡文章内容。
- 角色和气泡可能干扰移动端。
- 动画可能影响低性能设备。

控制策略：

- `md` 以下默认隐藏。
- 提供隐藏按钮。
- 尊重 `prefers-reduced-motion`。
- 容器宽度控制在桌面左下角安全区域。
- z-index 低于模态层，高于背景层。

## 风险清单

### 模型授权风险

Live2D 模型通常有明确授权。不能直接抓取其他网站模型，也不能使用未授权商业模型。

建议：

- 使用明确允许 Web 展示的模型。
- 在仓库文档记录模型来源和授权。
- 如果模型授权不确定，不提交到仓库。

### 兼容风险

不同模型的 motion group、expression 名称可能不一致。

建议：

- 配置中显式声明 idle / tap / expression 名称。
- 加载失败时降级。
- 不强依赖某个参数必然存在。

### 性能风险

Live2D runtime 和模型贴图可能明显增加首屏体积。

建议：

- 运行时动态加载。
- 模型懒加载。
- 默认只加载一个模型。
- 换装模型按需加载。

### 构建风险

部分 Live2D 库依赖 `window` 或浏览器 API，不能在服务端执行。

建议：

- 所有 Live2D 代码放在 `"use client"` 组件。
- 使用 `useEffect` 内动态 import。
- 构建前跑 `npm run build`。

## 验收标准

阶段一验收：

- 当前 SVG 看板娘配置化。
- 构建通过。
- 桌面端展示，移动端隐藏。
- 可隐藏和恢复。

阶段二验收：

- 能加载一个本地 Live2D `.model3.json` 模型。
- 角色在左下角透明 canvas 中渲染。
- 鼠标移动时头部或视线跟随。
- 点击角色触发台词和动作。
- 加载失败时回退 SVG。

阶段三验收：

- 换装菜单能切换至少两个模型。
- 用户选择能保存到 localStorage。
- 刷新页面后保持上次选择。
- 切换失败时不影响页面阅读。

阶段四验收：

- 支持 expression 或 parameter 级别换装。
- 支持模型专属动作配置。
- 记录模型来源和授权信息。

## 建议执行顺序

```txt
1. 确认本方案。
2. 确认是否接受新增 pixi.js / pixi-live2d-display 依赖。
3. 准备至少一个合法 Live2D 模型。
4. 先把当前 SVG 看板娘配置化。
5. 新增 Live2D 渲染层，但默认仍允许 fallback。
6. 增加换装菜单。
7. 本地构建和桌面预览。
8. 提交到功能分支。
9. 合并 main 后触发 Cloudflare 部署。
```

## 当前建议

建议先执行到阶段一和阶段二：

```txt
保留 SVG fallback
新增配置层
新增 Live2D 渲染层
支持一个模型加载
```

确认模型资源和效果稳定后，再做阶段三的多模型换装菜单。

## 第一版实现状态

第一版实现应满足：

- `data/mascot.ts` 管理看板娘开关、消息、模型列表和 localStorage key。
- `MascotCompanion` 继续负责外层 UI、气泡、隐藏/恢复和换装菜单。
- `Live2DMascot` 只在浏览器端动态加载 Pixi 和 Live2D runtime。
- 当前模型列表只有 SVG fallback，不包含任何第三方 Live2D 资源。
- 将来新增合法模型时，只需要把模型目录放到 `public/live2d/models/<model-id>/`，再在 `data/mascot.ts` 中添加 live2d 类型模型配置。
