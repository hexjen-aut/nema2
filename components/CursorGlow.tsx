"use client";
import { useEffect } from "react";

export default function CursorGlow() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    function handleMove(e: MouseEvent) {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return <div className="cursor-glow hidden md:block" aria-hidden="true" />;
}
