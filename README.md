# Photography Booking (Netlify + Netlify DB / Neon)

## What you get
- `index.html` — modern booking form with package cards + add-ons + live total
- `admin.html` — admin page that shows bookings (refreshes every 5 seconds)
- `netlify/functions/create-booking.mjs` — saves booking to Neon Postgres
- `netlify/functions/list-bookings.mjs` — loads bookings for admin page

## Step 1 — Enable Netlify DB (Neon)
In Netlify Dashboard:
- Extensions → Neon (Netlify DB)
- Ensure you see env vars like `NETLIFY_DATABASE_URL`.

## Step 2 — Create the bookings table
In your Neon SQL editor/console, run:

```sql
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,

  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  package_price INTEGER NOT NULL,

  addon_extra_edit TEXT NOT NULL DEFAULT 'no',
  extra_edit_qty INTEGER NOT NULL DEFAULT 0,
  addon_video TEXT NOT NULL DEFAULT 'no',
  addon_express TEXT NOT NULL DEFAULT 'no',
  addon_travel_outside TEXT NOT NULL DEFAULT 'no',

  notes TEXT NOT NULL DEFAULT '',
  total_price INTEGER NOT NULL
);
```

## Step 3 — Deploy (IMPORTANT)
This project uses an npm dependency (`@netlify/neon`).
So deploy via **GitHub repo**, not drag & drop:

1. Create a new GitHub repository
2. Upload all files from this folder
3. In Netlify: “Add new site” → “Import from Git”
4. Deploy

## Step 4 — Use
- Booking form: `/index.html`
- Admin page: `/admin.html`
