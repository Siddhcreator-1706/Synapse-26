'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AccommodationTable from '@/components/admin/tables/AccommodationTable';

interface Accommodation {
  id: number;
  type: string;
  price: number;
  startDate: string;
  endDate: string;
  available: boolean;
  description: string;
}

export default function AccommodationPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([
    {
      id: 1,
      type: 'Deluxe Package',
      price: 5000,
      startDate: '2025-12-20',
      endDate: '2025-12-24',
      available: true,
      description: '4 days accommodation with meals',
    },
    {
      id: 2,
      type: 'Standard Package',
      price: 3000,
      startDate: '2025-12-21',
      endDate: '2025-12-23',
      available: true,
      description: '3 days accommodation',
    },
    {
      id: 3,
      type: 'Budget Package',
      price: 1500,
      startDate: '2025-12-22',
      endDate: '2025-12-24',
      available: false,
      description: '2 days basic accommodation',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleToggleAvailability = (id: number) => {
    setAccommodations(
      accommodations.map((acc) =>
        acc.id === id ? { ...acc, available: !acc.available } : acc
      )
    );
  };

  const handleDelete = (id: number) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAccommodations(accommodations.filter((a) => a.id !== id));
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Accommodation Management</h1>
        <Link
          href="/admin/accommodation/new"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Add New Package
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">All Accommodation Packages</h2>
        <AccommodationTable
          accommodations={accommodations}
          onToggleAvailability={handleToggleAvailability}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
