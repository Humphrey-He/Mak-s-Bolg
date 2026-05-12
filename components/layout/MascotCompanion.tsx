"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Live2DMascot } from "@/components/layout/Live2DMascot";
import { mascotConfig, type MascotModel } from "@/data/mascot";

type Pointer = {
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getFallbackModel() {
  return mascotConfig.models.find((model) => model.type === "svg") ?? mascotConfig.models[0];
}

function getModelById(modelId: string | null): MascotModel {
  return mascotConfig.models.find((model) => model.id === modelId) ?? getFallbackModel();
}

type SvgMascotProps = {
  transforms: {
    body: string;
    head: string;
    eyes: string;
  };
};

function SvgMascot({ transforms }: SvgMascotProps) {
  return (
    <svg
      className="h-full w-full drop-shadow-[0_18px_28px_rgba(0,0,0,.32)]"
      viewBox="0 0 260 320"
      role="img"
      aria-labelledby="mascot-title mascot-desc"
    >
      <title id="mascot-title">左下角看板娘</title>
      <desc id="mascot-desc">一个会待机摆动、眨眼并跟随鼠标视角移动的博客角色。</desc>
      <defs>
        <linearGradient id="mascotHair" x1="86" y1="34" x2="188" y2="148" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FAD2B7" />
          <stop offset="0.55" stopColor="#DFA483" />
          <stop offset="1" stopColor="#B87963" />
        </linearGradient>
        <linearGradient id="mascotDress" x1="96" y1="185" x2="178" y2="292" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF7F8" />
          <stop offset="1" stopColor="#FFD9E3" />
        </linearGradient>
        <radialGradient id="mascotSkin" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(136 153) rotate(90) scale(116 69)">
          <stop stopColor="#FFE7D6" />
          <stop offset="1" stopColor="#F5C4B1" />
        </radialGradient>
      </defs>

      <g className="juno-mascot-body" transform={transforms.body}>
        <path d="M103 169c-12 24-25 67-29 114h126c-5-48-17-90-30-115-15 9-47 10-67 1Z" fill="url(#mascotSkin)" stroke="#b76e62" strokeWidth="2" />
        <path d="M78 283c9-30 20-57 29-76h58c12 22 23 49 31 76H78Z" fill="url(#mascotDress)" stroke="#e27987" strokeWidth="2" />
        <path d="M105 207c12 11 45 11 60 0l-8 39h-44l-8-39Z" fill="#fff" opacity="0.92" />
        <path d="M104 205c8 10 19 15 31 15s24-5 32-15" fill="none" stroke="#e85f70" strokeWidth="5" strokeLinecap="round" />
        <path d="M119 204c7-14 25-14 34 0-11 9-22 9-34 0Z" fill="#e84d61" stroke="#b9364b" strokeWidth="2" />
        <path d="M95 276c18 10 68 10 86 0" fill="none" stroke="#e85f70" strokeWidth="6" strokeLinecap="round" />
        <path d="M78 287c-3 12-2 24 2 29h21c5-11 5-22-1-32l-22 3Z" fill="#ffb3c2" stroke="#d96d85" strokeWidth="2" />
        <path d="M178 284c-6 10-6 21-1 32h21c4-5 5-17 2-29l-22-3Z" fill="#ffb3c2" stroke="#d96d85" strokeWidth="2" />
      </g>

      <g className="juno-mascot-head" transform={transforms.head}>
        <path d="M71 116c-3-47 26-79 67-83 43-4 72 29 68 77-3 42-28 70-67 72-40 1-65-24-68-66Z" fill="url(#mascotHair)" stroke="#8e5b4d" strokeWidth="2" />
        <path d="M83 125c3 34 25 55 57 55 31 0 54-22 58-55 3-31-16-57-58-57-41 0-60 26-57 57Z" fill="url(#mascotSkin)" stroke="#c58a7b" strokeWidth="2" />
        <path d="M86 91c27-34 78-42 109-9-16-1-43 7-61 21-16 13-32 17-48 12 0-7 0-15 0-24Z" fill="#E6AE90" opacity="0.9" />
        <path d="M72 126c-12-2-19 7-14 19 4 10 12 15 21 13l-7-32Z" fill="#f6c7b4" stroke="#b87963" strokeWidth="2" />
        <path d="M202 126c12-2 19 7 14 19-4 10-12 15-21 13l7-32Z" fill="#f6c7b4" stroke="#b87963" strokeWidth="2" />

        <g className="juno-mascot-eyes" transform={transforms.eyes}>
          <g className="juno-mascot-eye">
            <ellipse cx="113" cy="132" rx="13" ry="15" fill="#f8fbff" />
            <ellipse cx="115" cy="134" rx="7" ry="10" fill="#41639e" />
            <circle cx="112" cy="130" r="3" fill="#fff" />
          </g>
          <g className="juno-mascot-eye">
            <ellipse cx="164" cy="132" rx="13" ry="15" fill="#f8fbff" />
            <ellipse cx="166" cy="134" rx="7" ry="10" fill="#41639e" />
            <circle cx="163" cy="130" r="3" fill="#fff" />
          </g>
        </g>

        <path d="M104 113c8-5 18-5 28 0" fill="none" stroke="#7f534b" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        <path d="M151 113c9-5 20-5 29 0" fill="none" stroke="#7f534b" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        <path d="M139 131c-3 8-3 14 1 17" fill="none" stroke="#d59b89" strokeWidth="2" strokeLinecap="round" />
        <path d="M126 159c9 6 21 6 29 0" fill="none" stroke="#ae5e64" strokeWidth="2.5" strokeLinecap="round" />

        <g className="juno-mascot-flower" transform="translate(78 78) rotate(-18)">
          <circle cx="0" cy="0" r="5" fill="#f7d879" />
          <ellipse cx="0" cy="-13" rx="6" ry="13" fill="#ffd9ee" stroke="#d27797" />
          <ellipse cx="0" cy="13" rx="6" ry="13" fill="#fff0f6" stroke="#d27797" />
          <ellipse cx="-13" cy="0" rx="13" ry="6" fill="#fff0f6" stroke="#d27797" />
          <ellipse cx="13" cy="0" rx="13" ry="6" fill="#ffd9ee" stroke="#d27797" />
        </g>
        <g className="juno-mascot-flower" transform="translate(195 81) rotate(16)">
          <circle cx="0" cy="0" r="5" fill="#f7d879" />
          <ellipse cx="0" cy="-13" rx="6" ry="13" fill="#ffd9ee" stroke="#d27797" />
          <ellipse cx="0" cy="13" rx="6" ry="13" fill="#fff0f6" stroke="#d27797" />
          <ellipse cx="-13" cy="0" rx="13" ry="6" fill="#fff0f6" stroke="#d27797" />
          <ellipse cx="13" cy="0" rx="13" ry="6" fill="#ffd9ee" stroke="#d27797" />
        </g>
      </g>
    </svg>
  );
}

export function MascotCompanion() {
  const [pointer, setPointer] = useState<Pointer>({ x: 0, y: 0 });
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(mascotConfig.defaultModelId);
  const [live2dFailedModelId, setLive2dFailedModelId] = useState<string | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHidden(localStorage.getItem(mascotConfig.storageKeys.hidden) === "1");
    setSelectedModelId(localStorage.getItem(mascotConfig.storageKeys.modelId) ?? mascotConfig.defaultModelId);
    setMounted(true);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const nextX = event.clientX / window.innerWidth - 0.5;
      const nextY = event.clientY / window.innerHeight - 0.5;

      setPointer({
        x: clamp(nextX, -0.5, 0.5),
        y: clamp(nextY, -0.5, 0.5)
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    if (hidden) {
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [hidden]);

  const transforms = useMemo(() => {
    const headX = pointer.x * 9;
    const headY = pointer.y * 7;
    const eyeX = pointer.x * 5.5;
    const eyeY = pointer.y * 3.5;
    const bodyX = pointer.x * 3;

    return {
      body: `translate(${bodyX} 0)`,
      head: `translate(${headX} ${headY}) rotate(${pointer.x * 5} 150 115)`,
      eyes: `translate(${eyeX} ${eyeY})`
    };
  }, [pointer]);

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
  }

  function restoreMascot() {
    localStorage.removeItem(mascotConfig.storageKeys.hidden);
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

  const selectedModel = getModelById(selectedModelId);
  const shouldUseSvgFallback = selectedModel.type === "svg" || live2dFailedModelId === selectedModel.id;
  const activeModel = shouldUseSvgFallback ? getFallbackModel() : selectedModel;

  if (!mounted) {
    return null;
  }

  if (!mascotConfig.enabled) {
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
        <span aria-hidden="true" className="text-lg leading-none">♡</span>
      </button>
    );
  }

  return (
    <aside
      className="juno-mascot fixed bottom-0 left-3 z-30 hidden w-[210px] select-none md:block lg:left-5 lg:w-[240px]"
      aria-label="博客看板娘"
      onPointerEnter={() => showMessage(0)}
    >
      <div
        className={`absolute bottom-[210px] left-0 min-w-[190px] max-w-[250px] rounded-xl border border-amber-200/70 bg-[#fff7ea]/95 px-4 py-3 text-sm text-[#765436] shadow-[0_14px_34px_rgba(15,23,42,.18)] transition duration-300 lg:bottom-[245px] ${
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={hideMascot}
          className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full text-[#a47b50]/80 transition hover:bg-amber-100 hover:text-[#765436]"
          aria-label="隐藏看板娘"
        >
          <span aria-hidden="true" className="text-sm leading-none">×</span>
        </button>
        <p className="pr-4 leading-6">{mascotConfig.messages[messageIndex]}</p>
      </div>

      <div className="absolute bottom-[198px] left-1 z-10 lg:bottom-[232px]">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-full border border-cyan-200/25 bg-[#0d1024]/85 px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,.18)] backdrop-blur-xl transition hover:border-cyan-200/55 hover:bg-cyan-300/10"
          aria-expanded={menuOpen}
          aria-label="切换看板娘模型"
        >
          换装
        </button>

        {menuOpen && (
          <div className="mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-[#0d1024]/95 p-1 text-sm text-slate-100 shadow-[0_18px_40px_rgba(0,0,0,.28)] backdrop-blur-xl">
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
      </div>

      <button
        type="button"
        className="juno-mascot-stage relative block h-[260px] w-full cursor-pointer border-0 bg-transparent p-0 text-left lg:h-[300px]"
        onClick={() => showMessage()}
        aria-label="和看板娘互动"
      >
        {activeModel.type === "live2d" ? (
          <Live2DMascot
            model={activeModel}
            onError={() => {
              setLive2dFailedModelId(activeModel.id);
              setMessageIndex(0);
              setVisible(true);
            }}
          />
        ) : (
          <SvgMascot transforms={transforms} />
        )}
      </button>
    </aside>
  );
}
