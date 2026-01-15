'use client';

import { useState } from 'react';

interface ArtistData {
  name: string;
  concertNight: string;
  genre: string;
  revealDate: string;
  bio: string;
}

interface ArtistFormProps {
  initialData?: ArtistData;
  onSubmit: (data: ArtistData) => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

const concertOptions = ['Night 1 - EDM Night', 'Night 2 - Rock Night'];

export default function ArtistForm({
  initialData,
  onSubmit,
  submitButtonText = 'Add Artist',
  isLoading = false,
}: ArtistFormProps) {
  const [formData, setFormData] = useState<ArtistData>({
    name: initialData?.name || '',
    concertNight: initialData?.concertNight || concertOptions[0],
    genre: initialData?.genre || '',
    revealDate: initialData?.revealDate || '',
    bio: initialData?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Artist Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Concert Night</label>
        <select
          name="concertNight"
          value={formData.concertNight}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          {concertOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="e.g., EDM, Rock, Pop"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Reveal Date</label>
        <input
          type="date"
          name="revealDate"
          value={formData.revealDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          rows={3}
          placeholder="Artist biography..."
        />
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
