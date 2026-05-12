"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Live2DMascot, type Live2DExpressionSignal, type Live2DTapSignal } from "@/components/layout/Live2DMascot";
import { mascotConfig, type MascotEventRule, type MascotEventTrigger, type MascotModel } from "@/data/mascot";

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

const DEFAULT_STAGE_WIDTH = 260;
const LIVE2D_STAGE_HEIGHT = 320;
const PLACEHOLDER_STAGE_SIZE = 64;
const VIEWPORT_MARGIN = 16;
const DRAG_THRESHOLD = 4;
const IDLE_EVENT_MS = 30000;
const MESSAGE_DURATION_MS = 4200;
const DEFAULT_EVENT_COOLDOWN_MS = 3000;
const DEFAULT_MESSAGE_PRIORITY = 40;
const DEFAULT_MESSAGES: string[] = [...mascotConfig.messages];

function getFallbackModel() {
  return mascotConfig.models.find((model) => model.type === "placeholder") ?? mascotConfig.models[0];
}

function getModelById(modelId: string | null): MascotModel {
  return mascotConfig.models.find((model) => model.id === modelId) ?? getFallbackModel();
}

function getStageSize(model: MascotModel) {
  return model.type === "live2d"
    ? { width: model.stageWidth ?? DEFAULT_STAGE_WIDTH, height: model.stageHeight ?? LIVE2D_STAGE_HEIGHT }
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

function readStoredExpression(model: MascotModel) {
  if (model.type !== "live2d" || !model.expressions?.length) {
    return null;
  }

  const stored = localStorage.getItem(mascotConfig.storageKeys.expression);

  return model.expressions.find((item) => item.persist && item.expression === stored)?.expression ?? null;
}

function pickMessage(messages: string[]) {
  return messages[Math.floor(Math.random() * messages.length)] ?? DEFAULT_MESSAGES[0];
}

function findEventRule(model: MascotModel, trigger: MascotEventTrigger) {
  return model.type === "live2d" ? model.events?.find((rule) => rule.trigger === trigger) ?? null : null;
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
  const pathname = usePathname();
  const [message, setMessage] = useState<string>(DEFAULT_MESSAGES[0]);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(mascotConfig.defaultModelId);
  const [selectedExpression, setSelectedExpression] = useState<string | null>(null);
  const [live2dFailedModelId, setLive2dFailedModelId] = useState<string | null>(null);
  const [position, setPosition] = useState<MascotPosition>({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [tapSignal, setTapSignal] = useState<Live2DTapSignal | null>(null);
  const [expressionSignal, setExpressionSignal] = useState<Live2DExpressionSignal | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const positionRef = useRef<MascotPosition>(position);
  const messagePriorityRef = useRef(0);
  const eventCooldownRef = useRef<Record<string, number>>({});

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
    setSelectedExpression(readStoredExpression(initialModel));
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

  function showMessage(nextMessage?: string, priority = DEFAULT_MESSAGE_PRIORITY) {
    if (visible && priority < messagePriorityRef.current) {
      return;
    }

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    messagePriorityRef.current = priority;
    setMessage(nextMessage ?? DEFAULT_MESSAGES[(DEFAULT_MESSAGES.indexOf(message) + 1) % DEFAULT_MESSAGES.length]);
    setVisible(true);

    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      messagePriorityRef.current = 0;
    }, MESSAGE_DURATION_MS);
  }

  function applyExpression(expression: string | null, persist = false, updateSelection = true) {
    if (updateSelection) {
      setSelectedExpression(expression);
    }

    if (persist && expression) {
      localStorage.setItem(mascotConfig.storageKeys.expression, expression);
    } else if (!expression) {
      localStorage.removeItem(mascotConfig.storageKeys.expression);
    }

    setExpressionSignal({ id: Date.now(), expression });
  }

  function runEvent(trigger: MascotEventTrigger, fallbackMessage?: string) {
    const rule = findEventRule(activeModel, trigger);
    const now = Date.now();
    const cooldownKey = `${activeModel.id}:${trigger}`;
    const cooldownMs = rule?.cooldownMs ?? DEFAULT_EVENT_COOLDOWN_MS;

    if (now - (eventCooldownRef.current[cooldownKey] ?? 0) < cooldownMs) {
      return;
    }

    eventCooldownRef.current[cooldownKey] = now;

    showMessage(rule ? pickMessage(rule.messages) : fallbackMessage, rule?.priority ?? DEFAULT_MESSAGE_PRIORITY);
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
    showMessage("我回来啦。", 80);
  }

  function selectModel(modelId: string) {
    setSelectedModelId(modelId);
    setMenuOpen(false);
    setLive2dFailedModelId(null);
    setSelectedExpression(readStoredExpression(getModelById(modelId)));
    localStorage.setItem(mascotConfig.storageKeys.modelId, modelId);
    showMessage("换好啦。", 80);
  }

  function selectExpression(expression: string | null, persist = false) {
    applyExpression(expression, persist);
    setMenuOpen(false);
    showMessage(expression ? "表情切换完成。" : "恢复默认表情。", 85);
  }

  function handleStagePointerDown(event: React.PointerEvent<HTMLDivElement>) {
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

  function handleStagePointerMove(event: React.PointerEvent<HTMLDivElement>) {
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

    if (!dragging) {
      runEvent("drag-start", "要搬家了吗？");
    }

    const nextPosition = clampPosition({ x: dragState.startX + deltaX, y: dragState.startY + deltaY }, activeModel);
    positionRef.current = nextPosition;
    setPosition(nextPosition);
  }

  function finishDrag(event: React.PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    dragStateRef.current = null;
    setDragging(false);
    localStorage.setItem(mascotConfig.storageKeys.position, JSON.stringify(clampPosition(positionRef.current, activeModel)));

    if (dragState.moved) {
      runEvent("drag-end", "这里也不错。");
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }

  function handleStageClick(event: React.MouseEvent<HTMLDivElement>) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    setTapSignal({ id: Date.now(), clientX: event.clientX, clientY: event.clientY });
    runEvent("click", DEFAULT_MESSAGES[(DEFAULT_MESSAGES.indexOf(message) + 1) % DEFAULT_MESSAGES.length]);
  }

  function handleHit(hitAreas: string[]) {
    if (hitAreas.some((area) => area.toLowerCase().includes("head"))) {
      runEvent("click-head");
      return;
    }

    if (hitAreas.some((area) => area.toLowerCase().includes("body"))) {
      runEvent("click-body");
    }
  }

  useEffect(() => {
    if (!mounted || hidden) {
      return;
    }

    if (idleTimerRef.current) {
      clearInterval(idleTimerRef.current);
    }

    idleTimerRef.current = setInterval(() => {
      runEvent("idle");
    }, IDLE_EVENT_MS);

    return () => {
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
      }
    };
  }, [activeModel, hidden, mounted]);

  useEffect(() => {
    if (mounted && !hidden) {
      runEvent("route-change");
    }
  }, [pathname]);

  useEffect(() => {
    if (!mounted || hidden) {
      return;
    }

    const handleScroll = () => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const threshold = document.documentElement.scrollHeight - 80;

      if (scrollBottom >= threshold) {
        runEvent("scroll-bottom");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeModel, hidden, mounted]);

  if (!mounted || !mascotConfig.enabled) {
    return null;
  }

  if (hidden) {
    return createPortal(
      <button
        type="button"
        onClick={restoreMascot}
        className="fixed bottom-4 left-4 z-30 hidden h-10 w-10 place-items-center rounded-full border border-cyan-200/25 bg-[#0d1024]/85 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,.22)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-200/55 hover:bg-cyan-300/10 md:grid"
        aria-label="显示看板娘"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          ✦
        </span>
      </button>,
      document.body
    );
  }

  return createPortal(
    <aside
      className="juno-mascot fixed z-30 hidden select-none md:block"
      style={{
        left: position.x,
        top: position.y,
        width: stageSize.width
      }}
      aria-label="博客看板娘"
      onPointerEnter={() => runEvent("hover", DEFAULT_MESSAGES[0])}
    >
      <div
        className={`absolute left-0 min-w-[210px] max-w-[280px] rounded-xl border border-amber-200/70 bg-[#fff7ea]/95 px-4 py-3 text-sm text-[#765436] shadow-[0_14px_34px_rgba(15,23,42,.18)] transition duration-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
        style={{
          bottom: stageSize.height - 8
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
        <p className="pr-4 leading-6">{message}</p>
      </div>

      <div
        className="absolute z-40"
        style={{ left: Math.max(20, stageSize.width * 0.34), top: stageSize.height - 20 }}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {menuOpen && (
          <div className="absolute bottom-full mb-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#0d1024]/95 p-1 text-sm text-slate-100 shadow-[0_18px_40px_rgba(0,0,0,.28)] backdrop-blur-xl">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">模型</div>
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
            <div className="mt-1 border-t border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              表情 / 配件
            </div>
            {activeModel.type === "live2d" && activeModel.expressions?.length ? (
              <>
                <button
                  type="button"
                  data-mascot-expression="default"
                  onClick={() => selectExpression(null)}
                  className={`block w-full rounded-lg px-3 py-2 text-left transition ${
                    selectedExpression === null ? "bg-cyan-300/15 text-cyan-100" : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  默认
                </button>
                {activeModel.expressions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    data-mascot-expression={item.expression}
                    onClick={() => selectExpression(item.expression, item.persist)}
                    className={`block w-full rounded-lg px-3 py-2 text-left transition ${
                      selectedExpression === item.expression ? "bg-cyan-300/15 text-cyan-100" : "text-slate-300 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </>
            ) : (
              <p className="px-3 py-2 text-xs leading-5 text-slate-400">切换到神宫白子后可用。</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-full border border-cyan-200/25 bg-[#0d1024]/85 px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,.18)] backdrop-blur-xl transition hover:border-cyan-200/55 hover:bg-cyan-300/10"
          aria-expanded={menuOpen}
          aria-label="切换看板娘模型和表情"
        >
          角色/表情
        </button>
      </div>

      <div
        role="button"
        tabIndex={0}
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
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setTapSignal({ id: Date.now(), clientX: position.x + stageSize.width / 2, clientY: position.y + stageSize.height / 2 });
            runEvent("click");
          }
        }}
        aria-label="拖动或点击看板娘"
      >
        {activeModel.type === "live2d" ? (
          <Live2DMascot
            model={activeModel}
            tapSignal={tapSignal}
            expressionSignal={expressionSignal}
            onHit={handleHit}
            onError={() => {
              setLive2dFailedModelId(activeModel.id);
              setMessage("Live2D 模型加载失败，先用占位形态陪你。");
              setVisible(true);
            }}
          />
        ) : (
          <PlaceholderMascot />
        )}
      </div>
    </aside>,
    document.body
  );
}
