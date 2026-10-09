import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";

// Public-domain / royalty-free demo tracks hosted by SoundHelix,
// so the player works out of the box without you uploading anything.
const DEMO_SONGS = [
  { title: "Neon Skyline", artist: "Aurora Beats", album: "City Nights", genre: "Electronic", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Midnight Drive", artist: "Lunar Echo", album: "After Hours", genre: "Synthwave", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Sunrise Avenue", artist: "Coastal Waves", album: "Horizons", genre: "Chill", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Velvet Dreams", artist: "Nova Ray", album: "Soft Focus", genre: "Lo-fi", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { title: "City Lights", artist: "Pixel Pulse", album: "Neon", genre: "Electronic", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { title: "Ocean Bloom", artist: "Tidal", album: "Deep Blue", genre: "Ambient", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { title: "Paper Planes", artist: "Aurora Beats", album: "City Nights", genre: "Electronic", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
  { title: "Golden Hour", artist: "Nova Ray", album: "Soft Focus", genre: "Chill", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" },
];

// POST /api/seed -> insert demo songs (skips if any already exist)
export async function POST() {
  try {
    await connectDB();

    const existing = await Song.countDocuments();
    if (existing > 0) {
      return NextResponse.json({
        ok: true,
        inserted: 0,
        message: "Songs already exist — nothing added.",
      });
    }

    const inserted = await Song.insertMany(DEMO_SONGS);
    return NextResponse.json({ ok: true, inserted: inserted.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
