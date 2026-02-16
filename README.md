# Smart Bookmark Manager

A real-time bookmark management application built with Next.js, Supabase, and Tailwind CSS. Users can sign in with Google OAuth, save bookmarks, and see them update in real-time across multiple browser tabs.

## 🚀 Live Demo

[Live URL will be added after Vercel deployment]

## ✨ Features

- **Google OAuth Authentication**: Secure sign-in using Google accounts only
- **Real-time Updates**: Bookmarks automatically sync across all open tabs without page refresh
- **Private Bookmarks**: Each user can only see and manage their own bookmarks
- **CRUD Operations**: Add and delete bookmarks with instant feedback
- **Responsive Design**: Clean, modern UI that works on all devices
- **Form Validation**: Input validation with helpful error messages
- **Professional UI**: Built with Tailwind CSS for a polished look

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Supabase (Auth, Database, Realtime)
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account
- A Google Cloud Console project with OAuth configured

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bookmarkapp
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run the following:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies so users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks" 
  ON bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" 
  ON bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
  ON bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

3. Go to Authentication > Providers > Google and enable Google OAuth
4. Add your Google OAuth credentials from Google Cloud Console
5. Add authorized redirect URLs in both Google Console and Supabase

### 3. Configure Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Project Structure

```
bookmarkapp/
├── app/
│   ├── dashboard/
│   │   └── page.tsx      # Main dashboard with bookmarks
│   ├── login/
│   │   └── page.tsx      # Login page with Google OAuth
│   └── layout.tsx         # Root layout
├── lib/
│   └── supabase.ts        # Supabase client configuration
├── .env.local             # Environment variables (not in git)
└── README.md
```

## 🚀 Deployment on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Update the redirect URL in Supabase Auth settings to include your Vercel domain
5. Deploy!

## 🐛 Problems Encountered & Solutions

### Problem 1: Realtime Not Filtering by User
**Issue**: Initial implementation listened to all bookmark changes for all users, causing unnecessary refetches and potential privacy concerns.

**Solution**: Added a `filter` parameter to the Supabase Realtime subscription to only listen to changes for the current user:
```typescript
filter: `user_id=eq.${user.id}`
```

### Problem 2: Hardcoded Redirect URL
**Issue**: The OAuth redirect URL was hardcoded to `http://localhost:3000/dashboard`, which wouldn't work in production.

**Solution**: Made the redirect URL dynamic using `window.location.origin`:
```typescript
const redirectTo = `${window.location.origin}/dashboard`
```

### Problem 3: Missing Delete Functionality
**Issue**: Users couldn't delete bookmarks, which was a requirement.

**Solution**: Implemented a `deleteBookmark` function with proper RLS checks and confirmation dialog.

### Problem 4: No Form Validation
**Issue**: Users could submit empty or invalid URLs, causing errors.

**Solution**: Added client-side validation for title presence and URL format using JavaScript's `URL` constructor.

### Problem 5: Poor User Experience
**Issue**: No loading states, error messages, or visual feedback.

**Solution**: Added:
- Loading spinners during async operations
- Error message displays
- Disabled states on buttons during submission
- Empty state when no bookmarks exist
- Confirmation dialogs before deletion

### Problem 6: Type Safety
**Issue**: Using `any` types everywhere reduced type safety.

**Solution**: Defined proper TypeScript interfaces for `User` and `Bookmark` types.

## 🔐 Security Features

- Row Level Security (RLS) ensures users can only access their own bookmarks
- OAuth tokens are handled securely by Supabase
- Environment variables keep sensitive data out of the codebase
- All database queries filter by user ID

## 🎨 Design Decisions

- **Minimal UI**: Clean, professional design without unnecessary complexity
- **Real-time First**: Leveraged Supabase Realtime for the best UX
- **Client-side Only**: No API routes needed thanks to Supabase client library and RLS
- **Accessibility**: Semantic HTML, proper labels, and keyboard navigation
- **Responsive**: Mobile-first approach with Tailwind's responsive utilities

## 📝 License

MIT

## 👤 Author

[Your Name]
