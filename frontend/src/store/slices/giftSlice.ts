import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Gift {
  id?: number;
  title: string;
  description: string;
  price_range: string;
  occasion: string;
  category: string;
  image_url: string;
  purchased: boolean;
  notes: string;
  link: string;
}

interface GiftState {
  gifts: Gift[];
  loading: boolean;
  error: string | null;
}

const initialState: GiftState = {
  gifts: [],
  loading: false,
  error: null,
};

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchGifts = createAsyncThunk('gifts/fetchGifts', async () => {
  const response = await axios.get('http://localhost:8000/api/gifts/', {
    headers: getAuthHeader(),
  });
  return response.data;
});

export const addGift = createAsyncThunk('gifts/addGift', async (gift: Omit<Gift, 'id'>) => {
  const response = await axios.post('http://localhost:8000/api/gifts/', gift, {
    headers: getAuthHeader(),
  });
  return response.data;
});

export const updateGift = createAsyncThunk(
  'gifts/updateGift',
  async ({ id, gift }: { id: number; gift: Partial<Gift> }) => {
    const response = await axios.patch(`http://localhost:8000/api/gifts/${id}/`, gift, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
);

export const deleteGift = createAsyncThunk('gifts/deleteGift', async (id: number) => {
  await axios.delete(`http://localhost:8000/api/gifts/${id}/`, {
    headers: getAuthHeader(),
  });
  return id;
});

const giftSlice = createSlice({
  name: 'gifts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch gifts
      .addCase(fetchGifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGifts.fulfilled, (state, action) => {
        state.loading = false;
        state.gifts = action.payload;
      })
      .addCase(fetchGifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch gifts';
      })
      // Add gift
      .addCase(addGift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGift.fulfilled, (state, action) => {
        state.loading = false;
        state.gifts.push(action.payload);
      })
      .addCase(addGift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add gift';
      })
      // Update gift
      .addCase(updateGift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGift.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.gifts.findIndex((gift) => gift.id === action.payload.id);
        if (index !== -1) {
          state.gifts[index] = action.payload;
        }
      })
      .addCase(updateGift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update gift';
      })
      // Delete gift
      .addCase(deleteGift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGift.fulfilled, (state, action) => {
        state.loading = false;
        state.gifts = state.gifts.filter((gift) => gift.id !== action.payload);
      })
      .addCase(deleteGift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete gift';
      });
  },
});

export const { clearError } = giftSlice.actions;
export default giftSlice.reducer; 