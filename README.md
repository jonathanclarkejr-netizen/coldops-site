# ColdOps.ai — Next.js + Tailwind site

## Run locally
```bash
npm install
npm run dev
# then open http://localhost:3000
```

## Deploy to Vercel (recommended)
1. Push this folder to a new GitHub repo.
2. Go to vercel.com/import, select the repo, keep defaults.
3. Deploy. Attach your custom domain in Vercel settings.

## Deploy to Netlify
1. Push to GitHub.
2. Create a new site from Git in Netlify, build command: `npm run build`, publish dir: `.next` (or use Netlify Next.js runtime).

## Tailwind
- Global styles are in `app/globals.css`.
- Config is `tailwind.config.ts`.
