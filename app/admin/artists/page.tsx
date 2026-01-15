'use client';

import { useState } from 'react';
import Link from 'next/link';
import ArtistTable from '@/components/admin/tables/ArtistTable';

interface Artist {
  id: number;
  name: string;
  concertNight: string;
  genre: string;
  revealDate: string;
  bio: string;
}

const initialArtists: Artist[] = [
  {
    id: 1,
    name: 'DJ Shadow',
    concertNight: 'Night 1 - EDM Night',
    genre: 'EDM',
    revealDate: '2025-12-18',
    bio: 'International EDM artist',
  },
  {
    id: 2,
    name: 'The Rock Band',
    concertNight: 'Night 2 - Rock Night',
    genre: 'Rock',
    revealDate: '2025-12-20',
    bio: 'Famous rock band from India',
  },
];

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = (id: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setArtists((prev) => prev.filter((artist) => artist.id !== id));
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Artists Management</h1>
        <Link
          href="/admin/artists/new"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Add New Artist
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">All Artists</h2>
        <ArtistTable artists={artists} onDelete={handleDelete} isLoading={isLoading} />
      </div>
    </div>
  );
}
