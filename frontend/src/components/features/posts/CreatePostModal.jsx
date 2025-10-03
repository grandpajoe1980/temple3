import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import Modal from '../../shared/Modal';
import Button from '../../shared/Button';

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit({ content, image });
      setContent('');
      setImage(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Post"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="What's on your mind?"
            required
          />
        </div>

        {/* Image Preview */}
        {image && (
          <div className="relative">
            <img 
              src={image} 
              alt="Preview"
              className="w-full rounded-lg"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Image Upload Button */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <PhotoIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-700">Add Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" variant="primary" className="flex-1">
            Post
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setContent('');
              setImage(null);
              onClose();
            }} 
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
