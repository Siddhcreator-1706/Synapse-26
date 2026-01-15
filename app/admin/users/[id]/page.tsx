"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type UserFormData = {
  name: string;
  email: string;
  phone: string;
  college: string;
  events: string[];
};

type PageProps = {
  params: { id: string };
};

export default function EditUserPage({ params }: PageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<UserFormData>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    college: 'ABC College',
    events: ['Hackathon 2025', 'Dance Battle'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating user:', params.id, formData);
    router.push('/admin/users');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/users')}
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
        >
          ← Back to Users
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit User #{params.id}</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College *
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registered Events
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.events.map((event, idx) => (
                <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  {event}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push('/admin/users')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
