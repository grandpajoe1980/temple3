import { useState } from 'react';
import { format } from 'date-fns';
import Modal from '../../shared/Modal';
import Input from '../../shared/Input';
import Button from '../../shared/Button';

export default function CreateEventModal({ isOpen, onClose, onSubmit, selectedDate }) {
  const [formData, setFormData] = useState({
    title: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    time: '',
    description: '',
    category: 'Service',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      title: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: '',
      description: '',
      category: 'Service',
      location: '',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Event"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Event Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Sunday Service"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <Input
            label="Time"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Service">Service</option>
            <option value="Meeting">Meeting</option>
            <option value="Social">Social Event</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input
          label="Location"
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Main Hall"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Event details and information..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            Create Event
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
