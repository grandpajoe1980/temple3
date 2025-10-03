import { format } from 'date-fns';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  TagIcon 
} from '@heroicons/react/24/outline';
import Modal from '../../shared/Modal';
import Button from '../../shared/Button';

export default function EventDetailsModal({ isOpen, onClose, event }) {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Service':
        return 'bg-blue-100 text-blue-800';
      case 'Meeting':
        return 'bg-green-100 text-green-800';
      case 'Social':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      size="lg"
    >
      <div className="space-y-6">
        {/* Event Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <span>{event.time}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-3 text-gray-700">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <span>{event.location}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <TagIcon className="h-5 w-5 text-gray-400" />
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{event.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="primary" className="flex-1">
            RSVP
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
