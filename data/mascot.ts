export type SvgMascotModel = {
  id: string;
  name: string;
  type: "placeholder";
};

export type Live2DExpression = {
  id: string;
  name: string;
  expression: string;
  persist?: boolean;
};

export type MascotEventTrigger = "hover" | "click" | "click-body" | "click-head" | "drag-start" | "drag-end" | "idle" | "scroll-bottom" | "route-change";

export type MascotEventRule = {
  trigger: MascotEventTrigger;
  messages: string[];
  priority?: number;
  cooldownMs?: number;
  motionGroup?: string;
};

export type Live2DMascotModel = {
  id: string;
  name: string;
  type: "live2d";
  modelPath: string;
  idleMotionGroup?: string;
  tapMotionGroup?: string;
  stageWidth?: number;
  stageHeight?: number;
  scale?: number;
  x?: number;
  y?: number;
  expressions?: Live2DExpression[];
  events?: MascotEventRule[];
};

export type MascotModel = SvgMascotModel | Live2DMascotModel;

export const mascotConfig = {
  enabled: true,
  defaultModelId: "hiyori",
  storageKeys: {
    hidden: "juno-mascot-hidden",
    modelId: "juno-mascot-model-id",
    position: "juno-mascot-position",
    expression: "juno-mascot-expression"
  },
  messages: [
    "哇，你终于回来啦～",
    "拖住我就能换个位置，我会记住这里。",
    "把合法模型放到 public/live2d/models/ 后，就可以在这里换装啦。",
    "代码和文字，都慢慢变清楚。",
    "需要灵感的时候，点点我。"
  ],
  models: [
    {
      id: "hiyori",
      name: "Hiyori",
      type: "live2d",
      modelPath: "/live2d/models/hiyori/hiyori_pro_jp.model3.json",
      idleMotionGroup: "Idle",
      tapMotionGroup: "Tap",
      scale: 1
    },
    {
      id: "wanko",
      name: "Wanko",
      type: "live2d",
      modelPath: "/live2d/models/wanko/wanko_touch_t02.model3.json",
      idleMotionGroup: "Idle",
      tapMotionGroup: "Tap",
      scale: 1
    },
    {
      id: "shiroko",
      name: "神宫白子",
      type: "live2d",
      modelPath: "/live2d/models/shiroko/shiroko.model3.json",
      stageWidth: 420,
      stageHeight: 620,
      scale: 1.02,
      expressions: [
        { id: "daimao", name: "呆猫", expression: "daimao" },
        { id: "daimao-eye-shake", name: "呆猫眼珠摇晃", expression: "daimao-eye-shake" },
        { id: "apron", name: "围裙", expression: "apron", persist: true },
        { id: "photo", name: "拍照", expression: "photo" },
        { id: "pen", name: "拿笔", expression: "pen", persist: true },
        { id: "tap", name: "点一下", expression: "tap" },
        { id: "cat-filter", name: "猫咪滤镜", expression: "cat-filter" },
        { id: "glasses", name: "眼镜", expression: "glasses", persist: true }
      ],
      events: [
        {
          trigger: "hover",
          messages: ["白子待机中。要换个表情吗？", "鼠标过来啦，我会看着你的。"],
          priority: 50,
          cooldownMs: 8000
        },
        {
          trigger: "click",
          messages: ["嗯？在叫我吗。", "点到了，我在。"],
          priority: 90,
          cooldownMs: 1200
        },
        {
          trigger: "drag-start",
          messages: ["要搬家了吗？"],
          priority: 80,
          cooldownMs: 1000
        },
        {
          trigger: "drag-end",
          messages: ["这里也不错。"],
          priority: 80,
          cooldownMs: 1000
        },
        {
          trigger: "idle",
          messages: ["休息一下眼睛也很好。", "文章读累了，就看看窗外。"],
          priority: 30,
          cooldownMs: 30000
        },
        {
          trigger: "scroll-bottom",
          messages: ["读到这里啦，要不要看看下一篇？"],
          priority: 70,
          cooldownMs: 20000
        },
        {
          trigger: "route-change",
          messages: ["换个页面继续出发。"],
          priority: 70,
          cooldownMs: 5000
        }
      ]
    },
    {
      id: "svg-default",
      name: "等待模型",
      type: "placeholder"
    }
  ] satisfies MascotModel[]
} as const;
