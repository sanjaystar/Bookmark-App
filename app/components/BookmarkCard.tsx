'use client'

import { LinkIcon, TrashIcon } from '@heroicons/react/24/outline'

export interface BookmarkItem {
  id: string
  title: string
  url: string
  user_id: string
  created_at: string
}

interface BookmarkCardProps {
  bookmark: BookmarkItem
  onDelete: () => void
}

export default function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const utc = bookmark.created_at.replace(/[+-]\d{2}(:\d{2})?$/, '').replace(/Z$/, '') + 'Z'
  const formattedDate = new Date(utc).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  return (
    <div className="rounded-xl bg-white p-4 shadow-md transition-all hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
            {bookmark.title}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
          >
            <LinkIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span className="break-all">{bookmark.url}</span>
          </a>
          <p className="text-xs text-gray-500 mt-2">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
            title="Delete bookmark"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
