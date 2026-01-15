'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AccommodationForm from '@/components/admin/forms/AccommodationForm';

interface AccommodationData {
  type: string;
  price: string | number;
  startDate: string;
  endDate: string;
  description: string;
}

export default function CreateAccommodationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: AccommodationData) => {
    setIsLoading(true);
    try {
      // Call your API endpoint here
      // const response = await fetch('/api/admin/accommodation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On success, redirect to list
      router.push('/admin/accommodation');
    } catch (error) {
      console.error('Error creating accommodation:', error);
      alert('Failed to create accommodation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/accommodation" className="text-indigo-600 hover:text-indigo-700">
          ← Back to Accommodations
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Create Accommodation Package</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <AccommodationForm
          onSubmit={handleSubmit}
          submitButtonText="Create Package"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
