'use client';

import { useState } from 'react';

interface AccommodationData {
  type: string;
  price: string | number;
  startDate: string;
  endDate: string;
  description: string;
}

interface AccommodationFormProps {
  initialData?: {
    id: number;
    type: string;
    price: number;
    startDate: string;
    endDate: string;
    description: string;
    available: boolean;
  };
  onSubmit: (data: AccommodationData) => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

export default function AccommodationForm({
  initialData,
  onSubmit,
  submitButtonText = 'Add Accommodation Package',
  isLoading = false,
}: AccommodationFormProps) {
  const [formData, setFormData] = useState<AccommodationData>({
    type: initialData?.type || '',
    price: initialData?.price || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    description: initialData?.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Package Name
        </label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="e.g., Deluxe Package"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Price (₹)
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Total package price"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Start Date
        </label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          End Date
        </label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          min={formData.startDate}
          required
        />
      </div>

      {formData.startDate && formData.endDate && (
        <div className="md:col-span-2">
          <p className="text-sm font-medium text-indigo-600">
            Duration: {calculateDuration(formData.startDate, formData.endDate)} days
          </p>
        </div>
      )}
      
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          rows={3}
          placeholder="Package details, amenities, meals included, etc."
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
