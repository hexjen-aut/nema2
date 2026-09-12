"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const VIEWPORT_WIDTH = 320;

// Modale de cadrage : avant l'envoi, permet de repositionner et zoomer la
// photo dans le cadre exact utilisé sur le site (le rapport largeur/hauteur
// "aspect" passé en prop), pour que le bon endroit de l'image soit visible
// une fois publiée.
export default function ImageCropModal({
  file,
  aspect,
  onCancel,
  onConfirm,
}: {
  file: File;
  aspect: number;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}) {
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origin: { x: number; y: number } } | null>(
    null
  );

  const viewport = useMemo(
    () => ({ w: VIEWPORT_WIDTH, h: Math.round(VIEWPORT_WIDTH / aspect) }),
    [aspect]
  );

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setImgEl(img);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!imgEl) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-noir/40 p-6">
        <div className="rounded-2xl bg-card p-6 text-sm text-ink/60">Chargement de l'image…</div>
      </div>
    );
  }

  const img = imgEl;

  // Échelle minimale pour que l'image recouvre entièrement le cadre ("cover").
  const coverScale = Math.max(viewport.w / img.naturalWidth, viewport.h / img.naturalHeight);
  const scale = coverScale * zoom;
  const dispW = img.naturalWidth * scale;
  const dispH = img.naturalHeight * scale;

  function clamp(o: { x: number; y: number }) {
    const minX = viewport.w - dispW;
    const minY = viewport.h - dispH;
    return {
      x: Math.min(0, Math.max(minX, o.x)),
      y: Math.min(0, Math.max(minY, o.y)),
    };
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: offset };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(clamp({ x: dragRef.current.origin.x + dx, y: dragRef.current.origin.y + dy }));
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function handleZoomChange(nextZoom: number) {
    setZoom(nextZoom);
    setOffset((o) => {
      const nextScale = coverScale * nextZoom;
      const nextDispW = img.naturalWidth * nextScale;
      const nextDispH = img.naturalHeight * nextScale;
      const minX = viewport.w - nextDispW;
      const minY = viewport.h - nextDispH;
      return { x: Math.min(0, Math.max(minX, o.x)), y: Math.min(0, Math.max(minY, o.y)) };
    });
  }

  function confirm() {
    const sx = -offset.x / scale;
    const sy = -offset.y / scale;
    const sw = viewport.w / scale;
    const sh = viewport.h / scale;

    const outW = 1400;
    const outH = Math.round(outW / aspect);
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
    canvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
      },
      "image/jpeg",
      0.92
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-noir/50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-card p-5">
        <p className="font-display text-lg">Cadrer la photo</p>
        <p className="mt-1 text-xs text-ink/50">
          Glissez pour repositionner, utilisez le curseur pour zoomer.
        </p>

        <div
          className="relative mx-auto mt-4 touch-none select-none overflow-hidden rounded-xl border border-ink/10 bg-linen"
          style={{ width: viewport.w, height: viewport.h }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt=""
            draggable={false}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              width: dispW,
              height: dispH,
              left: offset.x,
              top: offset.y,
            }}
          />
        </div>

        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => handleZoomChange(Number(e.target.value))}
          className="mt-4 w-full"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink/70 hover:border-ink/30"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={confirm}
            className="rounded-full bg-clay px-5 py-2 text-sm text-card hover:bg-ink transition-colors"
          >
            Valider le cadrage
          </button>
        </div>
      </div>
    </div>
  );
}
