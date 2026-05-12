"use client";

import { useEffect, useRef, useState } from "react";
import type { Live2DMascotModel } from "@/data/mascot";

type Live2DMascotProps = {
  model: Live2DMascotModel;
  tapSignal?: Live2DTapSignal | null;
  expressionSignal?: Live2DExpressionSignal | null;
  onReady?: () => void;
  onError?: (message: string) => void;
  onHit?: (hitAreas: string[]) => void;
};

export type Live2DTapSignal = {
  id: number;
  clientX: number;
  clientY: number;
};

export type Live2DExpressionSignal = {
  id: number;
  expression: string | null;
};

type PixiApplication = {
  stage: {
    addChild: (child: unknown) => void;
  };
  renderer?: {
    resize?: (width: number, height: number) => void;
  };
  destroy: (removeView?: boolean, stageOptions?: { children?: boolean; texture?: boolean; baseTexture?: boolean }) => void;
};

type Live2DModelInstance = {
  width: number;
  height: number;
  x: number;
  y: number;
  anchor?: {
    set: (x: number, y?: number) => void;
  };
  scale: {
    set: (value: number) => void;
  };
  motion?: (group: string) => void;
  expression?: (id?: string | number) => Promise<boolean>;
  tap?: (x: number, y: number) => void;
  hitTest?: (x: number, y: number) => string[];
  focus?: (x: number, y: number, instant?: boolean) => void;
  internalModel?: {
    motionManager?: {
      expressionManager?: {
        resetExpression?: () => void;
      };
    };
    coreModel?: {
      setParameterValueById?: (id: string, value: number, weight?: number) => void;
    };
  };
};

type PixiModule = {
  Application: new (options: {
    view: HTMLCanvasElement;
    autoStart?: boolean;
    backgroundAlpha?: number;
    antialias?: boolean;
    width?: number;
    height?: number;
  }) => PixiApplication;
};

type PixiImportModule = PixiModule & {
  default?: PixiModule;
};

type Live2DDisplayModule = {
  Live2DModel: {
    from: (source: string) => Promise<Live2DModelInstance>;
  };
};

const CUBISM_CORE_SRC = "/live2d/runtime/live2dcubismcore.min.js";
let cubismCorePromise: Promise<void> | null = null;

declare global {
  interface Window {
    PIXI?: PixiModule;
    Live2DCubismCore?: unknown;
  }
}

function loadCubismCore() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.Live2DCubismCore) {
    return Promise.resolve();
  }

  if (!cubismCorePromise) {
    cubismCorePromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${CUBISM_CORE_SRC}"]`);

      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Live2D Cubism Core 加载失败")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = CUBISM_CORE_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Live2D Cubism Core 加载失败"));
      document.head.appendChild(script);
    });
  }

  return cubismCorePromise;
}

function destroyPixiApp(app: PixiApplication | null) {
  if (!app) {
    return;
  }

  app.destroy(false, { children: true, texture: true, baseTexture: true });
}

function placeModelInCanvas(live2dModel: Live2DModelInstance, model: Live2DMascotModel, width: number, height: number) {
  live2dModel.anchor?.set(0.5, 1);
  live2dModel.scale.set(1);

  const naturalWidth = Math.max(1, Math.abs(live2dModel.width));
  const naturalHeight = Math.max(1, Math.abs(live2dModel.height));
  const fitScale = Math.min((width * 0.86) / naturalWidth, (height * 0.9) / naturalHeight);

  live2dModel.scale.set(fitScale * (model.scale ?? 1));
  live2dModel.x = model.x ?? width / 2;
  live2dModel.y = model.y ?? height - 2;
}

function applyPointerFocus(live2dModel: Live2DModelInstance, x: number, y: number, instant = false) {
  live2dModel.focus?.(x, y, instant);
}

function getCanvasPoint(canvas: HTMLCanvasElement, event: Pick<PointerEvent, "clientX" | "clientY">) {
  const rect = canvas.getBoundingClientRect();

  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height)
  };
}

