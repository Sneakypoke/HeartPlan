import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import TodoList from './components/todo/TodoList';
import GiftVault from './components/gifts/GiftVault';
import Journal from './components/journal/Journal';
import Calendar from './components/calendar/Calendar';
import Trip from './components/trips/Trip';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/todos"
              element={
                <PrivateRoute>
                  <TodoList />
                </PrivateRoute>
              }
            />
            <Route
              path="/gifts"
              element={
                <PrivateRoute>
                  <GiftVault />
                </PrivateRoute>
              }
            />
            <Route
              path="/journal"
              element={
                <PrivateRoute>
                  <Journal />
                </PrivateRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <Calendar />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <PrivateRoute>
                  <Trip />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/todos" />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App; 