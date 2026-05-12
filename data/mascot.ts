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
  defaultModelId: "svg-default",
  storageKeys: {
    hidden: "juno-mascot-hidden",
    modelId: "juno-mascot-model-id"
  },
  messages: [
    "哇，你终于回来啦～",
    "Live2D 模型还没接入，我先收起大号占位角色。",
    "把合法模型放到 public/live2d/models/ 后，就可以在这里换装啦。",
    "代码和文字，都慢慢变清楚。",
    "需要灵感的时候，点点我。"
  ],
  models: [
    {
      id: "svg-default",
      name: "等待模型",
      type: "placeholder"
    }
  ] satisfies MascotModel[]
} as const;
