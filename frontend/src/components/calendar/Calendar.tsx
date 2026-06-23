import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, Event } from '../../store';
import { fetchEvents, addEvent, updateEvent, deleteEvent } from '../../store/slices/eventSlice';
import '../../styles/responsive.css';

const Calendar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events } = useSelector((state: RootState) => state.events);
  const [selectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  // PrivateRoute already gates this route on Redux auth — dispatch unconditionally.
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      title,
      description,
      start,
      end,
      location,
      category,
      reminder: selectedEvent?.reminder ?? false,
    };

    try {
      if (selectedEvent?.id) {
        await dispatch(updateEvent({ id: selectedEvent.id, event: eventData })).unwrap();
      } else {
        await dispatch(addEvent(eventData)).unwrap();
      }

      setTitle('');
      setDescription('');
      setStart('');
      setEnd('');
      setLocation('');
      setCategory('');
      setSelectedEvent(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setStart(event.start);
    setEnd(event.end);
    setLocation(event.location);
    setCategory(event.category);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteEvent(id));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const days = getDaysInMonth(selectedDate);

  return (
    <div className="container padding-responsive">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-responsive font-bold mb-4 md:mb-0">Calendar</h1>
        <button
          onClick={() => {
            setSelectedEvent(null);
            setTitle('');
            setDescription('');
            setStart('');
            setEnd('');
            setLocation('');
            setCategory('');
            setIsEditing(true);
          }}
          className="w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          New Event
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="form-responsive space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="datetime-local"
                id="start"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="end" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="datetime-local"
                id="end"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Social">Social</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              {selectedEvent ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-[100px] bg-white p-2 ${
                  day && day.getMonth() === selectedDate.getMonth()
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {day && (
                  <>
                    <div className="font-medium">{day.getDate()}</div>
                    <div className="mt-1 space-y-1">
                      {getEventsForDate(day).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded bg-indigo-100 text-indigo-800 truncate flex justify-between items-center"
                        >
                          <span
                            className="truncate cursor-pointer"
                            onClick={() => handleEdit(event)}
                          >
                            {event.title}
                          </span>
                          <button
                            onClick={() => handleDelete(event.id!)}
                            className="ml-1 text-red-600 hover:text-red-900"
                            aria-label="Delete event"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
