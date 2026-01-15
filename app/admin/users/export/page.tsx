"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type ExportFormat = 'csv' | 'json' | 'excel';

type ExportOptions = {
  format: ExportFormat;
  includeEvents: boolean;
  includeContactInfo: boolean;
  filterByEvent: string;
};

const availableEvents = [
  'All Events',
  'Hackathon 2025',
  'Dance Battle',
  'Coding Competition',
  'Robotics Workshop',
  'Gaming Tournament',
];

export default function ExportUsersPage() {
  const router = useRouter();
  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    includeEvents: true,
    includeContactInfo: true,
    filterByEvent: 'All Events',
  });

  const handleExport = () => {
    console.log('Exporting with options:', options);
    alert(`Exporting users as ${options.format.toUpperCase()}...`);
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

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Export Users</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format *
            </label>
            <div className="space-y-2">
              {(['csv', 'json', 'excel'] as ExportFormat[]).map((format) => (
                <label key={format} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={options.format === format}
                    onChange={(e) => setOptions({ ...options, format: e.target.value as ExportFormat })}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">{format.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter by Event */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Event
            </label>
            <select
              value={options.filterByEvent}
              onChange={(e) => setOptions({ ...options, filterByEvent: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {availableEvents.map((event) => (
                <option key={event} value={event}>
                  {event}
                </option>
              ))}
            </select>
          </div>

          {/* Include Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Include in Export
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeEvents}
                  onChange={(e) => setOptions({ ...options, includeEvents: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700">Event Registration Details</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeContactInfo}
                  onChange={(e) => setOptions({ ...options, includeContactInfo: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700">Contact Information (Phone, Email)</span>
              </label>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Export Summary</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Format: <span className="font-medium">{options.format.toUpperCase()}</span></li>
              <li>• Event Filter: <span className="font-medium">{options.filterByEvent}</span></li>
              <li>• Events Data: <span className="font-medium">{options.includeEvents ? 'Yes' : 'No'}</span></li>
              <li>• Contact Info: <span className="font-medium">{options.includeContactInfo ? 'Yes' : 'No'}</span></li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              onClick={() => router.push('/admin/users')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <span>📥</span>
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
