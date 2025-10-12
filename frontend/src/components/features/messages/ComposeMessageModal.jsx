import { useEffect, useState } from 'react';
import Modal from '../../shared/Modal';
import Input from '../../shared/Input';
import Button from '../../shared/Button';
import { userService } from '../../../services/users';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { useNotification } from '../../../contexts/NotificationContext';

export default function ComposeMessageModal({ isOpen, onClose, onSend }) {
  const { showError } = useNotification();
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ recipientId: '', subject: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);
    userService
      .list({ limit: 100 })
      .then((response) => {
        if (!isMounted) return;
        setRecipients(response.users || []);
      })
      .catch((error) => {
        console.error('Failed to load recipients', error);
        showError('Unable to load community members.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [isOpen, showError]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSend({
        recipientId: Number(formData.recipientId),
        subject: formData.subject,
        content: formData.content
      });
      setFormData({ recipientId: '', subject: '', content: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compose Message" size="lg">
      {loading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner label="Loading members" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
            <select
              name="recipientId"
              value={formData.recipientId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select member</option>
              {recipients.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} • {user.email}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Community gathering update"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your message with warmth and clarity."
              required
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Message'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={submitting}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
