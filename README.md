# High School AI Art Competition

This is a Next.js website for running a high school AI art competition. It supports student accounts, artwork submissions, private gallery access codes, judge access codes, voting, and an organizer admin dashboard.

This guide assumes you are starting from zero: you have the GitHub repository, but you have not installed the site, created Supabase, or deployed to Vercel yet.

## What You Need

Create or get access to these accounts:

- GitHub, to store the website code
- Supabase, to store accounts, submissions, votes, access codes, and images
- Vercel, to host the live website

Install these on your computer:

- [Node.js](https://nodejs.org/) 20 LTS or newer
- Git
- A code editor, such as VS Code

Check that Node and Git are installed:

```bash
node --version
git --version
```

## 1. Clone The Website

Replace `REPOSITORY_URL` with the GitHub URL for this project.

```bash
git clone REPOSITORY_URL
cd "LACES AI Art Comp"
npm install
```

If the folder name is different after cloning, `cd` into that folder instead.

## 2. Preview The Site With Demo Data

Demo mode lets you see the site before Supabase exists. It uses sample artwork and browser cookies. It does not save real submissions.

```bash
npm run dev
```

Open this in your browser:

```text
http://localhost:3000
```

Stop the local server with `Control-C` in the terminal.

## 3. Update The Event Settings

Open [`config/event.ts`](config/event.ts) and replace the placeholder values for the next competition.

Most future organizers only need this file.

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

Important: `maxVotesPerUser` is also enforced in [`supabase/schema.sql`](supabase/schema.sql). If you are new to this, leave it at `3`. If you change it, search that SQL file for `>= 3` and update the database rule before launch.

## 4. Create The Local Environment File

Copy the example file:

```bash
cp .env.example .env.local
```

For demo mode, leave the placeholder values alone.

For the real site, you will fill this file after creating Supabase.

## 5. Create Supabase

Supabase is the database and file storage for the competition.

1. Go to [supabase.com](https://supabase.com/).
2. Create a new project.
3. Save the database password somewhere private.
4. Wait for the project to finish provisioning.

## 6. Get Supabase Values

In Supabase, open **Project Settings** > **API**.

Copy these values:

| Supabase value | Put it in this env variable | Secret? |
| --- | --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | No |
| Anon public key or publishable key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No |
| Same anon public key or publishable key | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | No |
| Service role key | `SUPABASE_SERVICE_ROLE_KEY` | Yes, keep private |

The service role key is powerful. Do not paste it into chat, commit it to GitHub, or share it with students.

## 7. Fill In `.env.local`

Open `.env.local` and replace the placeholder values:

```bash
LOCAL_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-anon-or-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_STORAGE_BUCKET=submissions
```

Use the same value for `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.

Never commit `.env.local`. It is ignored by Git.

## 8. Set Up The Supabase Database

In Supabase:

1. Open **SQL Editor**.
2. Open [`supabase/schema.sql`](supabase/schema.sql) in this project.
3. Copy the whole file.
4. Paste it into Supabase SQL Editor.
5. Click **Run**.

Then create the private upload bucket:

1. Open **Storage**.
2. Click **New bucket**.
3. Name it `submissions`.
4. Keep it private.
5. Click **Create bucket**.

Then enable email sign-in:

1. Open **Authentication** > **Providers**.
2. Enable **Email**.

Then add local auth redirects:

1. Open **Authentication** > **URL Configuration**.
2. Add this redirect URL:

```text
http://localhost:3000/auth/callback
```

## 9. Run The Real Site Locally

Start the site:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Create a test account on the site. This confirms Supabase Auth is connected.

## 10. Make Yourself An Admin

After your test account exists, open **Supabase** > **SQL Editor** and run this. Replace the email with your account email.

```sql
insert into public.admins (email, active)
values ('organizer@example.com', true)
on conflict (email) do update set active = true;
```

Now open:

```text
http://localhost:3000/admin
```

## 11. Create Judge Codes

Judges need accounts and judge codes.

Open **Supabase** > **SQL Editor** and run this. Change the code names if you want.

```sql
insert into public.judge_access_codes (code, judge_name, active)
values
  ('JUDGE-A', 'Judge A', true),
  ('JUDGE-B', 'Judge B', true)
on conflict (code) do update set active = true;
```

Give each judge one code. Judges sign in, open `/judge/access`, enter the code, and then vote in `/judge`.

## 12. Test The Main Flows

Run these checks before deploying:

```bash
npm run typecheck
npm run lint
npm run build
```

Then run the site locally:

```bash
npm run dev
```

Click through:

- Create account
- Submit artwork
- Admin approve or reject submission
- Gallery access
- Judge access
- Voting

## 13. Push Your Changes To GitHub

Use these commands after editing `config/event.ts` and any other setup files:

```bash
git status
git add config/event.ts README.md
git commit -m "chore: configure event"
git push
```

If you changed other files, add them too.

## 14. Create The Vercel Site

1. Go to [vercel.com](https://vercel.com/).
2. Click **Add New** > **Project**.
3. Import the GitHub repository.
4. Keep the framework as **Next.js**.
5. Before deploying, open **Environment Variables**.

Add these Vercel environment variables:

| Name | Value |
| --- | --- |
| `LOCAL_DEMO_MODE` | `false` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/publishable key |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Same Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel site URL, such as `https://your-site.vercel.app` |
| `SUPABASE_STORAGE_BUCKET` | `submissions` |

Set each variable for **Production**, **Preview**, and **Development** unless your team has a reason to separate them.

Click **Deploy**.

If you do not know the Vercel URL until after the first deploy, set `NEXT_PUBLIC_SITE_URL` to the temporary Vercel URL after deploy and redeploy once.

## 15. Add The Vercel Auth Redirect In Supabase

After Vercel gives you a live URL, go back to Supabase:

1. Open **Authentication** > **URL Configuration**.
2. Add this redirect URL, replacing the domain:

```text
https://your-site.vercel.app/auth/callback
```

If you use a custom domain, also add:

```text
https://your-custom-domain.org/auth/callback
```

Save, then redeploy in Vercel if you changed `NEXT_PUBLIC_SITE_URL`.

## 16. Final Launch Checklist

Before sharing the site:

1. Open the live Vercel URL.
2. Create a real organizer account.
3. Confirm that account is active in the `admins` table.
4. Submit one test artwork.
5. Approve it in `/admin`.
6. Confirm the image appears in the gallery.
7. Confirm a judge code works.
8. Confirm voting works.
9. Delete or reject test submissions before launch if needed.

## Project Structure

- [`config/event.ts`](config/event.ts): yearly event settings and placeholders
- [`app`](app): website pages and route handlers
- [`components`](components): shared form, shell, and UI components
- [`lib`](lib): database, auth, validation, voting, and server actions
- [`supabase`](supabase): database schema, security rules, and starter seed data
- [`public/demo`](public/demo): sample images used by demo mode

## Environment Variables

| Variable | Used where | What it does | Secret? |
| --- | --- | --- | --- |
| `LOCAL_DEMO_MODE` | Local and Vercel | `true` uses fake demo data; `false` uses Supabase | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Local and Vercel | Supabase project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Local and Vercel | Public browser-safe Supabase key | No |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Local and Vercel | Same public Supabase key, kept for compatibility | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Local and Vercel | Private admin key for server actions and storage | Yes |
| `NEXT_PUBLIC_SITE_URL` | Local and Vercel | Base URL for auth redirects and links | No |
| `SUPABASE_STORAGE_BUCKET` | Local and Vercel | Upload bucket name | No |

## Common Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Common Problems

If sign-in redirects fail, check Supabase **Authentication** > **URL Configuration** and confirm both local and Vercel callback URLs are listed.

If uploads fail, confirm the storage bucket is private and named `submissions`, and confirm `SUPABASE_SERVICE_ROLE_KEY` is set in both `.env.local` and Vercel.

If the live site is still in demo mode, confirm `LOCAL_DEMO_MODE=false` in Vercel and redeploy.

If admin access fails, confirm the organizer has created an account first, then add that exact email to the `admins` table.

## Yearly Reset Checklist

Before the next show:

1. Update [`config/event.ts`](config/event.ts).
2. Replace demo art in [`public/demo`](public/demo) if you want different preview images.
3. Create or confirm organizer admin emails in Supabase.
4. Create new judge codes in Supabase.
5. Confirm the storage bucket is private and named `submissions`.
6. Run `npm run typecheck`.
7. Run `npm run lint`.
8. Run `npm run build`.
9. Run `npm run dev` and click through submit, gallery access, judge access, and admin pages.
10. Deploy to Vercel.

## Product Decisions

- Email/password sign-in is required before protected flows.
- Gallery and judge access are separate code-based grants tied to authenticated users.
- Uploaded artwork is stored in a private Supabase bucket and displayed through signed URLs.
- Admin dashboard access is enforced server-side against the `admins` allowlist table.
- Demo mode is for previewing the interface only. It does not save real submissions.
