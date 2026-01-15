'use client';

import Link from 'next/link';

interface Artist {
  id: number;
  name: string;
  concertNight: string;
  genre: string;
  revealDate: string;
  bio: string;
}

interface ArtistTableProps {
  artists: Artist[];
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const isRevealed = (revealDate: string) => new Date(revealDate) <= new Date();

export default function ArtistTable({ artists, onDelete, isLoading = false }: ArtistTableProps) {
  if (!artists.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No artists found</p>
        <Link
          href="/admin/artists/new"
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add First Artist
        </Link>
      </div>
    );
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure?')) {
      onDelete(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artist</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concert Night</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Genre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reveal Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {artists.map((artist) => (
            <tr key={artist.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{artist.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{artist.concertNight}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{artist.genre}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{artist.revealDate}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    isRevealed(artist.revealDate)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {isRevealed(artist.revealDate) ? '👁️ Visible' : '🔒 Hidden'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm flex gap-3 items-center">
                <Link
                  href={`/admin/artists/${artist.id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(artist.id)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
