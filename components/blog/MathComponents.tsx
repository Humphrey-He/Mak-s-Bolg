"use client";

import { useState } from "react";
import katex from "katex";

interface KatexProps {
  math: string;
  display?: boolean;
  className?: string;
}

export function Katex({ math, display = false, className = "" }: KatexProps) {
  const [html, setHtml] = useState("");

  if (typeof window !== "undefined") {
    try {
      const html = katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
        output: "html",
      });
      setHtml(html);
    } catch (e) {
      console.error("KaTeX error:", e);
    }
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ color: "inherit" }}
    />
  );
}

export function MathBlock({ math, className = "" }: KatexProps) {
  const [html, setHtml] = useState("");

  if (typeof window !== "undefined") {
    try {
      const html = katex.renderToString(math, {
        displayMode: true,
        throwOnError: false,
        output: "html",
      });
      setHtml(html);
    } catch (e) {
      console.error("KaTeX error:", e);
    }
  }

  return (
    <div
      className={`my-6 overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
