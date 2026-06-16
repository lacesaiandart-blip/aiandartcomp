# High School AI Art Competition

Next.js website for running a high school AI art competition. Supports student accounts, artwork submissions, private gallery access codes, judge access codes, voting, and an organizer admin dashboard.

## File Tree

```text
.
├── app/                         Website pages and route handlers
│   ├── page.tsx                 Homepage
│   ├── submit/                  Student submission page and gallery-code API
│   ├── gallery/                 Private gallery pages
│   ├── judge/                   Judge access and voting pages
│   ├── admin/                   Organizer dashboard
│   ├── auth/callback/           Supabase sign-in callback route
│   ├── privacy/                 Privacy page
│   └── terms/                   Terms page
├── components/                  Shared React components and form controls
├── config/event.ts              Main event settings
├── lib/                         Supabase clients, auth helpers, queries, validation
├── Promotional Materials 2026/  Editable/exported promotion materials
├── public/                      Static files served by the website
│   ├── demo/                    Demo artwork used before Supabase is connected
│   └── service-worker.js        Empty service worker file to prevent browser 404 noise
├── supabase/
│   ├── schema.sql               Database schema to paste into Supabase
│   └── seed.sql                 Optional sample admin/code data for local testing
├── .env.example                 Environment variable template
├── package.json                 Scripts and npm dependencies
├── package-lock.json            Locked dependency versions
├── README.md                    Setup guide
└── next.config.mjs              Next.js configuration
```

Most yearly setup changes should happen in `config/event.ts`, `.env.local`, Vercel environment variables, and Supabase settings. Keep database setup in `supabase/schema.sql` so future setup stays copy-paste simple.

## What You Need

Accounts:

- GitHub
- Supabase
- Vercel
- SendGrid

Local tools:

- Node.js 20 LTS or newer
- Git
- Code editor, such as VS Code

Check your installs:

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

## 2. Preview The Site With Demo Data

Demo mode uses sample artwork and browser cookies. It does not save real submissions.

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Stop the local server with `Control-C`.

## 3. Update The Event Settings

Open `config/event.ts` and replace the event values.

| Setting | What it controls | Example |
| --- | --- | --- |
| `competitionName` | Browser title, footer, legal page titles | `"Lincoln High AI Art Show"` |
| `siteTitle` | Short name in the top navigation | `"AI Art Show"` |
| `heroTitleLines` | Homepage title lines | `["Lincoln High", "AI Art", "Show"]` |
| `schoolName` | Internal school/event label | `"Lincoln High School"` |
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

`maxVotesPerUser` is also enforced in `supabase/schema.sql`. If you change it, search that SQL file for `>= 3` and update the database rule before launch.

## 4. Create The Local Environment File

```bash
cp .env.example .env.local
```

For demo mode, leave the placeholder values. For the real site, fill this file after creating Supabase.

## 5. Create Supabase

1. Go to Supabase.
2. Create a new project.
3. Save the database password somewhere private.
4. Wait for the project to finish provisioning.

## 6. Get Supabase Values

In Supabase, open **Project Settings** > **API**.

| Supabase value | Env variable | Secret? |
| --- | --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | No |
| Anon public key or publishable key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No |
| Same anon public key or publishable key | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | No |
| Service role key | `SUPABASE_SERVICE_ROLE_KEY` | Yes |

Do not commit or share the service role key.

## 7. Fill In `.env.local`

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

Never commit `.env.local`.

## 8. Set Up The Supabase Database

In Supabase:

1. Open **SQL Editor**.
2. Open `supabase/schema.sql` in this project.
3. Copy the whole file.
4. Paste it into Supabase SQL Editor.
5. Click **Run**.

Mac copy command:

```bash
pbcopy < supabase/schema.sql
```

Only paste `supabase/schema.sql` unless you intentionally want sample seed data.

Create the private upload bucket:

1. Open **Storage**.
2. Click **New bucket**.
3. Name it `submissions`.
4. Keep it private.
5. Click **Create bucket**.

Enable email sign-in:

1. Open **Authentication** > **Providers**.
2. Enable **Email**.

Add local auth redirects:

1. Open **Authentication** > **URL Configuration**.
2. Add:

```text
http://localhost:3000/auth/callback
```

## 9. Set Up Production Email With SendGrid SMTP

Supabase sends account confirmation and password reset emails. Use custom SMTP before launch.

### Create SendGrid SMTP Credentials

1. Go to SendGrid.
2. Verify a sender identity or sending domain.
3. Create an API key with Mail Send permission.
4. Copy the API key immediately.

SMTP settings:

| Supabase SMTP field | Value |
| --- | --- |
| Host | `smtp.sendgrid.net` |
| Port | `587` |
| Username | `apikey` |
| Password | Your SendGrid API key |
| Sender email | A verified address, such as `no-reply@your-school-domain.org` |
| Sender name | Your competition name |