export function Live2DMascot({ model, tapSignal = null, expressionSignal = null, onReady, onError, onHit }: Live2DMascotProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<PixiApplication | null>(null);
  const modelRef = useRef<Live2DModelInstance | null>(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  const onHitRef = useRef(onHit);
  const [active, setActive] = useState(false);

  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorRef.current = onError;
    onHitRef.current = onHit;
  }, [onReady, onError, onHit]);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      try {
        await loadCubismCore();

        const pixiModule = (await import("pixi.js")) as PixiImportModule;
        const PIXI = pixiModule.default ?? pixiModule;

        if (cancelled) {
          return;
        }

        window.PIXI = PIXI;
        const live2dDisplay = (await import("pixi-live2d-display/cubism4")) as Live2DDisplayModule;

        if (cancelled) {
          return;
        }

        const width = canvas.clientWidth || 260;
        const height = canvas.clientHeight || 320;
        const app = new PIXI.Application({
          view: canvas,
          autoStart: true,
          backgroundAlpha: 0,
          antialias: true,
          width,
          height
        });

        const live2dModel = await live2dDisplay.Live2DModel.from(model.modelPath);

        if (cancelled) {
          destroyPixiApp(app);
          return;
        }

        app.stage.addChild(live2dModel);
        placeModelInCanvas(live2dModel, model, width, height);
        applyPointerFocus(live2dModel, width / 2, height * 0.38, true);

        if (model.idleMotionGroup && live2dModel.motion) {
          live2dModel.motion(model.idleMotionGroup);
        }

        appRef.current = app;
        modelRef.current = live2dModel;
        setActive(true);
        onReadyRef.current?.();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Live2D 模型加载失败";
        onErrorRef.current?.(message);
      }
    }

    setup();

    const handleResize = () => {
      const canvas = canvasRef.current;
      const app = appRef.current;

      if (!canvas || !app?.renderer?.resize) {
        return;
      }

      const width = canvas.clientWidth || 260;
      const height = canvas.clientHeight || 320;

      app.renderer.resize(width, height);

      if (modelRef.current) {
        placeModelInCanvas(modelRef.current, model, width, height);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      modelRef.current = null;
      destroyPixiApp(appRef.current);
      appRef.current = null;
      setActive(false);
    };
  }, [model]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const live2dModel = modelRef.current;
      const canvas = canvasRef.current;

      if (!live2dModel || !canvas) {
        return;
      }

      const point = getCanvasPoint(canvas, event);

      if (!point) {
        return;
      }

      applyPointerFocus(live2dModel, point.x, point.y);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [active]);

  useEffect(() => {
    const live2dModel = modelRef.current;

    if (!tapSignal || !live2dModel) {
      return;
    }

    const canvas = canvasRef.current;
    const point = canvas
      ? getCanvasPoint(canvas, { clientX: tapSignal.clientX, clientY: tapSignal.clientY } as PointerEvent)
      : null;

    if (point) {
      live2dModel.tap?.(point.x, point.y);
      onHitRef.current?.(live2dModel.hitTest?.(point.x, point.y) ?? []);
    } else {
      onHitRef.current?.([]);
    }

    if (model.tapMotionGroup && live2dModel.motion) {
      live2dModel.motion(model.tapMotionGroup);
    }
  }, [model.tapMotionGroup, tapSignal]);

  useEffect(() => {
    const live2dModel = modelRef.current;

    if (!expressionSignal || !live2dModel) {
      return;
    }

    if (!expressionSignal.expression) {
      live2dModel.internalModel?.motionManager?.expressionManager?.resetExpression?.();
      return;
    }

    if (!live2dModel.expression) {
      return;
    }

    live2dModel.expression(expressionSignal.expression).catch((error) => {
      const message = error instanceof Error ? error.message : "Live2D 表情切换失败";
      onErrorRef.current?.(message);
    });
  }, [active, expressionSignal]);

  return <canvas ref={canvasRef} className="pointer-events-none h-full w-full" aria-label={`${model.name} Live2D 模型`} />;
}
