"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormData = {
	name: string;
	tier: string;
	customTier: string;
	website: string;
};

export default function CreateSponsorPage() {
	const router = useRouter();
	const [formData, setFormData] = useState<FormData>({
		name: "",
		tier: "Platinum",
		customTier: "",
		website: "",
	});

	const tiers = ["Platinum", "Gold", "Silver", "Bronze", "Other"];

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (formData.tier === "Other" && !formData.customTier.trim()) {
			if (typeof window !== "undefined") {
				window.alert("Please enter a custom tier name");
			}
			return;
		}
		const finalTier = formData.tier === "Other" ? formData.customTier : formData.tier;
		// TODO: Save to database/API
		console.log("Creating sponsor:", { ...formData, tier: finalTier });
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
				<h1 className="text-3xl font-bold text-slate-900">Add New Sponsor</h1>
			</header>

			{/* Add Sponsor Form */}
			<div className="rounded-2xl border border-amber-100 bg-white/90 p-6 shadow-lg backdrop-blur">
				<div className="mb-6 flex items-center gap-3">
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-xl font-bold text-white">
						+
					</span>
					<div>
						<h2 className="text-xl font-semibold text-slate-900">Sponsor Details</h2>
						<p className="text-sm text-slate-600">Fill in the information below to add a new sponsor</p>
					</div>
				</div>
				<form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Sponsor Name
						</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
							placeholder="e.g., Tech Corp"
							required
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">Tier</label>
						<select
							value={formData.tier}
							onChange={(e) =>
								setFormData({ ...formData, tier: e.target.value, customTier: "" })
							}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
						>
							{tiers.map((tier) => (
								<option key={tier}>{tier}</option>
							))}
						</select>
					</div>

					{/* Custom Tier Input - Only shows when "Other" is selected */}
					{formData.tier === "Other" && (
						<div className="md:col-span-2">
							<label className="mb-2 block text-sm font-semibold text-slate-700">
								Custom Tier Name
							</label>
							<input
								type="text"
								value={formData.customTier}
								onChange={(e) =>
									setFormData({ ...formData, customTier: e.target.value })
								}
								className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
								placeholder="Enter custom tier name (e.g., Diamond, Supporter)"
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
							value={formData.website}
							onChange={(e) => setFormData({ ...formData, website: e.target.value })}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
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
							className="block w-full cursor-pointer rounded-lg border border-slate-200 text-sm text-slate-500 shadow-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-amber-50 file:to-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-700 hover:file:from-amber-100 hover:file:to-orange-100"
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
							className="rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-amber-500 hover:to-orange-500 hover:shadow-xl"
						>
							Add Sponsor
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
