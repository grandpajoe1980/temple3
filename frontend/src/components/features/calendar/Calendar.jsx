import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  isWithinInterval,
  compareAsc
} from 'date-fns';
import Button from '../../shared/Button';
import CreateEventModal from './CreateEventModal';
import EventDetailsModal from './EventDetailsModal';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { eventsService } from '../../../services/events';
import { useNotification } from '../../../contexts/NotificationContext';
import { useTenant } from '../../../contexts/TenantContext';

const EVENT_COLORS = {
  service: 'from-sky-500/90 to-sky-400/90 text-sky-50',
  meeting: 'from-emerald-500/90 to-emerald-400/90 text-emerald-50',
  social: 'from-fuchsia-500/90 to-fuchsia-400/90 text-fuchsia-50',
  meditation: 'from-amber-500/90 to-amber-400/90 text-amber-50',
  default: 'from-slate-500/90 to-slate-400/90 text-slate-50'
};

const mapEvent = (event) => ({
  id: event.id,
  title: event.title,
  description: event.description,
  startTime: new Date(event.start_time || event.startTime),
  endTime: new Date(event.end_time || event.endTime),
  location: event.location,
  eventType: (event.event_type || event.eventType || 'other').toLowerCase(),
  isRecurring: Boolean(event.is_recurring ?? event.isRecurring),
  recurrenceRule: event.recurrence_rule || event.recurrenceRule,
  createdBy: event.created_by || event.createdBy
});

