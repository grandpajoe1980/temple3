import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import Modal from '../../shared/Modal';
import Input from '../../shared/Input';
import Button from '../../shared/Button';

const EVENT_TYPES = [
  { value: 'service', label: 'Service' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'social', label: 'Social Gathering' },
  { value: 'meditation', label: 'Meditation / Mindfulness' },
  { value: 'other', label: 'Other' }
];

export default function CreateEventModal({ isOpen, onClose, onSubmit, defaultDate }) {
  const defaultStart = useMemo(() => {
    const base = defaultDate ? new Date(defaultDate) : new Date();
    base.setHours(10, 0, 0, 0);
    return base;
  }, [defaultDate]);

  const defaultEnd = useMemo(() => {
    const end = new Date(defaultStart);
    end.setHours(end.getHours() + 1);
    return end;
  }, [defaultStart]);

  const [formData, setFormData] = useState({
    title: '',
    startTime: defaultStart,
    endTime: defaultEnd,
    eventType: 'service',
    location: '',
    description: '',
    isRecurring: false,
    recurrenceRule: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      startTime: defaultStart,
      endTime: defaultEnd
    }));
  }, [defaultStart, defaultEnd]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        location: formData.location,
        eventType: formData.eventType,
        isRecurring: formData.isRecurring,
        recurrenceRule: formData.isRecurring ? formData.recurrenceRule : undefined
      });
      setFormData({
        title: '',
        startTime: defaultStart,
        endTime: defaultEnd,
        eventType: 'service',
        location: '',
        description: '',
        isRecurring: false,
        recurrenceRule: ''
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Event"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Event Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Sunday Morning Gathering"
          required
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={format(formData.startTime, "yyyy-MM-dd'T'HH:mm")}
              onChange={(event) => {
                const value = event.target.value;
                setFormData(prev => ({
                  ...prev,
                  startTime: value ? new Date(value) : prev.startTime
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={format(formData.endTime, "yyyy-MM-dd'T'HH:mm")}
              onChange={(event) => {
                const value = event.target.value;
                setFormData(prev => ({
                  ...prev,
                  endTime: value ? new Date(value) : prev.endTime
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {EVENT_TYPES.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Location"
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Temple Hall A or Zoom"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share what community members can expect from this gathering."
          />
        </div>

        <div className="rounded-xl border border-gray-200 p-4 space-y-3 bg-gray-50/60">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Recurring event</span>
          </label>
          {formData.isRecurring && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recurrence Rule
              </label>
              <input
                type="text"
                name="recurrenceRule"
                value={formData.recurrenceRule}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Every Sunday"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Event'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={submitting}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
