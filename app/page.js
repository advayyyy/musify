"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Player from "@/components/Player";
import SongRow from "@/components/SongRow";
import AddSongForm from "@/components/AddSongForm";
import { SearchIcon } from "@/components/icons";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [seeding, setSeeding] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/songs");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load songs");
        setSongs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter((s) =>
      [s.title, s.artist, s.album, s.genre].some((v) =>
        (v || "").toLowerCase().includes(q)
      )
    );
  }, [songs, query]);

  const currentSong = songs.find((s) => s._id === currentId) || null;

  // Load + autoplay whenever the selected track changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    audio.src = currentSong.audioUrl;
    audio.load();
    setProgress(0);
    setDuration(0);
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function playSong(song) {
    if (song._id === currentId) {
      togglePlay();
      return;
    }
    setCurrentId(song._id);
    setIsPlaying(true);
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!currentSong) {
      if (filtered.length) {
        setCurrentId(filtered[0]._id);
        setIsPlaying(true);
      }
      return;
    }
    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function step(dir) {
    if (!filtered.length) return;
    const idx = filtered.findIndex((s) => s._id === currentId);
    const next = filtered[(idx + dir + filtered.length) % filtered.length];
    setCurrentId(next._id);
    setIsPlaying(true);
  }

  function seek(value) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setProgress(value);
  }

  async function deleteSong(song) {
    if (!window.confirm(`Delete "${song.title}"?`)) return;
    const res = await fetch(`/api/songs/${song._id}`, { method: "DELETE" });
    if (res.ok) {
      setSongs((prev) => prev.filter((s) => s._id !== song._id));
      if (currentId === song._id) {
        setCurrentId(null);
        setIsPlaying(false);
      }
    }
  }

  async function loadDemo() {
    setSeeding(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      const res = await fetch("/api/songs");
      setSongs(await res.json());
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="min-h-screen pb-28">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => step(1)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4">
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Musify<span className="text-accent">.</span>
          </h1>
          <div className="relative ml-auto w-full max-w-xs">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists, albums..."
              className="w-full rounded-full border border-white/10 bg-panel py-2 pl-9 pr-3 text-sm text-gray-100 outline-none focus:border-accent"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-300">
            Library{" "}
            {songs.length > 0 && (
              <span className="text-gray-500">
                · {filtered.length} track{filtered.length === 1 ? "" : "s"}
              </span>
            )}
          </h2>
          <button
            onClick={loadDemo}
            disabled={seeding}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:border-accent hover:text-white disabled:opacity-50"
          >
            {seeding ? "Loading..." : "Load demo songs"}
          </button>
        </div>

        <div className="mb-5">
          <AddSongForm onAdded={(song) => setSongs((prev) => [song, ...prev])} />
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-16 text-center text-sm text-gray-500">Loading your library...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <p className="text-sm text-gray-400">
              {songs.length === 0 ? "Your library is empty." : "No songs match your search."}
            </p>
            {songs.length === 0 && (
              <p className="mt-1 text-xs text-gray-500">
                Click &quot;Load demo songs&quot; above to get started.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((song) => (
              <SongRow
                key={song._id}
                song={song}
                isCurrent={song._id === currentId}
                isPlaying={isPlaying}
                onPlay={playSong}
                onDelete={deleteSong}
              />
            ))}
          </div>
        )}
      </main>

      <Player
        song={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        duration={duration}
        volume={volume}
        onToggle={togglePlay}
        onNext={() => step(1)}
        onPrev={() => step(-1)}
        onSeek={seek}
        onVolume={setVolume}
      />
    </div>
  );
}
