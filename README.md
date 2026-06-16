# High School AI Art Competition

This is a Next.js website for running a high school AI art competition. It supports student accounts, artwork submissions, private gallery access codes, judge access codes, voting, and an organizer admin dashboard.

The most important setup file is [`config/event.ts`](config/event.ts). Future show runners should start there.

## What You Can Change Without Coding

Open [`config/event.ts`](config/event.ts) and replace the placeholder values.

| Setting | What it controls | Example |
| --- | --- | --- |
| `competitionName` | Browser title, footer, legal page titles | `"Lincoln High AI Art Show"` |
| `siteTitle` | Short name in the top navigation | `"AI Art Show"` |
| `heroTitleLines` | The three large homepage title lines | `["Lincoln High", "AI Art", "Show"]` |
| `schoolName` | Internal school/event label for organizers | `"Lincoln High School"` |
| `schoolNamePlaceholder` | Placeholder in the student school field | `"Lincoln High School"` |
| `audienceLabel` | Who can enter | `"Lincoln High students"` |
| `entryWindowLabel` | Homepage date label | `"May 4-18"` |
| `contactEmail` | Footer and privacy contact email | `"artshow@example.org"` |
| `organizersLabel` | How rejection/legal copy names the organizers | `"the art show organizers"` |
| `fundsRecipientLabel` | Where gallery-code fundraiser money goes | `"the front office"` |
| `campusTourLabel` | Prize section tour label | `"a campus tour"` |
| `campusTourDescription` | Sentence under the prize section | `"Winners may be invited to a campus tour."` |
| `maxSubmissionsPerUser` | Number of submissions per student account | `2` |
| `maxVotesPerUser` | Votes shown in the app | `3` |
| `reservedGalleryCodesPerStudent` | Free/reserved student gallery codes | `1` |
| `fundraiserGalleryCodesPerStudent` | Printable fundraiser gallery codes | `10` |
| `fundraiserCodePriceLabel` | Price text for fundraiser codes | `"$1 cash"` |
| `themes` | Theme dropdown and homepage theme list | `["Future Cities", "Nature", "Other"]` |
| `judgingCriteria` | Homepage scoring weights | `{ label: "Creativity", weight: "50%" }` |
| `prizes` | Homepage prize cards | `{ place: "1st", label: "1st place", award: "$100" }` |

Important: `maxVotesPerUser` is also enforced in [`supabase/schema.sql`](supabase/schema.sql). If you are new to this, leave it at `3`. If you change it, search that SQL file for `>= 3` and update the database rule before launching.

## Quick Local Preview

Use this if you only want to see the website on your computer.

1. Install [Node.js](https://nodejs.org/) if it is not already installed.
2. Open this folder in a terminal.
3. Install the project:

```bash
npm install
```

4. Start the site:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

If you do not set up Supabase yet, the app uses local demo mode in development. Demo mode has sample artwork and fake access codes, but it does not permanently save uploads or votes.

## Project Structure

- [`config/event.ts`](config/event.ts): yearly event settings and placeholders
- [`app`](app): website pages and route handlers
- [`components`](components): shared form, shell, and UI components
- [`lib`](lib): database, auth, validation, voting, and server actions
- [`supabase`](supabase): database schema, security rules, and starter seed data
- [`public/demo`](public/demo): sample images used by demo mode

## Environment File

Copy the example environment file:

```bash
cp .env.example .env.local
```

For demo-only local work, you can leave the Supabase values as placeholders and run `npm run dev`.

For a real event, fill in `.env.local`:

```bash
LOCAL_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-anon-or-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_STORAGE_BUCKET=submissions
SENDGRID_API_KEY=optional-sendgrid-key
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` come from Supabase.
- `NEXT_PUBLIC_SITE_URL` should be `http://localhost:3000` locally and your Vercel URL in production.
- `SUPABASE_STORAGE_BUCKET` should usually stay `submissions`.
- `SENDGRID_API_KEY` is optional unless the app is extended to send email.

## Supabase Setup

Supabase stores accounts, submissions, votes, access codes, and uploaded images.

1. Go to [supabase.com](https://supabase.com/) and create a project.
2. In Supabase, open **Project Settings** > **API**.
3. Copy the project URL into `NEXT_PUBLIC_SUPABASE_URL`.
4. Copy the anon/publishable key into `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
5. Copy the service role key into `SUPABASE_SERVICE_ROLE_KEY`. Keep this private.
6. Open **Authentication** > **Providers** and enable Email.
7. Open **Authentication** > **URL Configuration** and add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-vercel-domain.vercel.app/auth/callback`
8. Open **Storage** and create a private bucket named `submissions`.
9. Open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it.
10. Optional: paste [`supabase/seed.sql`](supabase/seed.sql), change `organizer@example.com` to your organizer email, and run it.

## Admin Access

Admin access is controlled by the `admins` table in Supabase.

To make someone an admin:

1. Ask them to create an account on the website first.
2. In Supabase, open **SQL Editor**.
3. Run this, replacing the email:

```sql
insert into public.admins (email, active)
values ('organizer@example.com', true)
on conflict (email) do update set active = true;
```

Admins can open `/admin` to approve, return to pending, or remove submissions.

## Judge Codes

Judges need an account and a judge code.

Create judge codes in Supabase SQL Editor:

```sql
insert into public.judge_access_codes (code, judge_name, active)
values
  ('JUDGE-A', 'Judge A', true),
  ('JUDGE-B', 'Judge B', true)
on conflict (code) do update set active = true;
```

Give each judge a code. They sign in, open `/judge/access`, enter the code, and then vote in `/judge`.

## Gallery Codes

After a student submits, the submit page creates a packet of gallery codes:

- reserved student codes are for the student who entered
- fundraiser codes can be printed, shared, or sold
- each code works once and then stays linked to that viewer account

The number of codes and price text come from [`config/event.ts`](config/event.ts).

## Deploying On Vercel

1. Push the project to GitHub.
2. Create a new project on [vercel.com](https://vercel.com/).
3. Connect the GitHub repository.
4. In Vercel, open **Settings** > **Environment Variables**.
5. Add the same real Supabase values from `.env.local`.
6. Set `NEXT_PUBLIC_SITE_URL` to your Vercel site URL.
7. Deploy.
8. Add the Vercel callback URL in Supabase Authentication settings:

```text
https://your-vercel-domain.vercel.app/auth/callback
```

## Common Yearly Checklist

Before the next show:

1. Update [`config/event.ts`](config/event.ts).
2. Replace demo art in [`public/demo`](public/demo) if you want different preview images.
3. Update admin emails in Supabase.
4. Create new judge codes in Supabase.
5. Confirm the storage bucket is private and named `submissions`.
6. Run `npm run typecheck`.
7. Run `npm run dev` and click through submit, gallery access, judge access, and admin pages.
8. Deploy to Vercel.

## Useful Commands

```bash
npm install
npm run dev
npm run typecheck
LOCAL_DEMO_MODE=true npm run build
```

## Product Decisions

- Email/password sign-in is required before protected flows.
- Gallery and judge access are separate code-based grants tied to authenticated users.
- Uploaded artwork is stored in a private Supabase bucket and displayed through signed URLs.
- Admin dashboard access is enforced server-side against the `admins` allowlist table.
- Demo mode is for previewing the interface only. It does not save real submissions.
