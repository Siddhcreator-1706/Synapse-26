"use client";

import { useState } from "react";

type ParticipationCategory = {
	enabled: boolean;
	fee: number;
	minParticipants?: number;
	maxParticipants?: number;
};

type Event = {
	id: number;
	name: string;
	category: string;
	date: string;
	time: string;
	venue: string;
	rulebookLink: string;
	description?: string;
	imageUrl: string;
	registrationOpen: boolean;
	freeForDau: boolean;
	participationCategories: {
		solo: ParticipationCategory;
		duet: ParticipationCategory;
		group: ParticipationCategory;
	};
};

type EventFormState = {
	name: string;
	category: string;
	date: string;
	time: string;
	rulebookLink: string;
	description: string;
	venue: string;
};

export default function EventsPage() {
	const [events, setEvents] = useState<Event[]>([
		{
			id: 1,
			name: "Hackathon 2025",
			category: "Technical",
			date: "2025-12-20",
			time: "10:00",
			rulebookLink: "https://drive.google.com/...",
			imageUrl: "",
			registrationOpen: true,
			freeForDau: true,
			venue: "Auditorium A",
			participationCategories: {
				solo: { enabled: true, fee: 100 },
				duet: { enabled: true, fee: 200 },
				group: { enabled: false, fee: 500, minParticipants: 3, maxParticipants: 8 },
			},
		},
		{
			id: 2,
			name: "Dance Battle",
			category: "Cultural",
			date: "2025-12-21",
			time: "18:30",
			rulebookLink: "https://drive.google.com/...",
			imageUrl: "",
			registrationOpen: false,
			freeForDau: false,
			venue: "Main Stage",
			participationCategories: {
				solo: { enabled: true, fee: 150 },
				duet: { enabled: true, fee: 250 },
				group: { enabled: true, fee: 800, minParticipants: 4, maxParticipants: 10 },
			},
		},
	]);

	const [formData, setFormData] = useState<EventFormState>({
		name: "",
		category: "Technical",
		date: "",
		time: "",
		rulebookLink: "",
		description: "",
		venue: "",
	});

	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<Event | null>(null);

	const categories = ["Technical", "Cultural", "Sports"];

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setEvents([
			...events,
			{
				id: Date.now(),
				...formData,
				imageUrl: "",
				registrationOpen: true,
				freeForDau: false,
				participationCategories: {
					solo: { enabled: false, fee: 0 },
					duet: { enabled: false, fee: 0 },
					group: { enabled: false, fee: 0, minParticipants: 3, maxParticipants: 8 },
				},
			},
		]);
		setFormData({
			name: "",
			category: "Technical",
			date: "",
			time: "",
			rulebookLink: "",
			description: "",
			venue: "",
		});
	};

	const handleDelete = (id: number) => {
		if (typeof window !== "undefined" && window.confirm("Are you sure?")) {
			setEvents(events.filter((e) => e.id !== id));
		}
	};

	const toggleRegistration = (id: number) => {
		setEvents(
			events.map((event) =>
				event.id === id ? { ...event, registrationOpen: !event.registrationOpen } : event
			)
		);
	};

	const openEditModal = (event: Event) => {
		setEditingEvent({ ...event });
		setIsEditOpen(true);
	};

	const closeEditModal = () => {
		setEditingEvent(null);
		setIsEditOpen(false);
	};

	const handleEditChange = (field: keyof Event, value: any) => {
		if (!editingEvent) return;
		setEditingEvent((prev) => ({
			...prev!,
			[field]: value,
		}));
	};

	const handleParticipationToggle = (type: "solo" | "duet" | "group") => {
		if (!editingEvent) return;
		setEditingEvent((prev) => ({
			...prev!,
			participationCategories: {
				...prev!.participationCategories,
				[type]: {
					...prev!.participationCategories[type],
					enabled: !prev!.participationCategories[type].enabled,
				},
			},
		}));
	};

	const handleParticipationFeeChange = (type: "solo" | "duet" | "group", fee: string) => {
		if (!editingEvent) return;
		setEditingEvent((prev) => ({
			...prev!,
			participationCategories: {
				...prev!.participationCategories,
				[type]: {
					...prev!.participationCategories[type],
					fee: Number(fee),
				},
			},
		}));
	};

	const handleGroupParticipantsChange = (field: "minParticipants" | "maxParticipants", value: string) => {
		if (!editingEvent) return;
		setEditingEvent((prev) => ({
			...prev!,
			participationCategories: {
				...prev!.participationCategories,
				group: {
					...prev!.participationCategories.group,
					[field]: Number(value),
				},
			},
		}));
	};

	const handleEditSave = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!editingEvent) return;
		setEvents((prev) => prev.map((ev) => (ev.id === editingEvent.id ? editingEvent : ev)));
		closeEditModal();
	};

	const getEnabledCategories = (participationCategories: Event["participationCategories"], freeForDau: boolean) => {
		const enabled: string[] = [];
		if (participationCategories.solo.enabled)
			enabled.push(`Solo (₹${participationCategories.solo.fee})`);
		if (participationCategories.duet.enabled)
			enabled.push(`Duet (₹${participationCategories.duet.fee})`);
		if (participationCategories.group.enabled)
			enabled.push(
				`Group ${participationCategories.group.minParticipants}-${participationCategories.group.maxParticipants} (₹${participationCategories.group.fee} fixed)`
			);
		const base = enabled.length > 0 ? enabled.join(", ") : "None";
		return freeForDau ? `${base} | DAU: Free` : base;
	};

	return (
		<div className="space-y-6">
			<header className="flex items-center justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Events</p>
					<h1 className="text-3xl font-bold text-slate-900">Events Management</h1>
				</div>
				<span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800">
					{events.length} events
				</span>
			</header>

			{/* Add Event Form */}
			<section className="rounded-2xl border border-teal-100 bg-white/90 p-6 shadow-lg">
				<div className="mb-4 flex items-center gap-3">
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-bold text-xl">
						+
					</span>
					<div>
						<h2 className="text-xl font-semibold text-slate-900">Add New Event</h2>
						<p className="text-sm text-slate-600">Create a new event for your fest.</p>
					</div>
				</div>
				<form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Event Name</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
							required
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
						<select
							value={formData.category}
							onChange={(e) => setFormData({ ...formData, category: e.target.value })}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
						>
							{categories.map((cat) => (
								<option key={cat}>{cat}</option>
							))}
						</select>
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
						<label className="mb-2 block text-sm font-semibold text-slate-700">Time</label>
						<input
							type="time"
							value={formData.time}
							onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
							placeholder="Auditorium A, Ground, etc."
							required
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Event Picture</label>
						<input
							type="file"
							accept="image/*"
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
						/>
					</div>
					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Rulebook Google Drive Link
						</label>
						<input
							type="url"
							value={formData.rulebookLink}
							onChange={(e) => setFormData({ ...formData, rulebookLink: e.target.value })}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
							placeholder="https://drive.google.com/file/d/..."
						/>
					</div>
					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
						<textarea
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
							rows={3}
						/>
					</div>
					<div className="md:col-span-2 flex items-center justify-end">
						<button
							type="submit"
							className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:from-teal-500 hover:to-cyan-500"
						>
							Add Event
						</button>
					</div>
				</form>
			</section>

			{/* Events Table */}
			<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-lg">
				<div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-white">
					<h2 className="text-lg font-semibold">All Events</h2>
					<span className="text-sm text-white/80">Manage your events</span>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-slate-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
									Registration
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
									Category
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
									Date
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
									Time
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
									Venue
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
									Rulebook
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
									Participation Options
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{events.map((event) => (
								<tr key={event.id} className="transition hover:bg-slate-50">
									<td className="px-6 py-4">
										<button
											onClick={() => toggleRegistration(event.id)}
											className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
												event.registrationOpen ? "bg-green-500" : "bg-gray-300"
											}`}
										>
											<span
												className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
													event.registrationOpen ? "translate-x-6" : "translate-x-1"
												}`}
											/>
										</button>
										<span
											className={`ml-2 text-xs font-semibold ${
												event.registrationOpen ? "text-green-600" : "text-gray-500"
											}`}
										>
											{event.registrationOpen ? "Open" : "Closed"}
										</span>
									</td>
									<td className="px-6 py-4 text-sm font-semibold text-slate-900">{event.name}</td>
									<td className="px-6 py-4">
										<span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
											{event.category}
										</span>
									</td>
									<td className="px-6 py-4 text-sm text-slate-600">{event.date}</td>
									<td className="px-6 py-4 text-sm text-slate-600">{event.time}</td>
									<td className="px-6 py-4 text-sm font-medium text-slate-900">{event.venue}</td>
									<td className="px-6 py-4 text-sm">
										{event.rulebookLink && (
											<a
												href={event.rulebookLink}
												target="_blank"
												rel="noopener noreferrer"
												className="text-indigo-600 hover:underline font-medium"
											>
												View
											</a>
										)}
									</td>
									<td className="px-6 py-4 text-xs text-slate-700">
										{getEnabledCategories(event.participationCategories, event.freeForDau)}
									</td>
									<td className="px-6 py-4 text-sm">
										<div className="flex gap-2">
											<button
												onClick={() => openEditModal(event)}
												className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:from-blue-500 hover:to-indigo-500"
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(event.id)}
												className="rounded-lg bg-gradient-to-r from-rose-500 to-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:from-rose-400 hover:to-red-500"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Edit Modal */}
			{isEditOpen && editingEvent && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
						<div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-white">
							<h3 className="text-lg font-semibold">Edit Event</h3>
							<button onClick={closeEditModal} className="text-2xl leading-none text-white/70 hover:text-white">
								✕
							</button>
						</div>
						<div className="overflow-y-auto max-h-[calc(90vh-80px)]">
							<form onSubmit={handleEditSave} className="space-y-4 p-6">
								<div>
									<label className="mb-2 block text-sm font-semibold text-slate-700">Event Name</label>
									<input
										type="text"
										value={editingEvent.name}
										onChange={(e) => handleEditChange("name", e.target.value)}
										className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
										required
									/>
								</div>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
										<select
											value={editingEvent.category}
											onChange={(e) => handleEditChange("category", e.target.value)}
											className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
										>
											{categories.map((cat) => (
												<option key={cat}>{cat}</option>
											))}
										</select>
									</div>
									<div>
										<label className="mb-2 block text-sm font-semibold text-slate-700">Date</label>
										<input
											type="date"
											value={editingEvent.date}
											onChange={(e) => handleEditChange("date", e.target.value)}
											className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
											required
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<label className="mb-2 block text-sm font-semibold text-slate-700">Time</label>
										<input
											type="time"
											value={editingEvent.time || ""}
											onChange={(e) => handleEditChange("time", e.target.value)}
											className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
											required
										/>
									</div>
									<div>
										<label className="mb-2 block text-sm font-semibold text-slate-700">Venue</label>
										<input
											type="text"
											value={editingEvent.venue || ""}
											onChange={(e) => handleEditChange("venue", e.target.value)}
											className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
											placeholder="Auditorium A, Ground, etc."
											required
										/>
									</div>
								</div>

								{/* Participation Categories */}
								<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
									<h4 className="mb-3 text-sm font-semibold text-slate-700">
										Participation Categories & Fees
									</h4>
									<p className="mb-3 text-xs text-slate-500">
										Select allowed participation types and set their fixed registration fees.
									</p>

									{/* Solo */}
									<div className="mb-3 flex items-center gap-4 border-b pb-3">
										<input
											type="checkbox"
											id="solo"
											checked={editingEvent.participationCategories.solo.enabled}
											onChange={() => handleParticipationToggle("solo")}
											className="h-4 w-4 rounded text-indigo-600"
										/>
										<label htmlFor="solo" className="w-32 text-sm font-medium text-slate-700">
											Solo (1 person)
										</label>
										{editingEvent.participationCategories.solo.enabled && (
											<div className="flex items-center gap-2">
												<span className="text-sm text-slate-600">Fixed Fee:</span>
												<input
													type="number"
													value={editingEvent.participationCategories.solo.fee}
													onChange={(e) => handleParticipationFeeChange("solo", e.target.value)}
													className="w-24 rounded-lg border border-slate-200 px-3 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
													min={0}
												/>
												<span className="text-sm text-slate-600">₹</span>
											</div>
										)}
									</div>

									{/* Duet */}
									<div className="mb-3 flex items-center gap-4 border-b pb-3">
										<input
											type="checkbox"
											id="duet"
											checked={editingEvent.participationCategories.duet.enabled}
											onChange={() => handleParticipationToggle("duet")}
											className="h-4 w-4 rounded text-indigo-600"
										/>
										<label htmlFor="duet" className="w-32 text-sm font-medium text-slate-700">
											Duet (2 persons)
										</label>
										{editingEvent.participationCategories.duet.enabled && (
											<div className="flex items-center gap-2">
												<span className="text-sm text-slate-600">Fixed Fee:</span>
												<input
													type="number"
													value={editingEvent.participationCategories.duet.fee}
													onChange={(e) => handleParticipationFeeChange("duet", e.target.value)}
													className="w-24 rounded-lg border border-slate-200 px-3 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
													min={0}
												/>
												<span className="text-sm text-slate-600">₹</span>
											</div>
										)}
									</div>

									{/* Group/Team */}
									<div className="flex items-start gap-4">
										<input
											type="checkbox"
											id="group"
											checked={editingEvent.participationCategories.group.enabled}
											onChange={() => handleParticipationToggle("group")}
											className="mt-1 h-4 w-4 rounded text-indigo-600"
										/>
										<div className="flex-1">
											<label htmlFor="group" className="mb-2 block text-sm font-medium text-slate-700">
												Team (Custom Range)
											</label>
											{editingEvent.participationCategories.group.enabled && (
												<div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
													<div className="grid grid-cols-2 gap-3">
														<div>
															<label className="mb-1 block text-xs text-slate-600">
																Min Participants
															</label>
															<input
																type="number"
																value={editingEvent.participationCategories.group.minParticipants}
																onChange={(e) =>
																	handleGroupParticipantsChange("minParticipants", e.target.value)
																}
																className="w-full rounded-lg border border-slate-200 px-3 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
																min={3}
																max={editingEvent.participationCategories.group.maxParticipants}
															/>
														</div>
														<div>
															<label className="mb-1 block text-xs text-slate-600">
																Max Participants
															</label>
															<input
																type="number"
																value={editingEvent.participationCategories.group.maxParticipants}
																onChange={(e) =>
																	handleGroupParticipantsChange("maxParticipants", e.target.value)
																}
																className="w-full rounded-lg border border-slate-200 px-3 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
																min={editingEvent.participationCategories.group.minParticipants}
																max={20}
															/>
														</div>
													</div>
													<div className="flex items-center gap-2">
														<span className="text-sm text-slate-600">Fixed Team Fee:</span>
														<input
															type="number"
															value={editingEvent.participationCategories.group.fee}
															onChange={(e) => handleParticipationFeeChange("group", e.target.value)}
															className="w-24 rounded-lg border border-slate-200 px-3 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
															min={0}
														/>
														<span className="text-sm text-slate-600">₹</span>
													</div>
													<p className="text-xs italic text-slate-500">
														Dropdown will show {editingEvent.participationCategories.group.minParticipants}{" "}
														to {editingEvent.participationCategories.group.maxParticipants} participants.{" "}
														<strong>Fee is FIXED regardless of team size.</strong>
													</p>
													<p className="text-xs text-green-600">
														Example: Team of {editingEvent.participationCategories.group.minParticipants}-
														{editingEvent.participationCategories.group.maxParticipants} = ₹
														{editingEvent.participationCategories.group.fee} (fixed)
													</p>
												</div>
											)}
										</div>
									</div>
								</div>

								<div>
									<label className="mb-2 block text-sm font-semibold text-slate-700">
										Rulebook Google Drive Link
									</label>
									<input
										type="url"
										value={editingEvent.rulebookLink}
										onChange={(e) => handleEditChange("rulebookLink", e.target.value)}
										className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
										placeholder="https://drive.google.com/file/d/..."
									/>
								</div>
								<div>
									<label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
									<textarea
										value={editingEvent.description || ""}
										onChange={(e) => handleEditChange("description", e.target.value)}
										className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
										rows={3}
									/>
								</div>

								{/* Registration Toggle */}
								<div className="flex items-center gap-3 pt-2">
									<span className="text-sm font-medium text-slate-700">Allow Registrations</span>
									<button
										type="button"
										onClick={() => handleEditChange("registrationOpen", !editingEvent.registrationOpen)}
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
											editingEvent.registrationOpen ? "bg-green-500" : "bg-gray-300"
										}`}
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
												editingEvent.registrationOpen ? "translate-x-6" : "translate-x-1"
											}`}
										/>
									</button>
									<span
										className={`text-xs font-semibold ${
											editingEvent.registrationOpen ? "text-green-600" : "text-gray-500"
										}`}
									>
										{editingEvent.registrationOpen ? "Open" : "Closed"}
									</span>
								</div>

								{/* Free for DAU toggle */}
								<div className="flex items-center gap-3 pt-2">
									<span className="text-sm font-medium text-slate-700">Free for DAU Students (@dau.ac.in)</span>
									<button
										type="button"
										onClick={() => handleEditChange("freeForDau", !editingEvent.freeForDau)}
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
											editingEvent.freeForDau ? "bg-green-500" : "bg-gray-300"
										}`}
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
												editingEvent.freeForDau ? "translate-x-6" : "translate-x-1"
											}`}
										/>
									</button>
									<span
										className={`text-xs font-semibold ${
											editingEvent.freeForDau ? "text-green-600" : "text-gray-500"
										}`}
									>
										{editingEvent.freeForDau ? "DAU Free" : "Normal Charges"}
									</span>
								</div>

								{/* Buttons */}
								<div className="flex justify-end gap-3 border-t pt-4">
									<button
										type="button"
										onClick={closeEditModal}
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
				</div>
			)}
		</div>
	);
}
