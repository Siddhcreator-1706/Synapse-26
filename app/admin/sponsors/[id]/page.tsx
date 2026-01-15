"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Sponsor = {
	id: number;
	name: string;
	tier: string;
	customTier: string;
	website: string;
	logoUrl: string;
};

export default function EditSponsorPage() {
	const params = useParams();
	const router = useRouter();
	const sponsorId = params.id;

	const predefinedTiers = ["Platinum", "Gold", "Silver", "Bronze"];
	const tiers = [...predefinedTiers, "Other"];

	// Mock data - in real app, fetch based on sponsorId
	const mockSponsor = {
		id: Number(sponsorId),
		name: "Tech Corp",
		tier: "Platinum",
		website: "https://techcorp.com",
		logoUrl: "",
	};

	// Check if tier is a predefined one or custom
	const isCustomTier = !predefinedTiers.includes(mockSponsor.tier);

	const [editingSponsor, setEditingSponsor] = useState<Sponsor>({
		...mockSponsor,
		tier: isCustomTier ? "Other" : mockSponsor.tier,
		customTier: isCustomTier ? mockSponsor.tier : "",
	});

	const handleEditSave = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (editingSponsor.tier === "Other" && !editingSponsor.customTier.trim()) {
			if (typeof window !== "undefined") {
				window.alert("Please enter a custom tier name");
			}
			return;
		}
		const finalTier =
			editingSponsor.tier === "Other" ? editingSponsor.customTier : editingSponsor.tier;
		// TODO: Save to database/API
		console.log("Updating sponsor:", { ...editingSponsor, tier: finalTier });
		router.push("/admin/sponsors");
	};

	return (
		<div className="space-y-6">
			<header>
				<Link
					href="/admin/sponsors"
					className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
				>
					← Back to Sponsors
				</Link>
				<h1 className="text-3xl font-bold text-slate-900">Edit Sponsor</h1>
			</header>

			{/* Edit Form */}
			<div className="rounded-2xl border border-amber-100 bg-white/90 p-6 shadow-lg backdrop-blur">
				<div className="mb-6 flex items-center gap-3">
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xl font-bold text-white">
						✏️
					</span>
					<div>
						<h2 className="text-xl font-semibold text-slate-900">Sponsor Details</h2>
						<p className="text-sm text-slate-600">Update the information below to edit this sponsor</p>
					</div>
				</div>
				<form onSubmit={handleEditSave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Sponsor Name
						</label>
						<input
							type="text"
							value={editingSponsor.name}
							onChange={(e) =>
								setEditingSponsor({ ...editingSponsor, name: e.target.value })
							}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							required
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Tier</label>
						<select
							value={editingSponsor.tier}
							onChange={(e) =>
								setEditingSponsor({
									...editingSponsor,
									tier: e.target.value,
									customTier: "",
								})
							}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						>
							{tiers.map((tier) => (
								<option key={tier}>{tier}</option>
							))}
						</select>
					</div>

					{/* Custom Tier Input for Edit */}
					{editingSponsor.tier === "Other" && (
						<div className="md:col-span-2">
							<label className="mb-2 block text-sm font-semibold text-slate-700">
								Custom Tier Name
							</label>
							<input
								type="text"
								value={editingSponsor.customTier}
								onChange={(e) =>
									setEditingSponsor({ ...editingSponsor, customTier: e.target.value })
								}
								className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
								placeholder="Enter custom tier name"
								required
							/>
						</div>
					)}

					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Website URL
						</label>
						<input
							type="url"
							value={editingSponsor.website}
							onChange={(e) =>
								setEditingSponsor({ ...editingSponsor, website: e.target.value })
							}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							placeholder="https://example.com"
						/>
					</div>

					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Logo Upload
						</label>
						<input
							type="file"
							accept="image/*"
							className="block w-full cursor-pointer rounded-lg border border-slate-200 text-sm text-slate-500 shadow-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-blue-50 file:to-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:from-blue-100 hover:file:to-indigo-100"
						/>
					</div>

					<div className="md:col-span-2 flex justify-end gap-3 border-t border-slate-200 pt-4">
						<Link
							href="/admin/sponsors"
							className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
						>
							Cancel
						</Link>
						<button
							type="submit"
							className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-blue-500 hover:to-indigo-500"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
