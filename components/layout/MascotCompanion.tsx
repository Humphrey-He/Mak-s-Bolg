"use client";

import { useEffect, useRef, useState } from "react";
import { Live2DMascot } from "@/components/layout/Live2DMascot";
import { mascotConfig, type MascotModel } from "@/data/mascot";

type MascotPosition = {
  x: number;
  y: number;
};

type DragState = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
  moved: boolean;
};

const DESKTOP_BREAKPOINT = 768;
const DEFAULT_STAGE_WIDTH = 260;
const LIVE2D_STAGE_HEIGHT = 320;
const PLACEHOLDER_STAGE_SIZE = 64;
const VIEWPORT_MARGIN = 16;
const DRAG_THRESHOLD = 4;

function getFallbackModel() {
  return mascotConfig.models.find((model) => model.type === "placeholder") ?? mascotConfig.models[0];
}

function getModelById(modelId: string | null): MascotModel {
  return mascotConfig.models.find((model) => model.id === modelId) ?? getFallbackModel();
}

function getStageSize(model: MascotModel) {
  return model.type === "live2d"
    ? { width: DEFAULT_STAGE_WIDTH, height: LIVE2D_STAGE_HEIGHT }
    : { width: PLACEHOLDER_STAGE_SIZE, height: PLACEHOLDER_STAGE_SIZE };
}

function getDefaultPosition(model: MascotModel): MascotPosition {
  const { height } = getStageSize(model);

  if (typeof window === "undefined") {
    return { x: 20, y: 20 };
  }

  return {
    x: 20,
    y: Math.max(VIEWPORT_MARGIN, window.innerHeight - height - 20)
  };
}

function clampPosition(position: MascotPosition, model: MascotModel): MascotPosition {
  if (typeof window === "undefined") {
    return position;
  }

  const { width, height } = getStageSize(model);
  const maxX = Math.max(VIEWPORT_MARGIN, window.innerWidth - width - VIEWPORT_MARGIN);
  const maxY = Math.max(VIEWPORT_MARGIN, window.innerHeight - height - VIEWPORT_MARGIN);

  return {
    x: Math.min(Math.max(position.x, VIEWPORT_MARGIN), maxX),
    y: Math.min(Math.max(position.y, VIEWPORT_MARGIN), maxY)
  };
}

function readStoredPosition(model: MascotModel) {
  try {
    const raw = localStorage.getItem(mascotConfig.storageKeys.position);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<MascotPosition>;

    if (typeof parsed.x !== "number" || typeof parsed.y !== "number") {
      return null;
    }

    return clampPosition({ x: parsed.x, y: parsed.y }, model);
  } catch {
    return null;
  }
}

function PlaceholderMascot() {
  return (
    <div className="grid h-16 w-16 place-items-center rounded-full border border-cyan-200/30 bg-[#0d1024]/90 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,.22)] backdrop-blur-xl">
      <span aria-hidden="true" className="text-2xl leading-none">
        ✦
      </span>
    </div>
  );
}

