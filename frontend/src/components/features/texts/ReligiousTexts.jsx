import { useState } from 'react';
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

export default function ReligiousTexts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedText, setSelectedText] = useState(null);
  const [texts, setTexts] = useState([
    {
      id: 1,
      title: 'Daily Prayer',
      category: 'Prayers',
      author: 'Traditional',
      content: 'O Divine Creator, we gather in gratitude for this day and all its blessings. Guide our hearts and minds as we seek wisdom and understanding. May we walk in love and compassion, serving others with kindness and grace. Grant us strength in times of challenge and humility in times of success. Amen.',
      bookmarked: false,
      date: '2025-10-01'
    },
    {
      id: 2,
      title: 'Meditation on Compassion',
      category: 'Teachings',
      author: 'Rev. Sarah Williams',
      content: 'True compassion begins with understanding our own suffering. When we acknowledge our pain without judgment, we open ourselves to the suffering of others. This shared experience of the human condition connects us all. Let us practice extending kindness first to ourselves, then to our loved ones, and finally to all beings. In this way, compassion becomes the foundation of our spiritual practice.',
      bookmarked: true,
      date: '2025-09-28'
    },
    {
      id: 3,
      title: 'The Path of Service',
      category: 'Scriptures',
      author: 'Ancient Text',
      content: 'To serve others is to serve the divine. When we extend our hands in service, we recognize the sacred in all beings. True service asks nothing in return, for it is its own reward. The path of service purifies the heart and illuminates the mind. Walk this path with humility and love, and you shall find peace.',
      bookmarked: false,
      date: '2025-09-15'
    }
  ]);

  const categories = ['All', 'Prayers', 'Teachings', 'Scriptures', 'Meditations'];

  const filteredTexts = texts.filter(text => {
    const matchesSearch = text.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         text.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || text.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookmark = (textId) => {
    setTexts(texts.map(text => 
      text.id === textId ? { ...text, bookmarked: !text.bookmarked } : text
    ));
  };

  const handleSelectText = (text) => {
    setSelectedText(text);
  };

  const handleCloseReader = () => {
    setSelectedText(null);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpenIcon className="h-8 w-8" />
              Religious Texts
            </h1>
            <p className="text-gray-600 mt-1">
              Access sacred texts and spiritual teachings
            </p>
          </div>
          <Button
            variant="primary"
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Text
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search texts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Texts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTexts.map(text => (
            <div
              key={text.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      text.category === 'Prayers' ? 'bg-blue-100 text-blue-800' :
                      text.category === 'Teachings' ? 'bg-green-100 text-green-800' :
                      text.category === 'Scriptures' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {text.category}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(text.id);
                    }}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    {text.bookmarked ? (
                      <BookmarkIconSolid className="h-6 w-6 text-yellow-500" />
                    ) : (
                      <BookmarkIcon className="h-6 w-6" />
                    )}
                  </button>
                </div>
                
                <h3 
                  className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600"
                  onClick={() => handleSelectText(text)}
                >
                  {text.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3">
                  by {text.author}
                </p>
                
                <p className="text-gray-700 line-clamp-3 mb-4">
                  {text.content}
                </p>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectText(text)}
                  className="w-full"
                >
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTexts.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No texts found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
