import { useState } from 'react';
import {
  XMarkIcon,
  BookmarkIcon,
  MinusIcon,
  PlusIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import Button from '../../shared/Button';

export default function TextReader({ text, onClose, onBookmark }) {
  const [fontSize, setFontSize] = useState(18);

  const increaseFontSize = () => {
    if (fontSize < 26) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) setFontSize(fontSize - 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"
                aria-label="Return to library"
              >
                <ArrowUturnLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{text.title}</h1>
                <p className="text-sm text-slate-500">by {text.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5">
                <button
                  onClick={decreaseFontSize}
                  className="p-1.5 hover:bg-white rounded-full"
                  disabled={fontSize <= 14}
                  aria-label="Decrease font size"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-slate-600">{fontSize}px</span>
                <button
                  onClick={increaseFontSize}
                  className="p-1.5 hover:bg-white rounded-full"
                  disabled={fontSize >= 26}
                  aria-label="Increase font size"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => onBookmark(text.id)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"
                aria-label={text.bookmarked ? 'Remove bookmark' : 'Bookmark text'}
              >
                {text.bookmarked ? (
                  <BookmarkIconSolid className="h-6 w-6 text-amber-500" />
                ) : (
                  <BookmarkIcon className="h-6 w-6 text-slate-500" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"
                aria-label="Close reader"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-xs font-semibold">
                {text.category}
              </span>
              <span>{format(new Date(text.createdAt), 'MMMM d, yyyy')}</span>
              {text.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {text.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <article
              className="prose prose-lg max-w-none text-slate-800 leading-relaxed"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              {text.content.split('\n').map((paragraph, index) => (
                <p key={`paragraph-${index}`} className="mb-6">
                  {paragraph.trim()}
                </p>
              ))}
            </article>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
              <Button variant="primary" className="flex-1">
                Share via Email
              </Button>
              <Button variant="outline" className="flex-1">
                Print PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
