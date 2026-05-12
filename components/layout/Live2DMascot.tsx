"use client";

import { useEffect, useRef, useState } from "react";
import type { Live2DMascotModel } from "@/data/mascot";

type Live2DMascotProps = {
  model: Live2DMascotModel;
  tapSignal?: number;
  onReady?: () => void;
  onError?: (message: string) => void;
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
  x: number;
  y: number;
  scale: {
    set: (value: number) => void;
  };
  motion?: (group: string) => void;
  focus?: (x: number, y: number) => void;
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

export function Live2DMascot({ model, tapSignal = 0, onReady, onError }: Live2DMascotProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<PixiApplication | null>(null);
  const modelRef = useRef<Live2DModelInstance | null>(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  const [active, setActive] = useState(false);

  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorRef.current = onError;
  }, [onReady, onError]);

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
        live2dModel.scale.set(model.scale ?? 0.18);
        live2dModel.x = model.x ?? width / 2;
        live2dModel.y = model.y ?? height;

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

      app.renderer.resize(canvas.clientWidth || 260, canvas.clientHeight || 320);
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

      if (!live2dModel?.focus) {
        return;
      }

      live2dModel.focus(event.clientX, event.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [active]);

  useEffect(() => {
    const live2dModel = modelRef.current;

    if (tapSignal > 0 && model.tapMotionGroup && live2dModel?.motion) {
      live2dModel.motion(model.tapMotionGroup);
    }
  }, [model.tapMotionGroup, tapSignal]);

  return <canvas ref={canvasRef} className="pointer-events-none h-full w-full" aria-label={`${model.name} Live2D 模型`} />;
}
