"use client";

import { PlayIcon, PauseIcon, NextIcon, PrevIcon, VolumeIcon } from "./icons";

function fmt(t) {
  if (!t || !isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function Player({
  song,
  isPlaying,
  progress,
  duration,
  volume,
  onToggle,
  onNext,
  onPrev,
  onSeek,
  onVolume,
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-panel/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
        <div className="w-32 shrink-0 sm:w-40">
          {song ? (
            <>
              <p className="truncate text-sm font-medium text-white">{song.title}</p>
              <p className="truncate text-xs text-gray-400">{song.artist}</p>
            </>
          ) : (
            <p className="text-xs text-gray-500">Nothing playing</p>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onPrev}
            className="rounded-full p-2 text-gray-300 hover:bg-white/5 hover:text-white"
            aria-label="Previous"
          >
            <PrevIcon className="h-5 w-5" />
          </button>
          <button
            onClick={onToggle}
            className="rounded-full bg-accent p-2.5 text-white hover:brightness-110"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
          </button>
          <button
            onClick={onNext}
            className="rounded-full p-2 text-gray-300 hover:bg-white/5 hover:text-white"
            aria-label="Next"
          >
            <NextIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 items-center gap-3">
          <span className="w-10 text-right text-[11px] tabular-nums text-gray-500">
            {fmt(progress)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={progress || 0}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="flex-1"
            aria-label="Seek"
          />
          <span className="w-10 text-[11px] tabular-nums text-gray-500">{fmt(duration)}</span>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <VolumeIcon className="h-4 w-4 text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolume(Number(e.target.value))}
            className="w-20"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
