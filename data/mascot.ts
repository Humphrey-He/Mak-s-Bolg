export type SvgMascotModel = {
  id: string;
  name: string;
  type: "svg";
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
  defaultModelId: "svg-default",
  storageKeys: {
    hidden: "juno-mascot-hidden",
    modelId: "juno-mascot-model-id"
  },
  messages: [
    "哇，你终于回来啦～",
    "今天也要把复杂问题拆小一点。",
    "我在左下角守着你的文章。",
    "代码和文字，都慢慢变清楚。",
    "需要灵感的时候，点点我。"
  ],
  models: [
    {
      id: "svg-default",
      name: "默认助手",
      type: "svg"
    }
  ] satisfies MascotModel[]
} as const;
