'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { BookmarkSquareIcon } from '@heroicons/react/24/outline'
import ConfirmDialog from '@/app/components/ConfirmDialog'
import Header from '@/app/components/Header'
import AddBookmarkForm from '@/app/components/AddBookmarkForm'
import BookmarkCard, { type BookmarkItem } from '@/app/components/BookmarkCard'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [titleError, setTitleError] = useState('')
  const [urlError, setUrlError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)

  // Fetch user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login')
        return
      }
      setUser(data.user)
      setLoading(false)
      if (typeof window !== 'undefined' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }
    getUser()
  }, [router])

  useEffect(() => {
    if (user) fetchBookmarks()
  }, [user])

  // Realtime subscription – unchanged
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('bookmarks-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${user.id}` },
        () => fetchBookmarks()
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user])

  const fetchBookmarks = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setBookmarks(data || [])
  }

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setTitleError('')
    setUrlError('')
    setSubmitError('')
    let hasError = false
    if (!title.trim()) {
      setTitleError('Title is required')
      hasError = true
    }
    if (!url.trim()) {
      setUrlError('URL is required')
      hasError = true
    } else {
      try {
        new URL(url)
      } catch {
        setUrlError('Please enter a valid URL (e.g., https://example.com)')
        hasError = true
      }
    }
    if (hasError) return
    setSubmitting(true)
    const { error: insertError } = await supabase.from('bookmarks').insert({
      title: title.trim(),
      url: url.trim(),
      user_id: user.id
    })
    setSubmitting(false)
    if (insertError) {
      setSubmitError('Failed to add bookmark. Please try again.')
      return
    }
    setTitle('')
    setUrl('')
    await fetchBookmarks()
  }

  const openDeleteDialog = (id: string, bookmarkTitle: string) => setDeleteTarget({ id, title: bookmarkTitle })
  const closeDeleteDialog = () => setDeleteTarget(null)

  const confirmDeleteBookmark = async () => {
    const id = deleteTarget?.id
    if (!id || !user) return
    closeDeleteDialog()
    const { error } = await supabase.from('bookmarks').delete().eq('id', id).eq('user_id', user.id)
    if (error) {
      alert('Failed to delete bookmark')
    } else {
      setBookmarks((prev) => prev.filter((b) => b.id !== id))
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userEmail={user?.email} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Add Bookmark form card */}
          <div className="lg:order-1">
            <AddBookmarkForm
              title={title}
              url={url}
              titleError={titleError}
              urlError={urlError}
              submitError={submitError}
              submitting={submitting}
              onTitleChange={(v) => {
                setTitle(v)
                if (titleError) setTitleError('')
              }}
              onUrlChange={(v) => {
                setUrl(v)
                if (urlError) setUrlError('')
              }}
              onSubmit={addBookmark}
            />
          </div>

          {/* Right column: Bookmark list (soft section, no heavy card) */}
          <div className="lg:order-2">
            <section className="rounded-xl bg-gray-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Bookmarks ({bookmarks.length})
              </h2>
              {bookmarks.length === 0 ? (
                <div className="py-12 text-center">
                  <BookmarkSquareIcon className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-sm font-medium text-gray-900">No bookmarks yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Add your first bookmark in the form.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark.id}
                      bookmark={bookmark}
                      onDelete={() => openDeleteDialog(bookmark.id, bookmark.title)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        message={deleteTarget ? `Are you sure you want to delete ${deleteTarget.title} bookmark?` : ''}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDeleteBookmark}
        onCancel={closeDeleteDialog}
      />
    </div>
  )
}
