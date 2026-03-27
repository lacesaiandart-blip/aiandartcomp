# High School AI Art Competition

Minimal Next.js 14 MVP for a UCLA student-run high school AI art competition. The app uses Supabase for email/password auth, Postgres data, and image storage.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components
- Supabase Auth, Database, Storage
- Vercel-ready deployment shape

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_STORAGE_BUCKET=submissions
```

For local UI preview without Supabase, you have two options:

- `npm run dev` with no Supabase env vars: the app automatically falls back to local demo mode in development.
- Set `LOCAL_DEMO_MODE=true` explicitly if you also want demo mode during `npm run build`.

Demo mode uses:

- a built-in demo user
- sample gallery and admin data
- cookie-backed gallery access, judge access, submission count, and vote state
- no persistent uploads or database writes

## Supabase setup

1. Create a Supabase project.
2. In Auth, make sure the Email provider is enabled.
3. Turn on email/password sign-in.
4. If you want email confirmation for new accounts, keep confirmation enabled and use the callback URLs below.
5. Add these redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-vercel-domain.vercel.app/auth/callback`
6. Create a private storage bucket named `submissions`.
7. Run [`supabase/schema.sql`](/Users/ktejwani/UCLA%20Files/Playground%20Code/LACES%20AI%20Art%20Comp/supabase/schema.sql).
8. Optionally run [`supabase/seed.sql`](/Users/ktejwani/UCLA%20Files/Playground%20Code/LACES%20AI%20Art%20Comp/supabase/seed.sql).

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

If you want to verify a production build without Supabase configured:

```bash
LOCAL_DEMO_MODE=true npm run build
```

## App structure

- [`app`](/Users/ktejwani/UCLA%20Files/Playground%20Code/LACES%20AI%20Art%20Comp/app): App Router pages, route handlers, loading and not-found UI
- [`components`](/Users/ktejwani/UCLA%20Files/Playground%20Code/LACES%20AI%20Art%20Comp/components): shared UI and shell components
- [`lib`](/Users/ktejwani/UCLA%20Files/Playground%20Code/LACES%20AI%20Art%20Comp/lib): Supabase clients, auth/access helpers, queries, server actions
- [`middleware.ts`](/Users/ktejwani/UCLA%20Files/Playground%20Code/LACES%20AI%20Art%20Comp/middleware.ts): auth gate for protected routes
- [`supabase`](/Users/ktejwani/UCLA%20Files/Playground%20Code/LACES%20AI%20Art%20Comp/supabase): SQL schema and seed data

## Product decisions

- Email/password sign-in is required before protected flows.
- Gallery and judge access are separate code-based grants tied to authenticated users.
- Gallery viewers and judges can each cast up to 3 votes total, with one vote maximum per artwork.
- Admin dashboard access is enforced server-side against the `admins` allowlist table.
- Uploaded artwork is stored in a private bucket and displayed through signed URLs.

## Notes

- This project keeps the architecture intentionally small for a student org MVP.
- Some queries rely on the Supabase service role on the server for signed storage URLs.
- RLS is included, but admin moderation and image signing still happen in trusted server code.
