"use client";

import { useMemo, useState } from "react";

type Concert = {
  id: number;
  name: string;
  date: string;
  venue: string;
  timing: string;
};

type ConcertFormState = Pick<Concert, "name" | "date" | "venue" | "timing">;

export default function ConcertsPage() {
  const [concerts, setConcerts] = useState<Concert[]>([
    {
      id: 1,
      name: "Night 1 - EDM Night",
      date: "2025-12-22",
      venue: "Main Ground",
      timing: "7:00 PM - 11:00 PM",
    },
    {
      id: 2,
      name: "Night 2 - Rock Night",
      date: "2025-12-23",
      venue: "Main Ground",
      timing: "7:00 PM - 11:00 PM",
    },
  ]);

  const [formData, setFormData] = useState<ConcertFormState>({
    name: "",
    date: "",
    venue: "",
    timing: "",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<ConcertFormState>({
    name: "",
    date: "",
    venue: "",
    timing: "",
  });

  const nextId = useMemo(() => Date.now(), []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConcerts((prev) => [...prev, { id: nextId + prev.length, ...formData }]);
    setFormData({ name: "", date: "", venue: "", timing: "" });
  };

  const handleDelete = (id: number) => {
    if (typeof window !== "undefined" && window.confirm("Are you sure?")) {
      setConcerts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleEditClick = (concert: Concert) => {
    setEditingId(concert.id);
    setEditData({
      name: concert.name,
      date: concert.date,
      venue: concert.venue,
      timing: concert.timing,
    });
    setIsEditOpen(true);
  };

  const handleEditSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;
    setConcerts((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...editData } : c)));
    setIsEditOpen(false);
    setEditingId(null);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Concerts</p>
          <h1 className="text-3xl font-bold text-slate-900">Concert Nights</h1>
        </div>
        <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800">
          {concerts.length} total
        </span>
      </header>

      <section className="rounded-2xl border border-teal-100 bg-white/90 p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-bold">
            +
          </span>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Add New Concert Night</h2>
            <p className="text-sm text-slate-600">Keep your concert lineup up to date.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Concert Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              placeholder="e.g., Night 1 - EDM Night"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Venue</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Timing</label>
            <input
              type="text"
              value={formData.timing}
              onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              placeholder="e.g., 7:00 PM - 11:00 PM"
              required
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:from-teal-500 hover:to-cyan-500"
            >
              Add Concert Night
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <h2 className="text-lg font-semibold">All Concert Nights</h2>
          <span className="text-sm text-white/80">Manage and edit your lineup</span>
        </div>
        <div className="divide-y divide-slate-100">
          {concerts.map((concert) => (
            <div key={concert.id} className="flex flex-col gap-3 px-6 py-4 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{concert.name}</h3>
                <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-700">
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 font-medium text-teal-700">📅 {concert.date}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 font-medium text-cyan-700">📍 {concert.venue}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700">🕐 {concert.timing}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(concert)}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:from-blue-500 hover:to-indigo-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(concert.id)}
                  className="rounded-lg bg-gradient-to-r from-rose-500 to-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:from-rose-400 hover:to-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-white">
              <h2 className="text-lg font-semibold">Edit Concert Night</h2>
              <button
                onClick={handleEditClose}
                className="text-2xl leading-none text-white/70 hover:text-white"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Concert Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Date</label>
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Venue</label>
                <input
                  type="text"
                  value={editData.venue}
                  onChange={(e) => setEditData({ ...editData, venue: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Timing</label>
                <input
                  type="text"
                  value={editData.timing}
                  onChange={(e) => setEditData({ ...editData, timing: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="e.g., 7:00 PM - 11:00 PM"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleEditClose}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:from-indigo-500 hover:to-purple-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
