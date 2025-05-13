import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import JournalForm from './JournalForm';
import '../../styles/responsive.css';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  images: string[];
}

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState({
    mood: '',
    tag: '',
    search: ''
  });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchEntries();
    }
  }, [isAuthenticated]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/journal-entries/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsFormOpen(true);
  };

  const handleDelete = async (entryId: number) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await axios.delete(`http://localhost:8000/api/journal-entries/${entryId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setEntries(entries.filter(entry => entry.id !== entryId));
      } catch (error) {
        console.error('Error deleting journal entry:', error);
      }
    }
  };

  const handleSave = () => {
    fetchEntries();
    setIsFormOpen(false);
    setSelectedEntry(null);
  };

  const filteredEntries = entries.filter(entry => {
    return (
      (filter.mood === '' || entry.mood === filter.mood) &&
      (filter.tag === '' || entry.tags.includes(filter.tag)) &&
      (filter.search === '' || 
       entry.title.toLowerCase().includes(filter.search.toLowerCase()) ||
       entry.content.toLowerCase().includes(filter.search.toLowerCase()))
    );
  });

  const moods = Array.from(new Set(entries.map(entry => entry.mood)));
  const tags = Array.from(new Set(entries.flatMap(entry => entry.tags)));

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      'Happy': '😊',
      'Sad': '😢',
      'Excited': '🤩',
      'Anxious': '😰',
      'Calm': '😌',
      'Angry': '😠',
      'Neutral': '😐'
    };
    return moodEmojis[mood] || '😐';
  };

  return (
    <div className="container padding-responsive">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-responsive font-bold mb-4 md:mb-0">Journal</h1>
        <button
          onClick={() => {
            setSelectedEntry(null);
            setIsFormOpen(true);
          }}
          className="w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          New Entry
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-6">
          <JournalForm
            entry={selectedEntry || undefined}
            onSave={handleSave}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedEntry(null);
            }}
          />
        </div>
      )}

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mood</label>
            <select
              value={filter.mood}
              onChange={(e) => setFilter({ ...filter, mood: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Moods</option>
              {moods.map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tag</label>
            <select
              value={filter.tag}
              onChange={(e) => setFilter({ ...filter, tag: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              placeholder="Search entries..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center">
                      {getMoodEmoji(entry.mood)} {entry.mood}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="prose max-w-none mb-4">
                {entry.content}
              </div>
              {entry.images && entry.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {entry.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Journal entry image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal; 