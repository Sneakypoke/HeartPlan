import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import todoReducer, { TodoState } from './slices/todoSlice';
import giftReducer from './slices/giftSlice';
import journalReducer from './slices/journalSlice';
import eventReducer from './slices/eventSlice';
import tripReducer from './slices/tripSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    gifts: giftReducer,
    journal: journalReducer,
    events: eventReducer,
    trips: tripReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface Todo {
  id?: number;
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface Gift {
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

export interface JournalEntry {
  id?: number;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  images: string[];
}

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

// Re-export TodoState for external consumers
export type { TodoState };
