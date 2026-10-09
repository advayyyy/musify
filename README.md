# Musify

A clean, simple music streaming site. Browse your library, search, play tracks with a
full audio player (seek, volume, next/prev), and add or remove songs — all stored in
MongoDB.

Built with **Next.js 14 (App Router)**, **MongoDB (Mongoose)** and **Tailwind CSS**.

## Features

- Song library loaded from MongoDB
- Bottom audio player: play/pause, next/previous, seek bar, volume
- Instant search across title, artist, album and genre
- Add a song (title, artist, album, genre, audio URL, cover image URL)
- Delete a song
- "Load demo songs" button so the player works right away
- Clean dark UI, fully responsive

## Tech stack

| Layer    | Choice                     |
| -------- | -------------------------- |
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend  | Next.js API routes (Node runtime) |
| Database | MongoDB Atlas via Mongoose |

## Project structure

```
musify/
├─ app/
│  ├─ api/
│  │  ├─ songs/route.js        # GET (list/search) + POST (add)
│  │  ├─ songs/[id]/route.js   # DELETE + PATCH
│  │  └─ seed/route.js         # POST: insert demo songs
│  ├─ globals.css
│  ├─ layout.js
│  └─ page.js                  # main UI
├─ components/
│  ├─ Player.jsx               # bottom audio player
│  ├─ SongRow.jsx              # one track row
│  ├─ AddSongForm.jsx          # add-a-song form
│  └─ icons.jsx
├─ lib/mongodb.js              # cached Mongo connection
├─ models/Song.js              # Song schema
├─ scripts/seed.mjs            # CLI seeder (npm run seed)
├─ .env.example
└─ package.json
```

## 1. Local setup

```bash
git clone <your-repo-url>
cd musify
npm install
```

Create a `.env.local` file (it is gitignored — never commit it):

```bash
cp .env.example .env.local
```

Then open `.env.local` and paste your own MongoDB connection string:

```
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-host>/musify?retryWrites=true&w=majority"
```

> Tip: add a database name (like `/musify`) right before the `?`. If you leave it out,
> MongoDB writes to a default database called `test`.

Run it:

```bash
npm run dev
# open http://localhost:3000
```

Click **Load demo songs** to fill the library with royalty-free tracks, or use the
**Add a song** form. You can also seed from the terminal:

```bash
npm run seed
```

## 2. MongoDB Atlas setup

1. Go to <https://cloud.mongodb.com> and create a free (M0) cluster if you don't have one.
2. **Database Access** → add a database user with a username and password.
3. **Network Access** → add an IP address.
   - For local development, add your current IP.
   - For Vercel, add `0.0.0.0/0` (allow from anywhere), because Vercel's serverless
     functions use dynamic IPs. Keep your password strong since this is public.
4. **Connect → Drivers** → copy the connection string and put it in `.env.local`
   (and later in Vercel's environment variables).

## 3. Deploy on Vercel

Yes — this app deploys on Vercel with zero config.

1. Push this repo to GitHub (see below).
2. Go to <https://vercel.com/new> and import the repository.
3. Vercel auto-detects Next.js — leave the build settings as they are.
4. Before/after importing, open **Project → Settings → Environment Variables** and add:
   - **Name:** `MONGODB_URI`
   - **Value:** your full connection string (the one with `/musify?...`)
   - Environments: Production, Preview, Development
5. Click **Deploy**. You'll get a URL like `https://musify-xxxx.vercel.app`.

Every push to `main` redeploys automatically.

> If the deployed site shows a connection error, it is almost always the Atlas
> **Network Access** allowlist — make sure `0.0.0.0/0` (or your host's IPs) is allowed.

### Other hosting options

Vercel is the simplest for Next.js. Netlify and Render also work, and any Node host
(Railway, Fly.io, a VPS) can run it with `npm run build && npm start`. You still need
the `MONGODB_URI` environment variable set on whichever platform you choose.

## API reference

| Method | Route            | Description                          |
| ------ | ---------------- | ------------------------------------ |
| GET    | `/api/songs`     | List all songs (`?q=` to search)     |
| POST   | `/api/songs`     | Add a song                           |
| PATCH  | `/api/songs/:id` | Update a song                        |
| DELETE | `/api/songs/:id` | Delete a song                        |
| POST   | `/api/seed`      | Insert demo songs (only if empty)    |

## Notes on audio

The app plays any direct audio URL (`.mp3` etc.). The demo tracks use SoundHelix's
public example files. For real songs, host the audio somewhere that allows direct
linking (Cloudflare R2, S3, Supabase Storage, etc.) and paste the URL in the add form.
