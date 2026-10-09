// Run with: npm run seed
// Reads MONGODB_URI from .env.local and inserts demo tracks if the DB is empty.

import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

// Tiny .env.local loader so we don't need an extra dependency.
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing. Add it to .env.local first.");
  process.exit(1);
}

const SongSchema = new mongoose.Schema(
  {
    title: String,
    artist: String,
    album: String,
    genre: String,
    audioUrl: String,
    coverUrl: String,
  },
  { timestamps: true }
);
const Song = mongoose.model("Song", SongSchema);

const DEMO_SONGS = [
  { title: "Neon Skyline", artist: "Aurora Beats", album: "City Nights", genre: "Electronic", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", coverUrl: "" },
  { title: "Midnight Drive", artist: "Lunar Echo", album: "After Hours", genre: "Synthwave", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", coverUrl: "" },
  { title: "Sunrise Avenue", artist: "Coastal Waves", album: "Horizons", genre: "Chill", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", coverUrl: "" },
  { title: "Velvet Dreams", artist: "Nova Ray", album: "Soft Focus", genre: "Lo-fi", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", coverUrl: "" },
  { title: "City Lights", artist: "Pixel Pulse", album: "Neon", genre: "Electronic", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", coverUrl: "" },
  { title: "Ocean Bloom", artist: "Tidal", album: "Deep Blue", genre: "Ambient", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", coverUrl: "" },
  { title: "Paper Planes", artist: "Aurora Beats", album: "City Nights", genre: "Electronic", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", coverUrl: "" },
  { title: "Golden Hour", artist: "Nova Ray", album: "Soft Focus", genre: "Chill", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", coverUrl: "" },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  const count = await Song.countDocuments();
  if (count > 0) {
    console.log(`Songs already exist (${count}). Nothing added.`);
  } else {
    const inserted = await Song.insertMany(DEMO_SONGS);
    console.log(`Inserted ${inserted.length} demo songs.`);
  }
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
