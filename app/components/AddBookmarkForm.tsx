'use client'

interface AddBookmarkFormProps {
  title: string
  url: string
  titleError: string
  urlError: string
  submitError: string
  submitting: boolean
  onTitleChange: (value: string) => void
  onUrlChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function AddBookmarkForm({
  title,
  url,
  titleError,
  urlError,
  submitError,
  submitting,
  onTitleChange,
  onUrlChange,
  onSubmit
}: AddBookmarkFormProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        Add New Bookmark
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="add-title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="add-title"
            type="text"
            placeholder="e.g., My Favorite Website"
            className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow bg-white text-gray-900 placeholder:text-gray-400 ${titleError ? 'border-red-500' : 'border-gray-200'}`}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={submitting}
          />
          {titleError && <p className="text-red-600 text-sm mt-1">{titleError}</p>}
        </div>

        <div>
          <label htmlFor="add-url" className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            id="add-url"
            type="text"
            placeholder="https://example.com"
            className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow bg-white text-gray-900 placeholder:text-gray-400 ${urlError ? 'border-red-500' : 'border-gray-200'}`}
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={submitting}
          />
          {urlError && <p className="text-red-600 text-sm mt-1">{urlError}</p>}
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? 'Adding...' : 'Add Bookmark'}
        </button>
      </form>
    </div>
  )
}
