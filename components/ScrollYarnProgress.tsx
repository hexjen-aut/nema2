"use client";
import { useEffect, useState } from "react";

export default function ScrollYarnProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="yarn-progress-track" aria-hidden="true">
      <div
        className="yarn-progress-fill"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