export default function Calendar() {
  const { showError, showSuccess } = useNotification();
  const { currentTenant } = useTenant();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const monthBoundaries = useMemo(() => ({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  }), [currentDate]);

  const gridBoundaries = useMemo(() => ({
    start: startOfWeek(monthBoundaries.start),
    end: endOfWeek(monthBoundaries.end)
  }), [monthBoundaries]);

  const fetchEvents = useCallback(async () => {
    if (!currentTenant) {
      setEvents([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await eventsService.list({
        startDate: monthBoundaries.start.toISOString(),
        endDate: monthBoundaries.end.toISOString(),
        limit: 200
      });
      const fetchedEvents = (response.events || []).map(mapEvent);
      setEvents(fetchedEvents);
    } catch (err) {
      console.error('Failed to load events', err);
      setError('We could not load events for this tenant. Please try again.');
      showError('Unable to load calendar events.');
    } finally {
      setLoading(false);
    }
  }, [currentTenant, monthBoundaries.end, monthBoundaries.start, showError]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(event => isWithinInterval(event.startTime, {
        start: monthBoundaries.start,
        end: monthBoundaries.end
      }) && compareAsc(event.startTime, now) >= 0)
      .sort((a, b) => compareAsc(a.startTime, b.startTime))
      .slice(0, 3);
  }, [events, monthBoundaries.end, monthBoundaries.start]);

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const response = await eventsService.create(eventData);
      if (response?.event) {
        const created = mapEvent(response.event);
        setEvents(prev => [...prev, created]);
        showSuccess('Event scheduled successfully.');
        if (!isSameMonth(created.startTime, monthBoundaries.start)) {
          setCurrentDate(created.startTime);
          setSelectedDate(created.startTime);
        }
      }
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create event', err);
      showError(err.response?.data?.error || 'Unable to create event right now.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await eventsService.remove(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
      showSuccess('Event removed from the calendar.');
    } catch (err) {
      console.error('Failed to delete event', err);
      showError(err.response?.data?.error || 'Unable to delete event.');
    } finally {
      setShowDetailsModal(false);
      setSelectedEvent(null);
    }
  };

  const getEventsForDate = (date) => events.filter(event => isSameDay(event.startTime, date));

  const renderDays = () => {
    const dateFormat = 'EEEEEE';
    let day = gridBoundaries.start;
    const days = [];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`day-${i}`} className="text-center text-sm font-semibold text-slate-500 py-2">
          {format(day, dateFormat)}
        </div>
      );
      day = addDays(day, 1);
    }

    return <div className="grid grid-cols-7 gap-px bg-gradient-to-r from-slate-200 to-slate-100 rounded-t-lg">{days}</div>;
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = gridBoundaries.start;

    while (day <= gridBoundaries.end) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = getEventsForDate(cloneDay);

        const isMuted = !isSameMonth(day, monthBoundaries.start);
        const isSelected = isSameDay(day, selectedDate);

        days.push(
          <div
            key={day.toISOString()}
            className={`min-h-[140px] bg-white/90 backdrop-blur-sm border border-slate-100 p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
              isMuted ? 'bg-slate-50/60 text-slate-400' : 'text-slate-700'
            } ${
              isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : 'ring-0'
            }`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-sm font-semibold ${
                  isToday(day)
                    ? 'bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg shadow-blue-600/40'
                    : ''
                }`}
              >
                {format(day, 'd')}
              </span>
            </div>
            <div className="space-y-2">
              {dayEvents.map((event) => {
                const accent = EVENT_COLORS[event.eventType] || EVENT_COLORS.default;
                return (
                  <button
                    type="button"
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                    className={`w-full text-left text-xs font-medium px-3 py-2 rounded-xl shadow-sm bg-gradient-to-r ${accent} hover:brightness-110 transition-all hover:-translate-y-0.5`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{event.title}</span>
                      <span className="text-[10px] opacity-80">
                        {format(event.startTime, 'p')}
                      </span>
                    </div>
                    {event.location && (
                      <p className="mt-1 text-[10px] opacity-70 truncate">{event.location}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-4">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-4 mt-4">{rows}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
          <div className="absolute -top-10 -right-10 h-48 w-48 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 bg-purple-500/40 rounded-full blur-3xl" />
          <div className="relative p-8 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur">
                  <SparklesIcon className="h-5 w-5" />
                  Tenant-exclusive planning hub
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Calendar &amp; Sacred Gatherings
                </h1>
                <p className="text-white/80 text-base sm:text-lg">
                  Keep your community in sync with events that are automatically scoped to <span className="font-semibold">{currentTenant || 'your tenant'}</span>. Create ceremonies, meetings, and mindfulness sessions with ease.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                    className="bg-white/90 text-blue-600 hover:bg-white"
                  >
                    <PlusIcon className="h-5 w-5" />
                    New Event
                  </Button>
                  <Button variant="ghost" onClick={goToToday} className="text-white border-white/40 hover:bg-white/10">
                    Today
                  </Button>
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 min-w-[260px] shadow-inner border border-white/20">
                <h2 className="text-sm uppercase tracking-widest text-white/70 mb-3">
                  This Month
                </h2>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map(event => (
                      <div key={event.id} className="bg-white/20 rounded-xl p-4 space-y-1">
                        <p className="text-sm font-semibold truncate">{event.title}</p>
                        <p className="text-xs text-white/70">
                          {format(event.startTime, 'MMMM d, p')} • {event.location || 'TBD'}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-white/60">
                          <span className="inline-flex h-2 w-2 rounded-full bg-white/60" />
                          {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/70">
                    No upcoming events scheduled yet. Let’s create something inspiring!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-100 p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{format(currentDate, 'MMMM yyyy')}</h2>
              <p className="text-slate-500">Navigate between months to view tenant-specific events.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="p-3 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-slate-600" />
                </button>
                <button
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="p-3 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <ChevronRightIcon className="h-5 w-5 text-slate-600" />
                </button>
              </div>
              <Button variant="outline" onClick={goToToday}>
                Today
              </Button>
            </div>
          </div>

          <div className="relative mt-6">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
                <LoadingSpinner size="lg" label="Syncing events" />
              </div>
            )}
            {error && !loading ? (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-red-600 text-center">
                {error}
              </div>
            ) : (
              <div className="relative">
                {renderDays()}
                {renderCells()}
              </div>
            )}
          </div>

          {!loading && events.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <CalendarIcon className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-lg font-semibold text-slate-700">No events scheduled in this window</h3>
              <p className="text-slate-500 mt-1 mb-6">
                Your tenant’s calendar is clear. Create the first gathering to bring everyone together.
              </p>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Plan an Event
              </Button>
            </div>
          )}
        </div>
      </div>

      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateEvent}
        defaultDate={selectedDate}
      />

      {selectedEvent && (
        <EventDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onDelete={() => handleDeleteEvent(selectedEvent.id)}
        />
      )}
    </div>
  );
}
