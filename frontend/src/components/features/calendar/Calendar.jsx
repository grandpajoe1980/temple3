import { useState } from 'react';
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon 
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
  isToday 
} from 'date-fns';
import Button from '../../shared/Button';
import CreateEventModal from './CreateEventModal';
import EventDetailsModal from './EventDetailsModal';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([
    // Sample events for demonstration
    {
      id: 1,
      title: 'Sunday Service',
      date: new Date(),
      time: '10:00 AM',
      description: 'Weekly worship service',
      category: 'Service',
      location: 'Main Hall',
    },
  ]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleCreateEvent = (eventData) => {
    const newEvent = {
      id: events.length + 1,
      ...eventData,
      date: selectedDate,
    };
    setEvents([...events, newEvent]);
    setShowCreateModal(false);
  };

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEEEE';
    let day = startDate;

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-sm font-semibold text-gray-700 py-2">
          {format(day, dateFormat)}
        </div>
      );
      day = addDays(day, 1);
    }

    return <div className="grid grid-cols-7 gap-px bg-gray-200">{days}</div>;
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = getEventsForDate(cloneDay);
        
        days.push(
          <div
            key={day}
            className={`min-h-[120px] bg-white p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
              !isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-400' : ''
            } ${isSameDay(day, selectedDate) ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <div className="flex justify-between items-start mb-1">
              <span
                className={`text-sm font-medium ${
                  isToday(day) ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''
                }`}
              >
                {format(day, 'd')}
              </span>
            </div>
            <div className="space-y-1">
              {dayEvents.map((event, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event);
                  }}
                  className={`text-xs p-1 rounded truncate ${
                    event.category === 'Service' ? 'bg-blue-100 text-blue-800' :
                    event.category === 'Meeting' ? 'bg-green-100 text-green-800' :
                    event.category === 'Social' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  } hover:opacity-80 cursor-pointer`}
                >
                  {event.time} - {event.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-px bg-gray-200">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="bg-gray-200 rounded-b-lg overflow-hidden">{rows}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CalendarIcon className="h-8 w-8" />
              Calendar & Events
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage temple events and gatherings
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create Event
          </Button>
        </div>

        {/* Calendar Controls */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 flex items-center justify-between border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <div className="flex">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-l-lg border border-gray-300"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-r-lg border border-l-0 border-gray-300"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div>
            {renderDays()}
            {renderCells()}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Event Categories</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span className="text-sm text-gray-600">Services</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span className="text-sm text-gray-600">Meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 rounded"></div>
              <span className="text-sm text-gray-600">Social Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span className="text-sm text-gray-600">Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateEvent}
        selectedDate={selectedDate}
      />
      
      {selectedEvent && (
        <EventDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
