import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import Modal from '../../shared/Modal';
import Button from '../../shared/Button';

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setContent('');
    setAttachment(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        content,
        attachments: attachment ? [attachment] : []
      });
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment({
        name: file.name,
        type: file.type,
        data: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Share a Community Update"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50/80"
            placeholder="Tell your tenant what’s happening…"
            required
          />
        </div>

        {attachment && (
          <div className="relative rounded-2xl overflow-hidden border border-gray-200">
            <img src={attachment.data} alt={attachment.name} className="w-full object-cover" />
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-medium text-gray-700 hover:bg-white"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
            <PhotoIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">Add photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
            {submitting ? 'Posting…' : 'Publish to Feed'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="flex-1"
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
