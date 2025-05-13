import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import GiftForm from './GiftForm';

interface Gift {
  id: number;
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

const GiftVault: React.FC = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState({
    category: '',
    occasion: '',
    priceRange: '',
    purchased: 'all'
  });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchGifts();
    }
  }, [isAuthenticated]);

  const fetchGifts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/gift-ideas/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setGifts(response.data);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    }
  };

  const handleEdit = (gift: Gift) => {
    setSelectedGift(gift);
    setIsFormOpen(true);
  };

  const handleDelete = async (giftId: number) => {
    if (window.confirm('Are you sure you want to delete this gift idea?')) {
      try {
        await axios.delete(`http://localhost:8000/api/gift-ideas/${giftId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setGifts(gifts.filter(gift => gift.id !== giftId));
      } catch (error) {
        console.error('Error deleting gift:', error);
      }
    }
  };

  const handleTogglePurchased = async (gift: Gift) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/gift-ideas/${gift.id}/`,
        { purchased: !gift.purchased },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setGifts(gifts.map(g => g.id === gift.id ? response.data : g));
    } catch (error) {
      console.error('Error updating gift:', error);
    }
  };

  const handleSave = () => {
    fetchGifts();
    setIsFormOpen(false);
    setSelectedGift(null);
  };

  const filteredGifts = gifts.filter(gift => {
    return (
      (filter.category === '' || gift.category === filter.category) &&
      (filter.occasion === '' || gift.occasion === filter.occasion) &&
      (filter.priceRange === '' || gift.price_range === filter.priceRange) &&
      (filter.purchased === 'all' || 
       (filter.purchased === 'purchased' && gift.purchased) ||
       (filter.purchased === 'not_purchased' && !gift.purchased))
    );
  });

  const categories = Array.from(new Set(gifts.map(gift => gift.category)));
  const occasions = Array.from(new Set(gifts.map(gift => gift.occasion)));
  const priceRanges = Array.from(new Set(gifts.map(gift => gift.price_range)));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gift Idea Vault</h1>
        <button
          onClick={() => {
            setSelectedGift(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add New Gift Idea
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-6">
          <GiftForm
            gift={selectedGift || undefined}
            onSave={handleSave}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedGift(null);
            }}
          />
        </div>
      )}

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Occasion</label>
            <select
              value={filter.occasion}
              onChange={(e) => setFilter({ ...filter, occasion: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Occasions</option>
              {occasions.map(occasion => (
                <option key={occasion} value={occasion}>{occasion}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <select
              value={filter.priceRange}
              onChange={(e) => setFilter({ ...filter, priceRange: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Prices</option>
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filter.purchased}
              onChange={(e) => setFilter({ ...filter, purchased: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Gifts</option>
              <option value="purchased">Purchased</option>
              <option value="not_purchased">Not Purchased</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.map((gift) => (
          <div
            key={gift.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${
              gift.purchased ? 'opacity-75' : ''
            }`}
          >
            <div className="relative">
              <img
                src={gift.image_url || 'https://via.placeholder.com/300x200'}
                alt={gift.title}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => handleTogglePurchased(gift)}
                className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${
                  gift.purchased
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {gift.purchased ? 'Purchased' : 'Not Purchased'}
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{gift.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{gift.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {gift.category}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  {gift.occasion}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {gift.price_range}
                </span>
              </div>
              {gift.link && (
                <a
                  href={gift.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 text-sm block mb-2"
                >
                  View Product
                </a>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(gift)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(gift.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftVault; 