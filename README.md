# Nutrition Log

A personal, private nutrition tracking web app. Built with Next.js, TypeScript, Tailwind CSS, and SQLite via Prisma. Fast manual entry, reusable food library, meal templates, history, and data export.

## Features

- **Daily Log** — Grouped by meal category (Breakfast, Snack, Lunch, Pre-workout, Dinner, Other)
- **Quick Entry** — Add food fast; pick from saved library or enter manually
- **Food Library** — Save and reuse common foods with full macro data
- **Meal Templates** — One-click insertion of full meals into any day
- **History & Search** — Browse past days, filter by date range or food name
- **Daily Totals** — Calories, protein, carbs, fat with optional targets
- **Export & Backup** — Download all data as JSON or CSV

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) + SQLite

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd nutrition-log
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

The default `.env` uses a local SQLite file (`prisma/dev.db`). No external database needed.

### 3. Set up the database

```bash
npm run db:generate   # generate Prisma client
npm run db:push       # create the database schema
npm run db:seed       # load sample food items and templates (optional)
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Production Deployment

### Option A: Self-host on a VPS / Linux server

```bash
npm run build
npm run start
```

Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start "npm run start" --name nutrition-log
pm2 save
```

Keep the `prisma/dev.db` file backed up (it's your entire database).

### Option B: Deploy to Vercel

> Note: SQLite is not persistent on Vercel's serverless environment. For Vercel, switch the Prisma datasource to Postgres (e.g. Supabase) and update `DATABASE_URL` accordingly.

1. Push repo to GitHub.
2. Import in [Vercel](https://vercel.com).
3. Set `DATABASE_URL` environment variable.
4. Deploy.

---

## Database

SQLite database is stored at `prisma/dev.db`. To browse data visually:

```bash
npm run db:studio
```

### Schema overview

| Table | Purpose |
|---|---|
| `LogEntry` | Individual food entries per day |
| `FoodItem` | Reusable food library |
| `MealTemplate` | Saved meal templates |
| `TemplateItem` | Items within a meal template |
| `UserSettings` | Daily macro targets and preferences |

---

## Backup

Use the **Export** page in the app to download:

- Full backup (JSON) — all data
- Log entries (JSON or CSV)
- Food library (JSON or CSV)
- Meal templates (JSON)

Back up `prisma/dev.db` directly for a complete database backup.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `file:./dev.db` | SQLite file path |

---

## Project Structure

```
src/
  app/
    page.tsx            # Today's log (main screen)
    history/page.tsx    # History & search
    library/page.tsx    # Food library
    templates/page.tsx  # Meal templates
    settings/page.tsx   # Settings
    export/page.tsx     # Export & backup
    api/
      entries/          # Log entry CRUD
      foods/            # Food library CRUD
      templates/        # Template CRUD
      settings/         # Settings
      export/           # Data export
  components/
    layout/Sidebar.tsx
    log/EntryCard.tsx
    log/MealSection.tsx
    log/DailyTotals.tsx
    forms/EntryForm.tsx
    ui/Modal.tsx
  lib/
    db.ts               # Prisma client singleton
    utils.ts            # Shared utilities
  types/index.ts        # Shared TypeScript types
prisma/
  schema.prisma         # Database schema
  seed.ts               # Sample data seed
```
