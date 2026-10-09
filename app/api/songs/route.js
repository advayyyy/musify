import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";

// GET /api/songs?q=search  -> list all songs (optionally filtered)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { artist: { $regex: q, $options: "i" } },
            { album: { $regex: q, $options: "i" } },
            { genre: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const songs = await Song.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(songs);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/songs  -> add a new song
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, artist, album, genre, audioUrl, coverUrl } = body || {};

    if (!title || !artist || !audioUrl) {
      return NextResponse.json(
        { error: "title, artist and audioUrl are required" },
        { status: 400 }
      );
    }

    const song = await Song.create({
      title,
      artist,
      album: album || "Unknown Album",
      genre: genre || "Other",
      audioUrl,
      coverUrl: coverUrl || "",
    });

    return NextResponse.json(song, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
