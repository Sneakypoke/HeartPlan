import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface Event {
  id: number;
  title: string;
  start: string;
  end?: string;
  description?: string;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/events/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDateSelect = async (selectInfo: any) => {
    const title = prompt('Please enter a title for your event:');
    if (title) {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/events/',
          {
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
        setEvents([...events, response.data]);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }
  };

  const handleEventClick = async (clickInfo: any) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:8000/api/events/${clickInfo.event.id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setEvents(events.filter(event => event.id !== clickInfo.event.id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
        />
      </div>
    </div>
  );
};

export default Calendar; 