export function MascotCompanion() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(mascotConfig.defaultModelId);
  const [live2dFailedModelId, setLive2dFailedModelId] = useState<string | null>(null);
  const [position, setPosition] = useState<MascotPosition>({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [tapSignal, setTapSignal] = useState(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const positionRef = useRef<MascotPosition>(position);

  const selectedModel = getModelById(selectedModelId);
  const shouldUsePlaceholder = selectedModel.type === "placeholder" || live2dFailedModelId === selectedModel.id;
  const activeModel = shouldUsePlaceholder ? getFallbackModel() : selectedModel;
  const stageSize = getStageSize(activeModel);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    const savedModelId = localStorage.getItem(mascotConfig.storageKeys.modelId) ?? mascotConfig.defaultModelId;
    const initialModel = getModelById(savedModelId);

    setHidden(localStorage.getItem(mascotConfig.storageKeys.hidden) === "1");
    setSelectedModelId(savedModelId);
    setPosition(readStoredPosition(initialModel) ?? getDefaultPosition(initialModel));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || hidden) {
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [hidden, mounted]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    setPosition((current) => {
      const next = clampPosition(current, activeModel);
      localStorage.setItem(mascotConfig.storageKeys.position, JSON.stringify(next));
      return next;
    });
  }, [activeModel, mounted]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const handleResize = () => {
      setPosition((current) => {
        const next = clampPosition(current, activeModel);
        localStorage.setItem(mascotConfig.storageKeys.position, JSON.stringify(next));
        return next;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeModel, mounted]);

  function showMessage(nextIndex?: number) {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    setMessageIndex((current) => nextIndex ?? (current + 1) % mascotConfig.messages.length);
    setVisible(true);

    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, 4200);
  }

  function hideMascot() {
    localStorage.setItem(mascotConfig.storageKeys.hidden, "1");
    setHidden(true);
    setMenuOpen(false);
  }

  function restoreMascot() {
    const currentModel = getModelById(selectedModelId);
    const nextPosition = readStoredPosition(currentModel) ?? getDefaultPosition(currentModel);

    localStorage.removeItem(mascotConfig.storageKeys.hidden);
    setPosition(nextPosition);
    setHidden(false);
    setVisible(true);
  }

  function selectModel(modelId: string) {
    setSelectedModelId(modelId);
    setMenuOpen(false);
    setLive2dFailedModelId(null);
    localStorage.setItem(mascotConfig.storageKeys.modelId, modelId);
    showMessage(0);
  }

  function handleStagePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: position.x,
      startY: position.y,
      moved: false
    };
  }

  function handleStagePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startClientX;
    const deltaY = event.clientY - dragState.startClientY;

    if (!dragState.moved && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) {
      return;
    }

    dragState.moved = true;
    suppressClickRef.current = true;
    setDragging(true);

    const nextPosition = clampPosition({ x: dragState.startX + deltaX, y: dragState.startY + deltaY }, activeModel);
    positionRef.current = nextPosition;
    setPosition(nextPosition);
  }

  function finishDrag(event: React.PointerEvent<HTMLButtonElement>) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    dragStateRef.current = null;
    setDragging(false);
    localStorage.setItem(mascotConfig.storageKeys.position, JSON.stringify(clampPosition(positionRef.current, activeModel)));

    if (dragState.moved) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }

  function handleStageClick() {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    setTapSignal((value) => value + 1);
    showMessage();
  }

  if (!mounted || !mascotConfig.enabled) {
    return null;
  }

  if (hidden) {
    return (
      <button
        type="button"
        onClick={restoreMascot}
        className="fixed bottom-4 left-4 z-30 hidden h-10 w-10 place-items-center rounded-full border border-cyan-200/25 bg-[#0d1024]/85 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,.22)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-200/55 hover:bg-cyan-300/10 md:grid"
        aria-label="显示看板娘"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          ✦
        </span>
      </button>
    );
  }

  return (
    <aside
      className="juno-mascot fixed z-30 hidden select-none md:block"
      style={{
        left: position.x,
        top: position.y,
        width: stageSize.width
      }}
      aria-label="博客看板娘"
      onPointerEnter={() => showMessage(0)}
    >
      <div
        className={`absolute left-0 min-w-[210px] max-w-[260px] rounded-xl border border-amber-200/70 bg-[#fff7ea]/95 px-4 py-3 text-sm text-[#765436] shadow-[0_14px_34px_rgba(15,23,42,.18)] transition duration-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
        style={{
          bottom: stageSize.height - 22
        }}
      >
        <button
          type="button"
          onClick={hideMascot}
          className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full text-[#a47b50]/80 transition hover:bg-amber-100 hover:text-[#765436]"
          aria-label="隐藏看板娘"
        >
          <span aria-hidden="true" className="text-sm leading-none">
            ×
          </span>
        </button>
        <p className="pr-4 leading-6">{mascotConfig.messages[messageIndex]}</p>
      </div>

      <div className="absolute left-20 z-10" style={{ top: stageSize.height - 22 }}>
        {menuOpen && (
          <div className="absolute bottom-full mb-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-[#0d1024]/95 p-1 text-sm text-slate-100 shadow-[0_18px_40px_rgba(0,0,0,.28)] backdrop-blur-xl">
            {mascotConfig.models.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => selectModel(model.id)}
                className={`block w-full rounded-lg px-3 py-2 text-left transition ${
                  model.id === selectedModel.id ? "bg-cyan-300/15 text-cyan-100" : "text-slate-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                {model.name}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-full border border-cyan-200/25 bg-[#0d1024]/85 px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,.18)] backdrop-blur-xl transition hover:border-cyan-200/55 hover:bg-cyan-300/10"
          aria-expanded={menuOpen}
          aria-label="切换看板娘模型"
        >
          换装
        </button>
      </div>

      <button
        type="button"
        className={`juno-mascot-stage relative block touch-none border-0 bg-transparent p-0 text-left ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          width: stageSize.width,
          height: stageSize.height
        }}
        onPointerDown={handleStagePointerDown}
        onPointerMove={handleStagePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClick={handleStageClick}
        aria-label="拖动或点击看板娘"
      >
        {activeModel.type === "live2d" ? (
          <Live2DMascot
            model={activeModel}
            tapSignal={tapSignal}
            onError={() => {
              setLive2dFailedModelId(activeModel.id);
              setMessageIndex(0);
              setVisible(true);
            }}
          />
        ) : (
          <PlaceholderMascot />
        )}
      </button>
    </aside>
  );
}
