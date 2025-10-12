import { useState } from 'react';
import Modal from '../../shared/Modal';
import Input from '../../shared/Input';
import Button from '../../shared/Button';

const CATEGORY_OPTIONS = ['Prayers', 'Teachings', 'Scriptures', 'Meditations', 'Reflections'];

export default function CreateTextModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: CATEGORY_OPTIONS[0],
    content: '',
    tags: '',
    isPublic: true
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        title: formData.title,
        author: formData.author,
        category: formData.category,
        content: formData.content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isPublic: formData.isPublic
      });
      setFormData({
        title: '',
        author: '',
        category: CATEGORY_OPTIONS[0],
        content: '',
        tags: '',
        isPublic: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Religious Text" size="xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="The Path of Light"
          required
        />
        <Input
          label="Author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Rev. Aiyana Hart"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORY_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write or paste the sacred text here..."
            required
          />
        </div>
        <Input
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Compassion, Dawn, Service"
          helperText="Separate tags with commas to help with discovery"
        />
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Visible to all tenant members</span>
        </label>
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Text'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={submitting}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
