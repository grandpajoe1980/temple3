import { useState } from 'react';
import { 
  XMarkIcon,
  BookmarkIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import Button from '../../shared/Button';

export default function TextReader({ text, onClose, onBookmark }) {
  const [fontSize, setFontSize] = useState(18);

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) setFontSize(fontSize - 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reader Header */}
        <div className="bg-white rounded-t-lg shadow p-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{text.title}</h1>
              <p className="text-sm text-gray-600">by {text.author}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Font Size Controls */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={decreaseFontSize}
                className="p-2 hover:bg-white rounded transition-colors"
                disabled={fontSize <= 14}
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium px-2">{fontSize}px</span>
              <button
                onClick={increaseFontSize}
                className="p-2 hover:bg-white rounded transition-colors"
                disabled={fontSize >= 24}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={() => onBookmark(text.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {text.bookmarked ? (
                <BookmarkIconSolid className="h-6 w-6 text-yellow-500" />
              ) : (
                <BookmarkIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Reader Content */}
        <div className="bg-white rounded-b-lg shadow p-8">
          <div className="max-w-3xl mx-auto">
            {/* Metadata */}
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
              <span className={`px-3 py-1 rounded-full ${
                text.category === 'Prayers' ? 'bg-blue-100 text-blue-800' :
                text.category === 'Teachings' ? 'bg-green-100 text-green-800' :
                text.category === 'Scriptures' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {text.category}
              </span>
              <span>
                {format(new Date(text.date), 'MMMM d, yyyy')}
              </span>
            </div>

            {/* Text Content */}
            <div 
              className="prose prose-lg max-w-none leading-relaxed text-gray-800"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
            >
              {text.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Reader Actions */}
            <div className="mt-12 pt-8 border-t flex gap-4">
              <Button variant="primary" className="flex-1">
                Share
              </Button>
              <Button variant="outline" className="flex-1">
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
