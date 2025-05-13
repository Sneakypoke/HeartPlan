import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Event {
  id?: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  type: 'birthday' | 'anniversary' | 'holiday' | 'other';
  reminder: boolean;
}

interface CalendarState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: CalendarState = {
  events: [],
  loading: false,
  error: null,
};

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchEvents = createAsyncThunk('calendar/fetchEvents', async () => {
  const response = await axios.get('http://localhost:8000/api/calendar/', {
    headers: getAuthHeader(),
  });
  return response.data;
});

export const addEvent = createAsyncThunk('calendar/addEvent', async (event: Omit<Event, 'id'>) => {
  const response = await axios.post('http://localhost:8000/api/calendar/', event, {
    headers: getAuthHeader(),
  });
  return response.data;
});

export const updateEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, event }: { id: number; event: Partial<Event> }) => {
    const response = await axios.patch(`http://localhost:8000/api/calendar/${id}/`, event, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
);

export const deleteEvent = createAsyncThunk('calendar/deleteEvent', async (id: number) => {
  await axios.delete(`http://localhost:8000/api/calendar/${id}/`, {
    headers: getAuthHeader(),
  });
  return id;
});

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch events';
      })
      // Add event
      .addCase(addEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add event';
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex((event) => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update event';
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter((event) => event.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete event';
      });
  },
});

export const { clearError } = calendarSlice.actions;
export default calendarSlice.reducer; 