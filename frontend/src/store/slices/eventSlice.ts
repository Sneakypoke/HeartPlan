import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

export interface Event {
  id?: number;
  title: string;
  description: string;
  start: string;
  end: string;
  location: string;
  category: string;
  reminder: boolean;
}

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
  const response = await client.get('/api/events/');
  return response.data;
});

export const addEvent = createAsyncThunk('events/addEvent', async (event: Omit<Event, 'id'>) => {
  const response = await client.post('/api/events/', event);
  return response.data;
});

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, event }: { id: number; event: Partial<Event> }) => {
    const response = await client.patch(`/api/events/${id}/`, event);
    return response.data;
  }
);

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (id: number) => {
  await client.delete(`/api/events/${id}/`);
  return id;
});

const eventSlice = createSlice({
  name: 'events',
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

export const { clearError } = eventSlice.actions;
export default eventSlice.reducer;
