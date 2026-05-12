export type SvgMascotModel = {
  id: string;
  name: string;
  type: "placeholder";
};

export type Live2DOutfit = {
  id: string;
  name: string;
  type: "model" | "expression" | "motion";
  modelId?: string;
  expression?: string;
  motionGroup?: string;
};

export type Live2DMascotModel = {
  id: string;
  name: string;
  type: "live2d";
  modelPath: string;
  idleMotionGroup?: string;
  tapMotionGroup?: string;
  scale?: number;
  x?: number;
  y?: number;
  outfits?: Live2DOutfit[];
};

export type MascotModel = SvgMascotModel | Live2DMascotModel;

export const mascotConfig = {
  enabled: true,
  defaultModelId: "hiyori",
  storageKeys: {
    hidden: "juno-mascot-hidden",
    modelId: "juno-mascot-model-id",
    position: "juno-mascot-position"
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
      scale: 0.24,
      x: 125,
      y: 292
    },
    {
      id: "wanko",
      name: "Wanko",
      type: "live2d",
      modelPath: "/live2d/models/wanko/wanko_touch_t02.model3.json",
      idleMotionGroup: "Idle",
      tapMotionGroup: "Tap",
      scale: 0.28,
      x: 125,
      y: 292
    },
    {
      id: "shiroko",
      name: "神宫白子",
      type: "live2d",
      modelPath: "/live2d/models/shiroko/shiroko.model3.json",
      scale: 0.12,
      x: 125,
      y: 292
    },
    {
      id: "svg-default",
      name: "等待模型",
      type: "placeholder"
    }
  ] satisfies MascotModel[]
} as const;