### Add SMTP In Supabase

1. Open **Authentication** > **Settings**.
2. Find **SMTP Settings** or **Custom SMTP**.
3. Enable custom SMTP.
4. Enter the SendGrid values.
5. Save.
6. Send a test email if available.

If emails do not arrive, check SendGrid activity, sender verification, and Supabase Auth logs.

SendGrid SMTP values do not go in `.env.local` or Vercel. Supabase stores them.

### Optional Supabase Email Templates

In Supabase, open **Authentication** > **Email Templates**.

Review confirmation, invite, magic link, and password reset templates. Keep them short and functional.

## 10. Run The Real Site Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Create a test account to confirm Supabase Auth is connected.

## 11. Make Yourself An Admin

After your test account exists, open **Supabase** > **SQL Editor** and run this. Replace the email.

```sql
insert into public.admins (email, active)
values ('organizer@example.com', true)
on conflict (email) do update set active = true;
```

Open:

```text
http://localhost:3000/admin
```

## 12. Create Judge Codes

Judges need accounts and judge codes.

Open **Supabase** > **SQL Editor** and run this. Change the codes and names as needed.

```sql
insert into public.judge_access_codes (code, judge_name, active)
values
  ('JUDGE-A', 'Judge A', true),
  ('JUDGE-B', 'Judge B', true)
on conflict (code) do update set active = true;
```

Give each judge one code. Judges sign in, open `/judge/access`, enter the code, and vote in `/judge`.

## 13. Test The Main Flows

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Then run locally:

```bash
npm run dev
```

Test:

- Create account
- Submit artwork
- Admin approve/reject submission
- Gallery access
- Judge access
- Voting

## 14. Push Your Changes To GitHub

```bash
git status
git add config/event.ts README.md
git commit -m "chore: configure event"
git push
```

If you changed other files, add them too.

## 15. Create The Vercel Site

1. Go to Vercel.
2. Click **Add New** > **Project**.
3. Import the GitHub repository.
4. Keep the framework as **Next.js**.
5. Open **Environment Variables** before deploying.

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

Do not add SendGrid SMTP values to Vercel.

Set each variable for **Production**, **Preview**, and **Development** unless your team wants separate environments.

Click **Deploy**.

If you do not know the Vercel URL until after the first deploy, set `NEXT_PUBLIC_SITE_URL` to the temporary Vercel URL after deploy and redeploy once.

## 16. Add The Vercel Auth Redirect In Supabase

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

## 17. Final Launch Checklist

Before sharing the site:

1. Open the live Vercel URL.
2. Create a real organizer account.
3. Confirm that account is active in the `admins` table.
4. Confirm account confirmation/sign-in email arrives through SendGrid.
5. Submit one test artwork.
6. Approve it in `/admin`.
7. Confirm the image appears in the gallery.
8. Confirm a judge code works.
9. Confirm voting works.
10. Delete or reject test submissions before launch if needed.

## Project Structure

- `config/event.ts`: yearly event settings and placeholders
- `app`: website pages and route handlers
- `components`: shared form, shell, and UI components
- `lib`: database, auth, validation, voting, and server actions
- `supabase`: database schema, security rules, and starter seed data
- `public/demo`: sample images used by demo mode

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

If sign-up or password emails do not arrive, check Supabase **Authentication** > **Settings** > **SMTP Settings**, then check SendGrid sender verification and activity logs.

If uploads fail, confirm the storage bucket is private and named `submissions`, and confirm `SUPABASE_SERVICE_ROLE_KEY` is set in both `.env.local` and Vercel.

If the live site is still in demo mode, confirm `LOCAL_DEMO_MODE=false` in Vercel and redeploy.

If admin access fails, confirm the organizer has created an account first, then add that exact email to the `admins` table.

## Yearly Reset Checklist

1. Update `config/event.ts`.
2. Replace demo art in `public/demo` if needed.
3. Create or confirm organizer admin emails in Supabase.
4. Create new judge codes in Supabase.
5. Confirm Supabase custom SMTP still uses a working SendGrid sender.
6. Confirm the storage bucket is private and named `submissions`.
7. Run `npm run typecheck`.
8. Run `npm run lint`.
9. Run `npm run build`.
10. Run `npm run dev` and test submit, gallery access, judge access, and admin pages.
11. Deploy to Vercel.

## Product Decisions

- Email/password sign-in is required before protected flows.
- Gallery and judge access are separate code-based grants tied to authenticated users.
- Uploaded artwork is stored in a private Supabase bucket and displayed through signed URLs.
- Admin dashboard access is enforced server-side against the `admins` allowlist table.
- Demo mode is for previewing the interface only. It does not save real submissions.
