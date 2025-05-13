import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface JournalEntry {
  id?: number;
  title: string;
  content: string;
  mood: string;
  date: string;
  tags: string[];
}

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: JournalState = {
  entries: [],
  loading: false,
  error: null,
};

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchJournalEntries = createAsyncThunk('journal/fetchEntries', async () => {
  const response = await axios.get('http://localhost:8000/api/journal/', {
    headers: getAuthHeader(),
  });
  return response.data;
});

export const addJournalEntry = createAsyncThunk(
  'journal/addEntry',
  async (entry: Omit<JournalEntry, 'id'>) => {
    const response = await axios.post('http://localhost:8000/api/journal/', entry, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
);

export const updateJournalEntry = createAsyncThunk(
  'journal/updateEntry',
  async ({ id, entry }: { id: number; entry: Partial<JournalEntry> }) => {
    const response = await axios.patch(`http://localhost:8000/api/journal/${id}/`, entry, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
);

export const deleteJournalEntry = createAsyncThunk('journal/deleteEntry', async (id: number) => {
  await axios.delete(`http://localhost:8000/api/journal/${id}/`, {
    headers: getAuthHeader(),
  });
  return id;
});

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch entries
      .addCase(fetchJournalEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournalEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchJournalEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch journal entries';
      })
      // Add entry
      .addCase(addJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.push(action.payload);
      })
      .addCase(addJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add journal entry';
      })
      // Update entry
      .addCase(updateJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.entries.findIndex((entry) => entry.id === action.payload.id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
      .addCase(updateJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update journal entry';
      })
      // Delete entry
      .addCase(deleteJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter((entry) => entry.id !== action.payload);
      })
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete journal entry';
      });
  },
});

export const { clearError } = journalSlice.actions;
export default journalSlice.reducer; 