import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

export interface Trip {
  id?: number;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: string;
  itinerary: unknown[];
  expenses: unknown[];
  packing_list: unknown[];
}

interface TripState {
  trips: Trip[];
  loading: boolean;
  error: string | null;
}

const initialState: TripState = {
  trips: [],
  loading: false,
  error: null,
};

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async () => {
  const response = await client.get('/api/trip-plans/');
  return response.data;
});

export const addTrip = createAsyncThunk('trips/addTrip', async (trip: Omit<Trip, 'id'>) => {
  const response = await client.post('/api/trip-plans/', trip);
  return response.data;
});

export const updateTrip = createAsyncThunk(
  'trips/updateTrip',
  async ({ id, trip }: { id: number; trip: Partial<Trip> }) => {
    const response = await client.patch(`/api/trip-plans/${id}/`, trip);
    return response.data;
  }
);

export const deleteTrip = createAsyncThunk('trips/deleteTrip', async (id: number) => {
  await client.delete(`/api/trip-plans/${id}/`);
  return id;
});

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch trips
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trips';
      })
      // Add trip
      .addCase(addTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips.push(action.payload);
      })
      .addCase(addTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add trip';
      })
      // Update trip
      .addCase(updateTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((trip) => trip.id === action.payload.id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
      })
      .addCase(updateTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update trip';
      })
      // Delete trip
      .addCase(deleteTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = state.trips.filter((trip) => trip.id !== action.payload);
      })
      .addCase(deleteTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete trip';
      });
  },
});

export const { clearError } = tripSlice.actions;
export default tripSlice.reducer;
