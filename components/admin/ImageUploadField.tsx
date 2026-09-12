"use client";

import { useRef, useState } from "react";

type Folder = "site-content" | "categories" | "products";

type UploadedFile = { name: string; url: string };

function uploadOne(
  file: File,
  folder: Folder,
  prefix: string | undefined,
  onProgress: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && body.url) {
          resolve(body.url as string);
        } else {
          reject(new Error(body.error || "Échec de l'envoi."));
        }
      } catch {
        reject(new Error("Réponse invalide du serveur."));
      }
    };
    xhr.onerror = () => reject(new Error("Erreur réseau pendant l'envoi."));

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    if (prefix) fd.append("prefix", prefix);
    xhr.send(fd);
  });
}

// Champ d'envoi d'image(s) avec barre de progression réelle (suivi des
// octets envoyés). Une fois l'envoi terminé, l'URL obtenue est déposée
// dans un champ caché du formulaire parent — le reste du formulaire
// (nom, description...) se soumet ensuite normalement.
export default function ImageUploadField({
  name,
  folder,
  prefix,
  label = "Image",
  multiple = false,
  accept = "image/*",
}: {
  name: string;
  folder: Folder;
  prefix?: string;
  label?: string;
  multiple?: boolean;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError(null);
    setUploaded([]);
    setProgress(0);

    const results: UploadedFile[] = [];
    const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
    let bytesDoneBeforeCurrent = 0;

    try {
      for (const file of files) {
        const url = await uploadOne(file, folder, prefix, (pct) => {
          const currentBytes = (pct / 100) * file.size;
          setProgress(Math.round(((bytesDoneBeforeCurrent + currentBytes) / totalBytes) * 100));
        });
        results.push({ name: file.name, url });
        bytesDoneBeforeCurrent += file.size;
      }
      setUploaded(results);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi.");
      setProgress(null);
    }
  }

  const uploading = progress !== null && progress < 100;

  return (
    <div>
      <label className="text-sm text-ink/70">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={uploading}
        className="mt-1 w-full text-xs disabled:opacity-50"
      />

      {progress !== null && (
        <div className="mt-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-linen">
            <div
              className="h-full rounded-full bg-clay transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-ink/50">
            {progress < 100 ? `Envoi… ${progress}%` : "Envoyé ✓"}
          </p>
        </div>
      )}

      {error && <p className="mt-1 text-[11px] text-red-700">{error}</p>}

      {uploaded.map((f) => (
        <input key={f.url} type="hidden" name={name} value={f.url} />
      ))}
    </div>
  );
}
