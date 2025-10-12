import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  BookmarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import Button from '../../shared/Button';
import TextReader from './TextReader';
import CreateTextModal from './CreateTextModal';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { religiousTextService } from '../../../services/religiousTexts';
import { useNotification } from '../../../contexts/NotificationContext';
import { useTenant } from '../../../contexts/TenantContext';

const mapText = (text) => {
  const tagsRaw = text.tags;
  let tags = [];
  if (Array.isArray(tagsRaw)) {
    tags = tagsRaw;
  } else if (typeof tagsRaw === 'string') {
    try {
      const parsed = JSON.parse(tagsRaw);
      tags = Array.isArray(parsed) ? parsed : [];
    } catch {
      tags = text.tags?.split?.(',')?.map(tag => tag.trim()) || [];
    }
  }

  return {
    id: text.id,
    title: text.title,
    category: text.category || 'Uncategorized',
    author: text.author || 'Unknown Author',
    content: text.content,
    createdAt: text.created_at || new Date().toISOString(),
    bookmarked: false,
    isPublic: text.is_public,
    tags
  };
};

export default function ReligiousTexts() {
  const { showError, showSuccess } = useNotification();
  const { currentTenant } = useTenant();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedText, setSelectedText] = useState(null);
  const [texts, setTexts] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadTexts = useCallback(async () => {
    if (!currentTenant) {
      setTexts([]);
      return;
    }
    setLoading(true);
    try {
      const response = await religiousTextService.list({ limit: 100 });
      const mapped = (response.texts || []).map(mapText);
      setTexts(mapped);
    } catch (error) {
      console.error('Failed to load religious texts', error);
      showError('Unable to load texts for this tenant.');
    } finally {
      setLoading(false);
    }
  }, [currentTenant, showError]);

  useEffect(() => {
    loadTexts();
  }, [loadTexts]);

  const categories = useMemo(() => {
    const unique = new Set(texts.map(text => text.category).filter(Boolean));
    return ['All', ...Array.from(unique)];
  }, [texts]);

  const filteredTexts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return texts.filter(text => {
      const matchesSearch = !normalizedSearch
        || text.title.toLowerCase().includes(normalizedSearch)
        || text.content.toLowerCase().includes(normalizedSearch)
        || text.author.toLowerCase().includes(normalizedSearch);
      const matchesCategory = selectedCategory === 'All' || text.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).map(text => ({
      ...text,
      bookmarked: bookmarkedIds.has(text.id)
    }));
  }, [texts, searchTerm, selectedCategory, bookmarkedIds]);

  const handleBookmark = (textId) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(textId)) {
        next.delete(textId);
      } else {
        next.add(textId);
      }
      return next;
    });
    setSelectedText(prev => (prev && prev.id === textId ? { ...prev, bookmarked: !prev.bookmarked } : prev));
  };

  const handleSelectText = (text) => {
    setSelectedText({ ...text, bookmarked: bookmarkedIds.has(text.id) });
  };

  const handleCloseReader = () => {
    setSelectedText(null);
  };

  const handleCreateText = async (payload) => {
    try {
      await religiousTextService.create(payload);
      showSuccess('Text added to your tenant library.');
      setShowCreateModal(false);
      await loadTexts();
    } catch (error) {
      console.error('Failed to create text', error);
      showError(error.response?.data?.error || 'Unable to save text.');
    }
  };

  if (selectedText) {
    return (
      <TextReader
        text={selectedText}
        onClose={handleCloseReader}
        onBookmark={handleBookmark}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.45),transparent_55%)]" />
          <div className="relative p-8 sm:p-10 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">
                  Tenant library
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
                  <BookOpenIcon className="h-9 w-9" />
                  Sacred Texts Archive
                </h1>
                <p className="text-white/80 text-base sm:text-lg">
                  Curate readings, prayers, and teachings just for your tenant. Members explore within a luminous, distraction-free experience.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                    className="bg-white/90 text-amber-600 hover:bg-white"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add Text
                  </Button>
                  <Button variant="ghost" className="text-white border-white/40 hover:bg-white/10">
                    Manage Collections
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
                <p className="text-white/90 font-semibold">Tenant scoped</p>
                <p className="text-white/70 mt-1">Readers see only what belongs to their community.</p>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
                <p className="text-white/90 font-semibold">Bookmark gems</p>
                <p className="text-white/70 mt-1">Save favorites for quick meditation access.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur rounded-3xl shadow-xl border border-slate-100 p-6 lg:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search texts, authors, or themes"
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-slate-400" />
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" label="Gathering sacred writings" />
            </div>
          ) : filteredTexts.length === 0 ? (
            <div className="border border-dashed border-slate-300 rounded-3xl p-12 text-center">
              <BookOpenIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800">No texts found</h3>
              <p className="text-slate-500 mt-2">Adjust your search or add a new teaching to the library.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTexts.map(text => (
                <div
                  key={text.id}
                  className="group relative bg-white rounded-3xl border border-slate-100 shadow hover:shadow-2xl transition-all duration-200 overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                        {text.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(text.id);
                        }}
                        className="text-slate-400 hover:text-amber-500 transition"
                        aria-label={text.bookmarked ? 'Remove bookmark' : 'Save to bookmarks'}
                      >
                        {text.bookmarked ? (
                          <BookmarkIconSolid className="h-6 w-6 text-amber-500" />
                        ) : (
                          <BookmarkIcon className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                    <div onClick={() => handleSelectText(text)} className="cursor-pointer">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {text.title}
                      </h3>
                      <p className="text-sm text-slate-500 mb-3">by {text.author}</p>
                      <p className="text-slate-600 line-clamp-4">
                        {text.content}
                      </p>
                    </div>
                    {text.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {text.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-xs border border-slate-200">
                            #{tag}
                          </span>
                        ))}
                        {text.tags.length > 3 && (
                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs">
                            +{text.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectText(text)}
                      className="w-full border-amber-200 text-amber-600 hover:bg-amber-50"
                    >
                      Read Text
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateTextModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateText}
      />
    </div>
  );
}
