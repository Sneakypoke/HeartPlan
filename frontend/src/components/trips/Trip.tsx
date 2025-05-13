import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import TripForm from './TripForm';
import '../../styles/responsive.css';

interface Trip {
  id: number;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  itinerary: {
    id: number;
    date: string;
    activities: {
      id: number;
      title: string;
      time: string;
      location: string;
      notes: string;
    }[];
  }[];
  expenses: {
    id: number;
    category: string;
    amount: number;
    description: string;
    date: string;
  }[];
  packing_list: {
    id: number;
    item: string;
    category: string;
    packed: boolean;
  }[];
  weather_forecast?: {
    date: string;
    temperature: number;
    condition: string;
  }[];
}

const Trip: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState({
    status: '',
    search: ''
  });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
    }
  }, [isAuthenticated]);

  const fetchTrips = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/trips/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const handleEdit = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsFormOpen(true);
  };

  const handleDelete = async (tripId: number) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await axios.delete(`http://localhost:8000/api/trips/${tripId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setTrips(trips.filter(trip => trip.id !== tripId));
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  const handleSave = () => {
    fetchTrips();
    setIsFormOpen(false);
    setSelectedTrip(null);
  };

  const filteredTrips = trips.filter(trip => {
    return (
      (filter.status === '' || trip.status === filter.status) &&
      (filter.search === '' || 
       trip.title.toLowerCase().includes(filter.search.toLowerCase()) ||
       trip.destination.toLowerCase().includes(filter.search.toLowerCase()))
    );
  });

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const calculateTotalExpenses = (expenses: Trip['expenses']) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <div className="container padding-responsive">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-responsive font-bold mb-4 md:mb-0">Trip Planning</h1>
        <button
          onClick={() => {
            setSelectedTrip(null);
            setIsFormOpen(true);
          }}
          className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          New Trip
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-6">
          <TripForm
            trip={selectedTrip || undefined}
            onSave={handleSave}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedTrip(null);
            }}
          />
        </div>
      )}

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              placeholder="Search trips..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="grid-responsive">
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="card-responsive bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-responsive font-semibold mb-2">{trip.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span>{trip.destination}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(trip.status)}`}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(trip)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Dates</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Budget</h4>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <p className="text-sm text-gray-600 mb-2 md:mb-0">
                      Budget: ${trip.budget.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Spent: ${calculateTotalExpenses(trip.expenses).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Itinerary</h4>
                  <div className="space-y-2">
                    {trip.itinerary.map((day) => (
                      <div key={day.id} className="text-sm">
                        <p className="font-medium text-gray-700">
                          {new Date(day.date).toLocaleDateString()}
                        </p>
                        <ul className="mt-1 space-y-1">
                          {day.activities.map((activity) => (
                            <li key={activity.id} className="text-gray-600">
                              {activity.time} - {activity.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Packing List</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {trip.packing_list.map((item) => (
                      <div
                        key={item.id}
                        className={`text-sm ${
                          item.packed ? 'text-green-600' : 'text-gray-600'
                        }`}
                      >
                        {item.packed ? '✓' : '○'} {item.item}
                      </div>
                    ))}
                  </div>
                </div>

                {trip.weather_forecast && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Weather Forecast</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {trip.weather_forecast.map((forecast, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          <p className="font-medium">
                            {new Date(forecast.date).toLocaleDateString()}
                          </p>
                          <p>{forecast.temperature}°C</p>
                          <p>{forecast.condition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trip; 