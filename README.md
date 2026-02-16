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

ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
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

Open [http://localhost:3000]

## Deploy (Vercel)

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel, then add your Vercel URL to Supabase Auth redirect URLs.
