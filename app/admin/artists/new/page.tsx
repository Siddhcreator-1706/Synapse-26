'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArtistForm from '@/components/admin/forms/ArtistForm';

interface ArtistData {
  name: string;
  concertNight: string;
  genre: string;
  revealDate: string;
  bio: string;
}

export default function CreateArtistPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ArtistData) => {
    setIsLoading(true);
    try {
      // await fetch('/api/admin/artists', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push('/admin/artists');
    } catch (error) {
      console.error('Error creating artist:', error);
      alert('Failed to create artist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/artists" className="text-indigo-600 hover:text-indigo-700">
          ← Back to Artists
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Create Artist</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ArtistForm onSubmit={handleSubmit} submitButtonText="Create Artist" isLoading={isLoading} />
      </div>
    </div>
  );
}
