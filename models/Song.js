import mongoose from "mongoose";

const SongSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, default: "Unknown Album", trim: true },
    genre: { type: String, default: "Other", trim: true },
    audioUrl: { type: String, required: true, trim: true },
    coverUrl: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

// Avoid recompiling the model on hot reload.
export default mongoose.models.Song || mongoose.model("Song", SongSchema);
