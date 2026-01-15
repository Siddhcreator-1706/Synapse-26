"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type ExportFormat = 'csv' | 'json' | 'excel';
type ExportScope = 'all' | 'paid' | 'pending';

type ExportOptions = {
  format: ExportFormat;
  scope: ExportScope;
  includeFinancials: boolean;
  includeGatewayCharges: boolean;
  filterByEvent: string;
  dateRange: {
    start: string;
    end: string;
  };
};

const availableEvents = [
  'All Events',
  'Hackathon 2025',
  'Dance Battle',
  'Coding Competition',
  'Robotics Workshop',
  'Gaming Tournament',
];

export default function ExportRegistrationsPage() {
  const router = useRouter();
  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    scope: 'all',
    includeFinancials: true,
    includeGatewayCharges: true,
    filterByEvent: 'All Events',
    dateRange: {
      start: '',
      end: '',
    },
  });

  const handleExport = () => {
    console.log('Exporting registrations with options:', options);
    alert(`Exporting ${options.scope} registrations as ${options.format.toUpperCase()}...`);
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/registrations')}
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
        >
          ← Back to Registrations
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Export Registrations</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <div className="space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['csv', 'json', 'excel'] as ExportFormat[]).map((format) => (
                <label
                  key={format}
                  className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    options.format === format
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={options.format === format}
                    onChange={(e) => setOptions({ ...options, format: e.target.value as ExportFormat })}
                    className="sr-only"
                  />
                  <span className="font-medium">{format.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Registration Scope *
            </label>
            <div className="space-y-2">
              {(['all', 'paid', 'pending'] as ExportScope[]).map((scope) => (
                <label key={scope} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="scope"
                    value={scope}
                    checked={options.scope === scope}
                    onChange={(e) => setOptions({ ...options, scope: e.target.value as ExportScope })}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 capitalize">
                    {scope === 'all' ? 'All Registrations' : `${scope.charAt(0).toUpperCase() + scope.slice(1)} Only`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Date Range (Optional)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={options.dateRange.start}
                  onChange={(e) => setOptions({ ...options, dateRange: { ...options.dateRange, start: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={options.dateRange.end}
                  onChange={(e) => setOptions({ ...options, dateRange: { ...options.dateRange, end: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
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
              Additional Data
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeFinancials}
                  onChange={(e) => setOptions({ ...options, includeFinancials: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <div>
                  <span className="text-gray-700">Financial Breakdown</span>
                  <p className="text-xs text-gray-500">Includes payment amounts, methods, and transaction IDs</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeGatewayCharges}
                  onChange={(e) => setOptions({ ...options, includeGatewayCharges: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <div>
                  <span className="text-gray-700">Gateway Charges & Net Revenue</span>
                  <p className="text-xs text-gray-500">Calculates fees and net amounts for paid registrations</p>
                </div>
              </label>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Export Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Format:</span>
                <span className="ml-2 font-medium">{options.format.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-gray-600">Scope:</span>
                <span className="ml-2 font-medium capitalize">{options.scope}</span>
              </div>
              <div>
                <span className="text-gray-600">Event Filter:</span>
                <span className="ml-2 font-medium">{options.filterByEvent}</span>
              </div>
              <div>
                <span className="text-gray-600">Date Range:</span>
                <span className="ml-2 font-medium">
                  {options.dateRange.start && options.dateRange.end
                    ? `${options.dateRange.start} to ${options.dateRange.end}`
                    : 'All Time'}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t text-sm">
              <div className="flex gap-4">
                <span className={options.includeFinancials ? 'text-green-600' : 'text-gray-400'}>
                  {options.includeFinancials ? '✓' : '✗'} Financials
                </span>
                <span className={options.includeGatewayCharges ? 'text-green-600' : 'text-gray-400'}>
                  {options.includeGatewayCharges ? '✓' : '✗'} Gateway Charges
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              onClick={() => router.push('/admin/registrations')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <span>📥</span>
              Export Registrations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
