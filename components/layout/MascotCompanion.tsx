"use client";

import { useEffect, useRef, useState } from "react";
import { Live2DMascot } from "@/components/layout/Live2DMascot";
import { mascotConfig, type MascotModel } from "@/data/mascot";

function getFallbackModel() {
  return mascotConfig.models.find((model) => model.type === "placeholder") ?? mascotConfig.models[0];
}

function getModelById(modelId: string | null): MascotModel {
  return mascotConfig.models.find((model) => model.id === modelId) ?? getFallbackModel();
}

function PlaceholderMascot() {
  return (
    <div className="grid h-16 w-16 place-items-center rounded-full border border-cyan-200/30 bg-[#0d1024]/90 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,.22)] backdrop-blur-xl">
      <span aria-hidden="true" className="text-2xl leading-none">♡</span>
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
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHidden(localStorage.getItem(mascotConfig.storageKeys.hidden) === "1");
    setSelectedModelId(localStorage.getItem(mascotConfig.storageKeys.modelId) ?? mascotConfig.defaultModelId);
    setMounted(true);
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
  const shouldUsePlaceholder = selectedModel.type === "placeholder" || live2dFailedModelId === selectedModel.id;
  const activeModel = shouldUsePlaceholder ? getFallbackModel() : selectedModel;

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
        <span aria-hidden="true" className="text-lg leading-none">♡</span>
      </button>
    );
  }

  return (
    <aside
      className="juno-mascot fixed bottom-5 left-5 z-30 hidden w-[260px] select-none md:block"
      aria-label="博客看板娘"
      onPointerEnter={() => showMessage(0)}
    >
      <div
        className={`absolute bottom-20 left-0 min-w-[210px] max-w-[260px] rounded-xl border border-amber-200/70 bg-[#fff7ea]/95 px-4 py-3 text-sm text-[#765436] shadow-[0_14px_34px_rgba(15,23,42,.18)] transition duration-300 ${
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

      <div className="absolute bottom-0 left-20 z-10">
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
          <div className="mb-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-[#0d1024]/95 p-1 text-sm text-slate-100 shadow-[0_18px_40px_rgba(0,0,0,.28)] backdrop-blur-xl">
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
        className={`juno-mascot-stage relative block cursor-pointer border-0 bg-transparent p-0 text-left ${
          activeModel.type === "live2d" ? "h-[300px] w-[240px]" : "h-16 w-16"
        }`}
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
          <PlaceholderMascot />
        )}
      </button>
    </aside>
  );
}
