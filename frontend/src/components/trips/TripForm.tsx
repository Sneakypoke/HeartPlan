import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/responsive.css';

interface TripFormProps {
  trip?: {
    id: number;
    title: string;
    destination: string;
    start_date: string;
    end_date: string;
    budget: number;
    status: string;
    itinerary: Array<{
      id: number;
      date: string;
      activities: Array<{
        id: number;
        time: string;
        title: string;
        description: string;
      }>;
    }>;
    expenses: Array<{
      id: number;
      description: string;
      amount: number;
      date: string;
    }>;
    packing_list: Array<{
      id: number;
      item: string;
      packed: boolean;
    }>;
  };
  onSave: () => void;
  onCancel: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ trip, onSave, onCancel }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState(trip?.title || '');
  const [destination, setDestination] = useState(trip?.destination || '');
  const [startDate, setStartDate] = useState(trip?.start_date || '');
  const [endDate, setEndDate] = useState(trip?.end_date || '');
  const [budget, setBudget] = useState(trip?.budget || 0);
  const [status, setStatus] = useState(trip?.status || 'planning');
  const [itinerary, setItinerary] = useState(trip?.itinerary || []);
  const [expenses, setExpenses] = useState(trip?.expenses || []);
  const [packingList, setPackingList] = useState(trip?.packing_list || []);

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
        packing_list: packingList,
      };

      if (trip?.id) {
        await axios.put(
          `http://localhost:8000/api/trips/${trip.id}/`,
          tripData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post('http://localhost:8000/api/trips/', tripData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  const addActivity = (dayId: number) => {
    setItinerary(
      itinerary.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: [
                ...day.activities,
                {
                  id: Date.now(),
                  time: '',
                  title: '',
                  description: '',
                },
              ],
            }
          : day
      )
    );
  };

  const removeActivity = (dayId: number, activityId: number) => {
    setItinerary(
      itinerary.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.filter((a) => a.id !== activityId),
            }
          : day
      )
    );
  };

  const addExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const removeExpense = (expenseId: number) => {
    setExpenses(expenses.filter((e) => e.id !== expenseId));
  };

  const addPackingItem = () => {
    setPackingList([
      ...packingList,
      {
        id: Date.now(),
        item: '',
        packed: false,
      },
    ]);
  };

  const removePackingItem = (itemId: number) => {
    setPackingList(packingList.filter((item) => item.id !== itemId));
  };

  const togglePacked = (itemId: number) => {
    setPackingList(
      packingList.map((item) =>
        item.id === itemId ? { ...item, packed: !item.packed } : item
      )
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Budget</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="planning">Planning</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Itinerary</h3>
          <button
            type="button"
            onClick={() =>
              setItinerary([
                ...itinerary,
                {
                  id: Date.now(),
                  date: new Date().toISOString().split('T')[0],
                  activities: [],
                },
              ])
            }
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Day
          </button>
        </div>

        {itinerary.map((day) => (
          <div key={day.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <input
                type="date"
                value={day.date}
                onChange={(e) =>
                  setItinerary(
                    itinerary.map((d) =>
                      d.id === day.id ? { ...d, date: e.target.value } : d
                    )
                  )
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => addActivity(day.id)}
                className="ml-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Activity
              </button>
            </div>

            {day.activities.map((activity) => (
              <div key={activity.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="time"
                  value={activity.time}
                  onChange={(e) =>
                    setItinerary(
                      itinerary.map((d) =>
                        d.id === day.id
                          ? {
                              ...d,
                              activities: d.activities.map((a) =>
                                a.id === activity.id
                                  ? { ...a, time: e.target.value }
                                  : a
                              ),
                            }
                          : d
                      )
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={activity.title}
                  onChange={(e) =>
                    setItinerary(
                      itinerary.map((d) =>
                        d.id === day.id
                          ? {
                              ...d,
                              activities: d.activities.map((a) =>
                                a.id === activity.id
                                  ? { ...a, title: e.target.value }
                                  : a
                              ),
                            }
                          : d
                      )
                    )
                  }
                  placeholder="Activity title"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="flex items-center">
                  <input
                    type="text"
                    value={activity.description}
                    onChange={(e) =>
                      setItinerary(
                        itinerary.map((d) =>
                          d.id === day.id
                            ? {
                                ...d,
                                activities: d.activities.map((a) =>
                                  a.id === activity.id
                                    ? { ...a, description: e.target.value }
                                    : a
                                ),
                              }
                            : d
                        )
                      )
                    }
                    placeholder="Description"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeActivity(day.id, activity.id)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Expenses</h3>
          <button
            type="button"
            onClick={addExpense}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Expense
          </button>
        </div>

        {expenses.map((expense) => (
          <div key={expense.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={expense.description}
              onChange={(e) =>
                setExpenses(
                  expenses.map((ex) =>
                    ex.id === expense.id
                      ? { ...ex, description: e.target.value }
                      : ex
                  )
                )
              }
              placeholder="Description"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="number"
              value={expense.amount}
              onChange={(e) =>
                setExpenses(
                  expenses.map((ex) =>
                    ex.id === expense.id
                      ? { ...ex, amount: Number(e.target.value) }
                      : ex
                  )
                )
              }
              placeholder="Amount"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <div className="flex items-center">
              <input
                type="date"
                value={expense.date}
                onChange={(e) =>
                  setExpenses(
                    expenses.map((ex) =>
                      ex.id === expense.id ? { ...ex, date: e.target.value } : ex
                    )
                  )
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => removeExpense(expense.id)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Packing List</h3>
          <button
            type="button"
            onClick={addPackingItem}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Item
          </button>
        </div>

        {packingList.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={item.packed}
              onChange={() => togglePacked(item.id)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <input
              type="text"
              value={item.item}
              onChange={(e) =>
                setPackingList(
                  packingList.map((i) =>
                    i.id === item.id ? { ...i, item: e.target.value } : i
                  )
                )
              }
              placeholder="Item name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => removePackingItem(item.id)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default TripForm; 