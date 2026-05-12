# Live2D 模型接入目录

把合法授权的 Live2D Cubism 3/4 模型放在这个目录下，每个模型一个子目录。

推荐结构：

```txt
public/live2d/models/haru/
├── haru.model3.json
├── haru.moc3
├── haru.physics3.json
├── textures/
│   └── texture_00.png
├── motions/
│   ├── idle.motion3.json
│   └── tap_body.motion3.json
└── expressions/
    └── happy.exp3.json
```

然后在 `data/mascot.ts` 的 `models` 中添加：

```ts
{
  id: "haru",
  name: "Haru",
  type: "live2d",
  modelPath: "/live2d/models/haru/haru.model3.json",
  idleMotionGroup: "Idle",
  tapMotionGroup: "TapBody",
  scale: 0.18,
  x: 120,
  y: 300
}
```

注意：

- 不要提交未授权模型。
- 不要从其他网站直接抓取模型资源。
- 模型入口文件必须是 `.model3.json`，并且里面引用的 `.moc3`、贴图、动作路径要相对当前模型目录可访问。
- 如果模型动作组名称不是 `Idle` / `TapBody`，请以模型的 `model3.json` 为准。
