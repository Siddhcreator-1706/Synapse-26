'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ArtistForm from '@/components/admin/forms/ArtistForm';

interface ArtistData {
  name: string;
  concertNight: string;
  genre: string;
  revealDate: string;
  bio: string;
}

interface Artist extends ArtistData {
  id: number;
}

export default function EditArtistPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    // Example fetch
    // const fetchArtist = async () => {
    //   const res = await fetch(`/api/admin/artists/${id}`);
    //   const data = await res.json();
    //   setArtist(data);
    //   setIsLoadingData(false);
    // };
    // fetchArtist();

    setTimeout(() => {
      setArtist({
        id: Number(id),
        name: 'DJ Shadow',
        concertNight: 'Night 1 - EDM Night',
        genre: 'EDM',
        revealDate: '2025-12-18',
        bio: 'International EDM artist',
      });
      setIsLoadingData(false);
    }, 400);
  }, [id]);

  const handleSubmit = async (data: ArtistData) => {
    setIsLoading(true);
    try {
      // await fetch(`/api/admin/artists/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push('/admin/artists');
    } catch (error) {
      console.error('Error updating artist:', error);
      alert('Failed to update artist');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Artist not found</p>
        <Link href="/admin/artists" className="text-indigo-600 hover:text-indigo-700">
          Back to Artists
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/artists" className="text-indigo-600 hover:text-indigo-700">
          ← Back to Artists
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Edit Artist</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ArtistForm
          initialData={artist}
          onSubmit={handleSubmit}
          submitButtonText="Update Artist"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
