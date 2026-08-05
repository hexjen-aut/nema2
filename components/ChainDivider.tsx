"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  color?: string;
  className?: string;
};

// Motif signature du site : une chaînette crochet qui se dessine à l'entrée dans le viewport.
export default function ChainDivider({ color = "#A85D3B", className = "" }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 240 24"
      preserveAspectRatio="none"
      className={`chain-draw h-4 w-full ${visible ? "is-visible" : ""} ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 12 C 10 2, 20 2, 30 12 C 40 22, 50 22, 60 12 C 70 2, 80 2, 90 12 C 100 22, 110 22, 120 12 C 130 2, 140 2, 150 12 C 160 22, 170 22, 180 12 C 190 2, 200 2, 210 12 C 220 22, 230 22, 240 12"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
