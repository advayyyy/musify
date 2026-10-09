import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";

// DELETE /api/songs/:id
export async function DELETE(_request, { params }) {
  try {
    await connectDB();
    const deleted = await Song.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/songs/:id  -> update fields
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const updated = await Song.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
