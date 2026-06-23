import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import client from '../../api/client';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// DRF returns validation detail as either { detail: "..." } (auth failures) or
// { field: ["msg", ...] } (serializer errors). Flatten to a single readable
// string so the user sees the actual reason (duplicate username, weak password,
// invalid email) instead of a generic "failed" message.
const extractError = (payload: unknown, fallback: string): string => {
  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, unknown>;
    if (typeof data.detail === 'string') return data.detail;
    const first = Object.values(data)[0];
    if (Array.isArray(first) && typeof first[0] === 'string') return first[0];
    if (typeof first === 'string') return first;
  }
  return fallback;
};

const initialState: AuthState = {
  token: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  string,
  { username: string; password: string },
  { rejectValue: unknown }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await client.post('/api/token/', credentials);
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    return access;
  } catch (err) {
    if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data);
    throw err;
  }
});

export const register = createAsyncThunk<
  string,
  { username: string; email: string; password: string },
  { rejectValue: unknown }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    await client.post('/api/register/', userData);
    const response = await client.post('/api/token/', {
      username: userData.username,
      password: userData.password,
    });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    return access;
  } catch (err) {
    if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data);
    throw err;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? extractError(action.payload, 'Login failed')
          : action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? extractError(action.payload, 'Registration failed')
          : action.error.message || 'Registration failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 