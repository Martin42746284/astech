/**
 * Compression vidéo côté navigateur (module Galerie).
 *
 * Utilise ffmpeg.wasm (@ffmpeg/ffmpeg + @ffmpeg/core) chargé À LA DEMANDE :
 * le moteur (~31 Mo de WebAssembly) n'est téléchargé que lorsque l'administrateur
 * choisit une vidéo, jamais sur les pages publiques.
 *
 * Politique retenue : MP4 (H.264 + AAC), 30 s maximum, ~2 Mo après compression,
 * encodé en data-URL pour être stocké dans la base Neon (comme les photos).
 */
import coreUrl from "@ffmpeg/core?url";
import wasmUrl from "@ffmpeg/core/wasm?url";
import type { FFmpeg } from "@ffmpeg/ffmpeg";

/** Durée maximale d'une vidéo (au-delà : tronquée). */
export const VIDEO_MAX_DURATION = 30;
/** Poids visé après compression (2 Mo). */
export const VIDEO_TARGET_BYTES = 2 * 1024 * 1024;

/** Passes d'encodage de plus en plus agressives jusqu'à atteindre la cible de poids. */
const PASSES = [
  { crf: "26", scale: "720", audio: "64k" },
  { crf: "32", scale: "540", audio: "48k" },
  { crf: "36", scale: "480", audio: "32k" },
];

let ffPromise: Promise<FFmpeg> | null = null;
let progressCb: ((ratio: number) => void) | undefined;

/** Charge (une seule fois) le moteur ffmpeg.wasm, depuis les assets du projet. */
async function loadFFmpeg(): Promise<FFmpeg> {
  if (!ffPromise) {
    ffPromise = (async () => {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");
      const ff = new FFmpeg();
      ff.on("progress", ({ progress }) => {
        progressCb?.(Math.min(1, Math.max(0, progress)));
      });
      await ff.load({
        coreURL: await toBlobURL(coreUrl, "text/javascript"),
        wasmURL: await toBlobURL(wasmUrl, "application/wasm"),
      });
      return ff;
    })().catch((e) => {
      ffPromise = null; // permet de réessayer si le chargement échoue
      throw e;
    });
  }
  return ffPromise;
}

export type VideoMeta = { duration: number; width: number; height: number };

/** Lit la durée et le format d'une vidéo (nécessite un <video> natif). */
export function probeVideo(file: File): Promise<VideoMeta> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    const done = () => {
      URL.revokeObjectURL(url);
      resolve({ duration: v.duration, width: v.videoWidth, height: v.videoHeight });
    };
    v.onloadedmetadata = () => {
      // Certaines vidéos (WebM enregistrées, streams WhatsApp) annoncent une
      // durée « infinie » : on force un saut vers la fin pour la obtenir.
      if (Number.isFinite(v.duration)) return done();
      v.ontimeupdate = () => {
        v.ontimeupdate = null;
        done();
      };
      v.currentTime = 1e101;
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("ce fichier ne peut pas être lu comme une vidéo"));
    };
    v.src = url;
  });
}

/** Capture une vignette (WebP) à ~0,5 s de la vidéo — servira de miniature. */
export function capturePoster(file: File, at = 0.5): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "auto";
    v.muted = true;
    v.onloadedmetadata = () => {
      v.currentTime = Math.min(at, Math.max(0, (v.duration || 1) / 2));
    };
    v.onseeked = () => {
      try {
        const c = document.createElement("canvas");
        const scale = Math.min(1, 960 / (v.videoWidth || 960));
        c.width = Math.max(1, Math.round((v.videoWidth || 960) * scale));
        c.height = Math.max(1, Math.round((v.videoHeight || 540) * scale));
        c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
        const dataUrl = c.toDataURL("image/webp", 0.82);
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("impossible de capturer une image de la vidéo"));
    };
    v.src = url;
  });
}

export type CompressedVideo = {
  dataUrl: string;
  bytes: number;
  originalBytes: number;
  duration: number;
  passes: number;
};

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

/**
 * Compresse une vidéo en MP4 (H.264/AAC) : 30 s maximum, ~2 Mo après
 * compression (passes d'encodage croissantes jusqu'à atteindre la cible).
 * `onProgress` reçoit une progression 0→1 pendant l'encodage.
 */
export async function compressVideo(
  file: File,
  onProgress?: (ratio: number) => void,
): Promise<CompressedVideo> {
  const meta = await probeVideo(file);
  if (!Number.isFinite(meta.duration) || meta.duration <= 0) {
    throw new Error("durée illisible");
  }
  const duration = Math.min(meta.duration, VIDEO_MAX_DURATION);

  progressCb = onProgress;
  const ff = await loadFFmpeg();
  const inputName = "input" + extFor(file);
  await ff.writeFile(inputName, new Uint8Array(await file.arrayBuffer()));

  let best: Uint8Array<ArrayBuffer> | null = null;
  let bestPass = 0;
  try {
    for (const [i, p] of PASSES.entries()) {
      try {
        await ff.deleteFile("output.mp4");
      } catch {
        /* pas de fichier précédent */
      }
      const ret = await ff.exec([
        "-i",
        inputName,
        "-t",
        String(Math.ceil(duration)),
        "-map",
        "0:v:0",
        "-map",
        "0:a:0?",
        "-vf",
        `scale=min(${p.scale}\\,iw):-2`,
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        p.crf,
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        p.audio,
        "-ac",
        "1",
        "-movflags",
        "+faststart",
        "output.mp4",
      ]);
      if (ret !== 0) continue;
      const out = await ff.readFile("output.mp4");
      const data = typeof out === "string" ? new TextEncoder().encode(out) : out;
      if (!best || data.length < best.length) {
        best = new Uint8Array(data);
        bestPass = i + 1;
      }
      if (data.length <= VIDEO_TARGET_BYTES) break;
    }
  } finally {
    progressCb = undefined;
    try {
      await ff.deleteFile(inputName);
    } catch {
      /* rien */
    }
    try {
      await ff.deleteFile("output.mp4");
    } catch {
      /* rien */
    }
  }

  if (!best) throw new Error("le transcodage a échoué");
  const blob = new Blob([best], { type: "video/mp4" });
  return {
    dataUrl: await blobToDataUrl(blob),
    bytes: best.length,
    originalBytes: file.size,
    duration,
    passes: bestPass,
  };
}

function extFor(file: File): string {
  const fromName = /\.([a-z0-9]{1,5})$/i.exec(file.name)?.[1];
  if (fromName) return "." + fromName.toLowerCase();
  if (file.type.includes("webm")) return ".webm";
  if (file.type.includes("quicktime")) return ".mov";
  return ".mp4";
}

export function formatBytes(n: number): string {
  if (n >= 1024 * 1024) return (n / (1024 * 1024)).toFixed(1).replace(".", ",") + " Mo";
  if (n >= 1024) return Math.round(n / 1024) + " Ko";
  return n + " o";
}

export function formatDuration(s: number): string {
  if (!Number.isFinite(s)) return "—";
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return m > 0 ? `${m} min ${String(sec).padStart(2, "0")} s` : `${sec} s`;
}
