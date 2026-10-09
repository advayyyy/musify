"use client";

import { useState } from "react";

const empty = { title: "", artist: "", album: "", genre: "", audioUrl: "", coverUrl: "" };

export default function AddSongForm({ onAdded }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.title || !form.artist || !form.audioUrl) {
      setError("Title, artist and audio URL are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add song");
      onAdded(data);
      setForm(empty);
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-panel/60 p-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-medium text-gray-200">Add a song</span>
        <span className="text-xs text-gray-400">{open ? "Close" : "Open"}</span>
      </button>

      {open && (
        <form onSubmit={submit} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Title *" value={form.title} onChange={(v) => set("title", v)} />
          <Field label="Artist *" value={form.artist} onChange={(v) => set("artist", v)} />
          <Field label="Album" value={form.album} onChange={(v) => set("album", v)} />
          <Field label="Genre" value={form.genre} onChange={(v) => set("genre", v)} />
          <div className="sm:col-span-2">
            <Field
              label="Audio URL * (a direct .mp3 link)"
              value={form.audioUrl}
              onChange={(v) => set("audioUrl", v)}
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Cover image URL (optional)"
              value={form.coverUrl}
              onChange={(v) => set("coverUrl", v)}
            />
          </div>
          {error && <p className="sm:col-span-2 text-xs text-red-400">{error}</p>}
          <div className="sm:col-span-2">
            <button
              disabled={saving}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add song"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-gray-400">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
      />
    </label>
  );
}
