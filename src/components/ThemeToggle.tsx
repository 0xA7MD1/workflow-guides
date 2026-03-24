"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("wf_theme");
    if (saved === "light") {
      setTheme("light");
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("wf_theme", next);
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-6 left-6 z-[100] w-11 h-11 rounded-full bg-surface border border-border flex items-center justify-center text-lg shadow-lg hover:bg-surface2 hover:border-primary/40 transition-all cursor-pointer"
      title={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
