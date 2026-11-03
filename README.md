# Muer

Muer is a dark, Spotify-inspired music web player built with React and Vite. It searches YouTube for music, plays tracks through the YouTube IFrame Player API, and provides a local library experience with liked songs, playlists, queue controls, playback history, and worldwide trending music.

## Features

- Search YouTube for songs and artists
- Discover worldwide trending music
- Play, pause, skip, seek, shuffle, repeat, and control volume
- Manage an up-next queue
- Like songs and view them in **Liked Songs**
- Create playlist folders and add songs to them
- View the current song and queue in a dedicated player view
- Persist playback state, navigation state, likes, playlists, and search results in browser `localStorage`
- Cache trending tracks in the backend and refresh them every eight hours
- End-to-end tests with Playwright

## Tech stack

- React 19
- Vite
- Express 5
- YouTube Data API v3
- YouTube IFrame Player API
- SQLite through `better-sqlite3`
- Tailwind CSS and Bootstrap Icons
- Playwright

## Requirements

- Node.js and npm
- A YouTube Data API v3 key

## Getting started

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/marcml10/muere.git
   cd muere
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   YOUTUBE_API_KEY=your_youtube_data_api_key
   ```

   The key must have access to the YouTube Data API v3.

3. Start the backend in one terminal:

   ```bash
   npm run server
   ```

   The Express server runs at `http://localhost:3000`. On startup it creates or opens `server/database/muer.db`, applies `server/database/schema.sql`, and begins refreshing trending music.

4. Start the Vite frontend in another terminal:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173`.

The frontend expects the backend at `http://localhost:3000`. Both services must be running for search and trending data to work.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run server` | Start the Express API server |
| `npm run build` | Create a production frontend build |
| `npm run preview` | Preview the production frontend build |
| `npm run lint` | Run ESLint |
| `npx playwright test` | Run the Playwright end-to-end test suite |

## API

The backend exposes the following routes:

### `GET /api/search?q=<query>`

Searches YouTube for videos and channels. The response includes normalized tracks and, when detected, matching artist channel metadata.

### `GET /api/trending`

Returns cached worldwide trending music tracks. The cache is refreshed when it is empty or older than eight hours.

## Project structure

```text
client/
  src/
    components/       Shared layout, player, sidebar, and queue components
    pages/            Home, search, settings, liked songs, playlists, and now-playing views
    playback/         Playback, queue, likes, history, and YouTube player state
    search/           Search input and result filtering
server/
  database/           SQLite connection and schema
  routes/             Express API routes
  services/           YouTube API integration and trending cache
tests/
  functioning/        Player, queue, search, and playlist behavior tests
  navigation/         Navigation tests
```

## Running end-to-end tests

Start the backend and frontend in separate terminals, then run:

```bash
npx playwright test
```

The tests target `http://localhost:5173` and mock YouTube-backed API requests where appropriate. Playwright reports are written to `playwright-report/`.

## Data and privacy

User preferences and library data are stored locally in the browser. The backend stores its SQLite database in `server/database/muer.db`. YouTube searches and trending requests are sent through the YouTube Data API using the key configured in `.env`.

## License

No license has been specified for this project yet.
