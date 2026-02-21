import { useEffect } from "react";

declare global {
  interface Window {
    AsciiTheme?: {
      initAsciiTheme?: (options?: Record<string, unknown>) => void;
    };
  }
}

const ASCII_STYLE_ID = "ascii-theme-css";
const ASCII_SCRIPT_ID = "ascii-theme-js";
const ASCII_CSS_SRC = "https://unpkg.com/@abvx/ascii-theme@0.2.0/dist/style.css";
const ASCII_JS_SRC = "https://unpkg.com/@abvx/ascii-theme@0.2.0/dist/ascii-theme.umd.js";

function resetAsciiStyleOnLoad(storageKey: string): void {
  document.documentElement.dataset.style = "default";
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { style?: "default" | "ascii"; mode?: "light" | "dark" };
    if (!parsed || typeof parsed !== "object" || parsed.style === undefined) return;
    delete parsed.style;
    window.localStorage.setItem(storageKey, JSON.stringify(parsed));
  } catch {
    // no-op
  }
}

function initAsciiTheme(): void {
  if (typeof window === "undefined") return;
  if (document.documentElement.dataset.asciiThemeInit === "1") return;

  resetAsciiStyleOnLoad("toki_theme_v1");

  window.AsciiTheme?.initAsciiTheme?.({
    integrateTheme: "auto",
    addStyleToggle: true,
    addThemeToggle: true,
    mountSelector: "#ascii-toggle-anchor",
    mountPlacement: "append",
    storageKey: "toki_theme_v1",
    className: "toki-ascii-toggle"
  });

  document.documentElement.dataset.asciiThemeInit = "1";
}

export default function AsciiThemeBoot() {
  useEffect(() => {
    const head = document.head;
    if (!head) return;

    if (!document.getElementById(ASCII_STYLE_ID)) {
      const link = document.createElement("link");
      link.id = ASCII_STYLE_ID;
      link.rel = "stylesheet";
      link.href = ASCII_CSS_SRC;
      head.appendChild(link);
    }

    if (window.AsciiTheme?.initAsciiTheme) {
      initAsciiTheme();
      return;
    }

    let script = document.getElementById(ASCII_SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = ASCII_SCRIPT_ID;
      script.src = ASCII_JS_SRC;
      script.async = true;
      script.onload = () => {
        initAsciiTheme();
      };
      head.appendChild(script);
      return;
    }

    script.addEventListener("load", initAsciiTheme);
    return () => {
      script?.removeEventListener("load", initAsciiTheme);
    };
  }, []);

  return null;
}
