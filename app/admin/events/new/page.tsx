"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ParticipationCategory = {
	enabled: boolean;
	fee: number;
	minParticipants?: number;
	maxParticipants?: number;
};

type EventFormData = {
	name: string;
	category: string;
	date: string;
	time: string;
	venue: string;
	rulebookLink: string;
	description: string;
	imageUrl: string;
	registrationOpen: boolean;
	freeForDau: boolean;
	participationCategories: {
		solo: ParticipationCategory;
		duet: ParticipationCategory;
		group: ParticipationCategory;
	};
};

export default function CreateEventPage() {
	const router = useRouter();
	const [previewImage, setPreviewImage] = useState("");

	const [formData, setFormData] = useState<EventFormData>({
		name: "",
		category: "Technical",
		date: "",
		time: "",
		venue: "",
		rulebookLink: "",
		description: "",
		imageUrl: "",
		registrationOpen: true,
		freeForDau: false,
		participationCategories: {
			solo: { enabled: false, fee: 0 },
			duet: { enabled: false, fee: 0 },
			group: { enabled: false, fee: 0, minParticipants: 3, maxParticipants: 8 },
		},
	});

	const categories = ["Technical", "Cultural", "Sports"];

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setPreviewImage(url);
			setFormData({ ...formData, imageUrl: url });
		}
	};

	const handleParticipationToggle = (type: "solo" | "duet" | "group") => {
		setFormData((prev) => ({
			...prev,
			participationCategories: {
				...prev.participationCategories,
				[type]: {
					...prev.participationCategories[type],
					enabled: !prev.participationCategories[type].enabled,
				},
			},
		}));
	};

	const handleParticipationFeeChange = (type: "solo" | "duet" | "group", fee: string) => {
		setFormData((prev) => ({
			...prev,
			participationCategories: {
				...prev.participationCategories,
				[type]: {
					...prev.participationCategories[type],
					fee: Number(fee),
				},
			},
		}));
	};

	const handleGroupParticipantsChange = (field: "minParticipants" | "maxParticipants", value: string) => {
		setFormData((prev) => ({
			...prev,
			participationCategories: {
				...prev.participationCategories,
				group: {
					...prev.participationCategories.group,
					[field]: Number(value),
				},
			},
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// TODO: Add API call to save event
		console.log("Creating event:", formData);
		// Redirect back to events list
		router.push("/admin/events");
	};

	return (
		<div className="space-y-6">
			<header>
				<p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Events</p>
				<h1 className="text-3xl font-bold text-slate-900">Create New Event</h1>
			</header>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Information */}
				<section className="rounded-2xl border border-teal-100 bg-white/90 p-6 shadow-lg">
					<h2 className="mb-4 text-xl font-semibold text-slate-900">Basic Information</h2>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
								onChange={handleImageChange}
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
					</div>

					{/* Image Preview */}
					{previewImage && (
						<div className="mt-4">
							<label className="mb-2 block text-sm font-semibold text-slate-700">Image Preview</label>
							<img
								src={previewImage}
								alt="Event preview"
								className="h-48 w-auto rounded-lg border border-slate-200 object-cover"
							/>
						</div>
					)}
				</section>

				{/* Participation Categories */}
				<section className="rounded-2xl border border-teal-100 bg-white/90 p-6 shadow-lg">
					<h2 className="mb-4 text-xl font-semibold text-slate-900">
						Participation Categories & Fees
					</h2>
					<p className="mb-4 text-sm text-slate-600">
						Select allowed participation types and set their fixed registration fees.
					</p>

					{/* Solo */}
					<div className="mb-4 flex items-center gap-4 border-b pb-4">
						<input
							type="checkbox"
							id="solo"
							checked={formData.participationCategories.solo.enabled}
							onChange={() => handleParticipationToggle("solo")}
							className="h-4 w-4 rounded text-indigo-600"
						/>
						<label htmlFor="solo" className="w-32 text-sm font-medium text-slate-700">
							Solo (1 person)
						</label>
						{formData.participationCategories.solo.enabled && (
							<div className="flex items-center gap-2">
								<span className="text-sm text-slate-600">Fixed Fee:</span>
								<input
									type="number"
									value={formData.participationCategories.solo.fee}
									onChange={(e) => handleParticipationFeeChange("solo", e.target.value)}
									className="w-24 rounded-lg border border-slate-200 px-3 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
									min={0}
								/>
								<span className="text-sm text-slate-600">₹</span>
							</div>
						)}
					</div>

					{/* Duet */}
					<div className="mb-4 flex items-center gap-4 border-b pb-4">
						<input
							type="checkbox"
							id="duet"
							checked={formData.participationCategories.duet.enabled}
							onChange={() => handleParticipationToggle("duet")}
							className="h-4 w-4 rounded text-indigo-600"
						/>
						<label htmlFor="duet" className="w-32 text-sm font-medium text-slate-700">
							Duet (2 persons)
						</label>
						{formData.participationCategories.duet.enabled && (
							<div className="flex items-center gap-2">
								<span className="text-sm text-slate-600">Fixed Fee:</span>
								<input
									type="number"
									value={formData.participationCategories.duet.fee}
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
							checked={formData.participationCategories.group.enabled}
							onChange={() => handleParticipationToggle("group")}
							className="mt-1 h-4 w-4 rounded text-indigo-600"
						/>
						<div className="flex-1">
							<label htmlFor="group" className="mb-2 block text-sm font-medium text-slate-700">
								Team (Custom Range)
							</label>
							{formData.participationCategories.group.enabled && (
								<div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className="mb-1 block text-xs text-slate-600">
												Min Participants
											</label>
											<input
												type="number"
												value={formData.participationCategories.group.minParticipants}
												onChange={(e) =>
													handleGroupParticipantsChange("minParticipants", e.target.value)
												}
												className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
												min={3}
												max={formData.participationCategories.group.maxParticipants}
											/>
										</div>
										<div>
											<label className="mb-1 block text-xs text-slate-600">
												Max Participants
											</label>
											<input
												type="number"
												value={formData.participationCategories.group.maxParticipants}
												onChange={(e) =>
													handleGroupParticipantsChange("maxParticipants", e.target.value)
												}
												className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
												min={formData.participationCategories.group.minParticipants}
												max={20}
											/>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-sm text-slate-600">Fixed Team Fee:</span>
										<input
											type="number"
											value={formData.participationCategories.group.fee}
											onChange={(e) => handleParticipationFeeChange("group", e.target.value)}
											className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
											min={0}
										/>
										<span className="text-sm text-slate-600">₹</span>
									</div>
									<p className="text-xs italic text-slate-500">
										Dropdown will show {formData.participationCategories.group.minParticipants}{" "}
										to {formData.participationCategories.group.maxParticipants} participants.{" "}
										<strong>Fee is FIXED regardless of team size.</strong>
									</p>
									<p className="text-xs text-green-600">
										Example: Team of {formData.participationCategories.group.minParticipants}-
										{formData.participationCategories.group.maxParticipants} = ₹
										{formData.participationCategories.group.fee} (fixed)
									</p>
								</div>
							)}
						</div>
					</div>
				</section>

				{/* Settings */}
				<section className="rounded-2xl border border-teal-100 bg-white/90 p-6 shadow-lg">
					<h2 className="mb-4 text-xl font-semibold text-slate-900">Event Settings</h2>

					{/* Registration Toggle */}
					<div className="mb-4 flex items-center gap-3">
						<span className="text-sm font-medium text-slate-700">Allow Registrations</span>
						<button
							type="button"
							onClick={() =>
								setFormData({ ...formData, registrationOpen: !formData.registrationOpen })
							}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								formData.registrationOpen ? "bg-green-500" : "bg-gray-300"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									formData.registrationOpen ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
						<span
							className={`text-xs font-semibold ${
								formData.registrationOpen ? "text-green-600" : "text-gray-500"
							}`}
						>
							{formData.registrationOpen ? "Open" : "Closed"}
						</span>
					</div>

					{/* Free for DAU toggle */}
					<div className="flex items-center gap-3">
						<span className="text-sm font-medium text-slate-700">
							Free for DAU Students (@dau.ac.in)
						</span>
						<button
							type="button"
							onClick={() => setFormData({ ...formData, freeForDau: !formData.freeForDau })}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								formData.freeForDau ? "bg-green-500" : "bg-gray-300"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									formData.freeForDau ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
						<span
							className={`text-xs font-semibold ${
								formData.freeForDau ? "text-green-600" : "text-gray-500"
							}`}
						>
							{formData.freeForDau ? "DAU Free" : "Normal Charges"}
						</span>
					</div>
				</section>

				{/* Action Buttons */}
				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={() => router.push("/admin/events")}
						className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:from-teal-500 hover:to-cyan-500"
					>
						Create Event
					</button>
				</div>
			</form>
		</div>
	);
}
