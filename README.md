# Russian Tutor

A personal Russian language tutor web app — structured, university-style lessons backed by an AI tutor (Gemini).

## Local development

### Prerequisites

- Node.js 18+
- Vercel CLI: `npm i -g vercel`
- A Gemini API key (free tier)

### Setup

1. Clone the repo:
   ```
   git clone <repo-url>
   cd russian-tutor
   ```

2. Create a `.env` file in the project root:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Link to your Vercel project (first time only):
   ```
   vercel link
   ```

4. Pull environment variables:
   ```
   vercel env pull .env.local
   ```

5. Start the local dev server:
   ```
   vercel dev
   ```

6. Open `http://localhost:3000/app/` in your browser.

### Project structure

```
app/           Browser code (HTML, CSS, vanilla JS)
api/           Vercel serverless functions
curriculum/    Lesson JSON files organised by block
prompts/       Tutor system prompts for each phase
data/          Runtime user data (via Vercel KV)
config/        App settings and .env
```

See `CLAUDE.md` for full architecture details.

## Deployment

Push to GitHub. Vercel auto-deploys from the main branch.

### Environment variables (set in Vercel dashboard)

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Gemini API key |
| `KV_REST_API_URL` | Vercel KV REST URL (auto-configured) |
| `KV_REST_API_TOKEN` | Vercel KV REST token (auto-configured) |

### Vercel KV setup

1. Go to your Vercel project dashboard
2. Navigate to Storage > Create Database > KV
3. Follow the setup wizard — environment variables are injected automatically

## Tech stack

- **Frontend:** HTML + CSS + vanilla JS (no frameworks, no build step)
- **Backend:** Vercel serverless functions (Node.js)
- **AI:** Gemini 2.5 Flash (primary), Gemini 2.5 Flash-Lite (fallback)
- **Storage:** Vercel KV
- **Icons:** Lucide Icons (CDN)
