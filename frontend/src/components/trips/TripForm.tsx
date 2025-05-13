import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface TripFormProps {
  trip?: {
    id?: number;
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
  };
  onSave: () => void;
  onCancel: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ trip, onSave, onCancel }) => {
  const [title, setTitle] = useState(trip?.title || '');
  const [destination, setDestination] = useState(trip?.destination || '');
  const [startDate, setStartDate] = useState(trip?.start_date || '');
  const [endDate, setEndDate] = useState(trip?.end_date || '');
  const [budget, setBudget] = useState(trip?.budget || 0);
  const [status, setStatus] = useState(trip?.status || 'planning');
  const [itinerary, setItinerary] = useState(trip?.itinerary || []);
  const [expenses, setExpenses] = useState(trip?.expenses || []);
  const [packingList, setPackingList] = useState(trip?.packing_list || []);
  const [error, setError] = useState('');

  // New item states
  const [newActivity, setNewActivity] = useState({
    date: '',
    title: '',
    time: '',
    location: '',
    notes: ''
  });
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: 0,
    description: '',
    date: ''
  });
  const [newPackingItem, setNewPackingItem] = useState({
    item: '',
    category: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tripData = {
        title,
        destination,
        start_date: startDate,
        end_date: endDate,
        budget,
        status,
        itinerary,
        expenses,
        packing_list: packingList
      };

      if (trip?.id) {
        await axios.put(
          `http://localhost:8000/api/trips/${trip.id}/`,
          tripData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
      } else {
        await axios.post(
          'http://localhost:8000/api/trips/',
          tripData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
      }
      onSave();
    } catch (error) {
      setError('Failed to save trip. Please try again.');
    }
  };

  const handleAddActivity = () => {
    if (newActivity.date && newActivity.title) {
      const dayIndex = itinerary.findIndex(day => day.date === newActivity.date);
      const activity = {
        id: Date.now(),
        title: newActivity.title,
        time: newActivity.time,
        location: newActivity.location,
        notes: newActivity.notes
      };

      if (dayIndex === -1) {
        setItinerary([...itinerary, {
          id: Date.now(),
          date: newActivity.date,
          activities: [activity]
        }]);
      } else {
        const updatedItinerary = [...itinerary];
        updatedItinerary[dayIndex].activities.push(activity);
        setItinerary(updatedItinerary);
      }

      setNewActivity({
        date: '',
        title: '',
        time: '',
        location: '',
        notes: ''
      });
    }
  };

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount > 0) {
      setExpenses([...expenses, {
        id: Date.now(),
        ...newExpense
      }]);
      setNewExpense({
        category: '',
        amount: 0,
        description: '',
        date: ''
      });
    }
  };

  const handleAddPackingItem = () => {
    if (newPackingItem.item) {
      setPackingList([...packingList, {
        id: Date.now(),
        ...newPackingItem,
        packed: false
      }]);
      setNewPackingItem({
        item: '',
        category: ''
      });
    }
  };

  const handleTogglePacked = (itemId: number) => {
    setPackingList(packingList.map(item =>
      item.id === itemId ? { ...item, packed: !item.packed } : item
    ));
  };

  const handleRemoveActivity = (dayId: number, activityId: number) => {
    setItinerary(itinerary.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: day.activities.filter(activity => activity.id !== activityId)
        };
      }
      return day;
    }));
  };

  const handleRemoveExpense = (expenseId: number) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
  };

  const handleRemovePackingItem = (itemId: number) => {
    setPackingList(packingList.filter(item => item.id !== itemId));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        {trip?.id ? 'Edit Trip' : 'New Trip'}
      </h2>
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget
            </label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Trip['status'])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="planning">Planning</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Itinerary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={newActivity.date}
                onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={newActivity.location}
                onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddActivity}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Add Activity
          </button>

          <div className="space-y-2">
            {itinerary.map((day) => (
              <div key={day.id} className="border rounded-md p-4">
                <h4 className="font-medium">{new Date(day.date).toLocaleDateString()}</h4>
                <ul className="mt-2 space-y-2">
                  {day.activities.map((activity) => (
                    <li key={activity.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-500">
                          {activity.time} at {activity.location}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveActivity(day.id, activity.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Expenses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddExpense}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Add Expense
          </button>

          <div className="space-y-2">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center border rounded-md p-4">
                <div>
                  <p className="font-medium">{expense.category}</p>
                  <p className="text-sm text-gray-500">${expense.amount}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExpense(expense.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Packing List</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Item</label>
              <input
                type="text"
                value={newPackingItem.item}
                onChange={(e) => setNewPackingItem({ ...newPackingItem, item: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={newPackingItem.category}
                onChange={(e) => setNewPackingItem({ ...newPackingItem, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddPackingItem}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Add Item
          </button>

          <div className="space-y-2">
            {packingList.map((item) => (
              <div key={item.id} className="flex justify-between items-center border rounded-md p-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={item.packed}
                    onChange={() => handleTogglePacked(item.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <div>
                    <p className="font-medium">{item.item}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePackingItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {trip?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm; 