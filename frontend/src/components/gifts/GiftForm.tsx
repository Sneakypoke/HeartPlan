import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface GiftFormProps {
  gift?: {
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
  };
  onSave: () => void;
  onCancel: () => void;
}

const GiftForm: React.FC<GiftFormProps> = ({ gift, onSave, onCancel }) => {
  const [title, setTitle] = useState(gift?.title || '');
  const [description, setDescription] = useState(gift?.description || '');
  const [priceRange, setPriceRange] = useState(gift?.price_range || '');
  const [occasion, setOccasion] = useState(gift?.occasion || '');
  const [category, setCategory] = useState(gift?.category || '');
  const [imageUrl, setImageUrl] = useState(gift?.image_url || '');
  const [notes, setNotes] = useState(gift?.notes || '');
  const [link, setLink] = useState(gift?.link || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const giftData = {
        title,
        description,
        price_range: priceRange,
        occasion,
        category,
        image_url: imageUrl,
        notes,
        link,
        purchased: gift?.purchased || false,
      };

      if (gift?.id) {
        // Update existing gift
        await axios.put(
          `http://localhost:8000/api/gift-ideas/${gift.id}/`,
          giftData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
      } else {
        // Create new gift
        await axios.post(
          'http://localhost:8000/api/gift-ideas/',
          giftData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
      }
      onSave();
    } catch (error) {
      setError('Failed to save gift idea. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        {gift?.id ? 'Edit Gift Idea' : 'Add New Gift Idea'}
      </h2>
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">
              Price Range
            </label>
            <select
              id="priceRange"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Price Range</option>
              <option value="$0-25">$0-25</option>
              <option value="$26-50">$26-50</option>
              <option value="$51-100">$51-100</option>
              <option value="$101-200">$101-200</option>
              <option value="$201+">$201+</option>
            </select>
          </div>
          <div>
            <label htmlFor="occasion" className="block text-sm font-medium text-gray-700">
              Occasion
            </label>
            <select
              id="occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Occasion</option>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Christmas">Christmas</option>
              <option value="Valentine's Day">Valentine's Day</option>
              <option value="Wedding">Wedding</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Books">Books</option>
            <option value="Sports">Sports</option>
            <option value="Beauty">Beauty</option>
            <option value="Toys">Toys</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
            Product Link
          </label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="https://example.com/product"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={2}
            placeholder="Additional notes about the gift idea..."
          />
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
            {gift?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GiftForm; 