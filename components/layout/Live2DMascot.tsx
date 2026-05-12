"use client";

import { useEffect, useRef, useState } from "react";
import type { Live2DMascotModel } from "@/data/mascot";

type Live2DMascotProps = {
  model: Live2DMascotModel;
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
    transparent?: boolean;
    antialias?: boolean;
    width?: number;
    height?: number;
  }) => PixiApplication;
};

type Live2DDisplayModule = {
  Live2DModel: {
    from: (source: string) => Promise<Live2DModelInstance>;
  };
};

declare global {
  interface Window {
    PIXI?: PixiModule;
  }
}

export function Live2DMascot({ model, onReady, onError }: Live2DMascotProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<PixiApplication | null>(null);
  const modelRef = useRef<Live2DModelInstance | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      try {
        const [{ default: PIXI }, live2dDisplay] = await Promise.all([
          import("pixi.js") as Promise<{ default: PixiModule }>,
          import("pixi-live2d-display/cubism4") as Promise<Live2DDisplayModule>
        ]);

        if (cancelled) {
          return;
        }

        window.PIXI = PIXI;

        const width = canvas.clientWidth || 260;
        const height = canvas.clientHeight || 320;
        const app = new PIXI.Application({
          view: canvas,
          autoStart: true,
          backgroundAlpha: 0,
          transparent: true,
          antialias: true,
          width,
          height
        });

        const live2dModel = await live2dDisplay.Live2DModel.from(model.modelPath);

        if (cancelled) {
          app.destroy(true, { children: true, texture: true, baseTexture: true });
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
        onReady?.();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Live2D 模型加载失败";
        onError?.(message);
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
      appRef.current?.destroy(true, { children: true, texture: true, baseTexture: true });
      appRef.current = null;
      setActive(false);
    };
  }, [model, onReady, onError]);

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

  function playTapMotion() {
    const live2dModel = modelRef.current;

    if (model.tapMotionGroup && live2dModel?.motion) {
      live2dModel.motion(model.tapMotionGroup);
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      onClick={playTapMotion}
      aria-label={`${model.name} Live2D 模型`}
    />
  );
}
