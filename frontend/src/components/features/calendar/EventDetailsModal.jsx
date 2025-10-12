import { format } from 'date-fns';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Modal from '../../shared/Modal';
import Button from '../../shared/Button';

const TYPE_BADGES = {
  service: 'bg-sky-100 text-sky-700 border-sky-200',
  meeting: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  social: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  meditation: 'bg-amber-100 text-amber-700 border-amber-200',
  other: 'bg-slate-100 text-slate-700 border-slate-200'
};

export default function EventDetailsModal({ isOpen, onClose, event, onDelete }) {
  const badgeStyles = TYPE_BADGES[event.eventType] || TYPE_BADGES.other;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      size="lg"
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 shadow-inner">
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-slate-400" />
              <span>{format(event.startTime, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-slate-400" />
              <span>
                {format(event.startTime, 'p')} – {format(event.endTime, 'p')}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-slate-400" />
                <span>{event.location}</span>
              </div>
            )}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${badgeStyles}`}>
              <TagIcon className="h-4 w-4" />
              <span>{event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}</span>
            </div>
            {event.isRecurring && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold">
                <ArrowPathIcon className="h-4 w-4" />
                <span>{event.recurrenceRule || 'Recurring'}</span>
              </div>
            )}
          </div>
        </div>

        {event.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Event details</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
          <Button variant="primary" className="flex-1">
            RSVP
          </Button>
          {onDelete && (
            <Button
              type="button"
              variant="outline"
              onClick={onDelete}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              Delete Event
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
