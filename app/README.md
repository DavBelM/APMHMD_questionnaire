# Maternal Health Monitoring Survey

A data collection tool for the research study *"Awareness and Preparedness
for Maternal Health Monitoring Devices"*. Enumerators use the questionnaire
form to record participant responses, which are stored in Supabase. A
password-protected admin dashboard lets the researcher view summary charts
and export the data as CSV.

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Supabase (Postgres database + Auth)
- React Router
- Recharts (admin charts)

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the SQL Editor, run the script in [`../supabase/schema.sql`](../supabase/schema.sql).
   This creates the `responses` table and the row-level security policies
   (anonymous users can submit responses; only logged-in users can read them).
3. Create an admin account: **Authentication → Users → Add user**, and set
   an email + password. Use these credentials to log into `/admin/login`.

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your project's API URL and anon key
(found in **Project Settings → API**):

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install and run

```bash
npm install
npm run dev
```

## App routes

- `/` — Consent / study information screen
- `/questionnaire` — Multi-step questionnaire (Sections A–D)
- `/thank-you` — Confirmation screen, with a button to start the next response
- `/admin/login` — Admin sign-in
- `/admin` — Dashboard: summary stats, charts, comments, and CSV export

## Deployment

Build with `npm run build` and deploy the `dist/` folder to Vercel, Netlify,
or any static host. Remember to set the same `VITE_SUPABASE_*` environment
variables on the hosting platform.
