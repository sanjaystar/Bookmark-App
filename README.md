# Smart Bookmark Manager

Bookmark app with Google sign-in and real-time sync. Built with Next.js, Supabase, and Tailwind CSS.

## Prerequisites

- Node.js 18+
- [Supabase](https://supabase.com) account
- Google OAuth app (Google Cloud Console)

## Setup

**1. Install**

```bash
git clone <repository-url>
cd Bookmark-App
npm install
```

**2. Supabase**

- Create a project at supabase.com
- In SQL Editor, run:

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Realtime: required so other tabs get insert/update/delete events
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
ALTER TABLE bookmarks REPLICA IDENTITY FULL;  -- needed so DELETE events work with user_id filter
```

- Turn on Google under **Authentication → Providers**
- Add your Google OAuth client ID/secret and set redirect URLs in both Google Console and Supabase

**3. Environment**

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**4. Run**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Problems & Solutions

- **Other tab doesn’t update when adding a bookmark** — Ensure the table is in the Realtime publication: `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;` (Database → Replication in Supabase). Both tabs must be same origin and logged in.
- **Other tab doesn’t update when deleting a bookmark** — DELETE events need the full row for the `user_id` filter. Run in Supabase SQL Editor: `ALTER TABLE bookmarks REPLICA IDENTITY FULL;`
- **Realtime showed all users’ bookmarks** — Subscribed to changes for the current user only using Supabase Realtime `filter: \`user_id=eq.${user.id}\``.
- **OAuth redirect broke in production** — Stopped hardcoding redirect; use `window.location.origin + '/dashboard'` so it works on any host.
- **No way to delete bookmarks** — Added delete with RLS and a confirmation dialog.
- **Empty or invalid URLs accepted** — Client-side validation: require title and validate URL with `new URL(url)`.
- **No loading or error feedback** — Added spinners, error messages, disabled buttons while submitting, empty state, and delete confirmation.
- **Weak types** — Introduced TypeScript interfaces for `User` and `Bookmark` instead of `any`.

## Deploy (Vercel)

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel, then add your Vercel URL to Supabase Auth redirect URLs.
