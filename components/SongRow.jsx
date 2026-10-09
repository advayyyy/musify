"use client";

import { PlayIcon, PauseIcon, TrashIcon } from "./icons";

function hueFrom(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}

export default function SongRow({ song, isCurrent, isPlaying, onPlay, onDelete }) {
  const hue = hueFrom(song.title + song.artist);
  const gradient = `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 45) % 360} 70% 35%))`;

  return (
    <div
      className={`group flex items-center gap-4 rounded-xl border px-4 py-3 transition ${
        isCurrent
          ? "border-accent/60 bg-accent/10"
          : "border-white/5 bg-panel hover:border-white/15"
      }`}
    >
      <button
        onClick={() => onPlay(song)}
        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg"
        style={!song.coverUrl ? { background: gradient } : undefined}
        aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
      >
        {song.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={song.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/90">
            {song.title.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100">
          {isCurrent && isPlaying ? (
            <PauseIcon className="h-5 w-5 text-white" />
          ) : (
            <PlayIcon className="h-5 w-5 text-white" />
          )}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isCurrent ? "text-white" : "text-gray-200"}`}>
          {song.title}
        </p>
        <p className="truncate text-xs text-gray-400">
          {song.artist}
          {song.album ? ` · ${song.album}` : ""}
        </p>
      </div>

      <span className="hidden rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-gray-400 sm:inline">
        {song.genre}
      </span>

      <button
        onClick={() => onDelete(song)}
        className="rounded-md p-1.5 text-gray-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
        aria-label="Delete song"
        title="Delete"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
