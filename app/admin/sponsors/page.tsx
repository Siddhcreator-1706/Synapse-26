"use client";

import { useState } from "react";
import Link from "next/link";

type Sponsor = {
	id: number;
	name: string;
	tier: string;
	website: string;
	logoUrl: string;
};

export default function SponsorsPage() {
	const [sponsors, setSponsors] = useState<Sponsor[]>([
		{ id: 1, name: "Tech Corp", tier: "Platinum", website: "https://techcorp.com", logoUrl: "" },
		{ id: 2, name: "Innovation Labs", tier: "Gold", website: "https://innovlabs.com", logoUrl: "" },
		{ id: 3, name: "Start Hub", tier: "Silver", website: "https://starthub.com", logoUrl: "" },
	]);

	const handleDelete = (id: number) => {
		if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete this sponsor?")) {
			setSponsors(sponsors.filter((s) => s.id !== id));
		}
	};

	const getTierColor = (tier: string) => {
		const colors: Record<string, string> = {
			Platinum: "bg-slate-200 text-slate-800",
			Gold: "bg-yellow-100 text-yellow-800",
			Silver: "bg-slate-100 text-slate-700",
			Bronze: "bg-orange-100 text-orange-800",
		};
		return colors[tier] || "bg-blue-100 text-blue-800";
	};

	return (
		<div className="space-y-6">
			<header className="flex items-center justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
						Partnership Management
					</p>
					<h1 className="text-3xl font-bold text-slate-900">Sponsors</h1>
				</div>
				<Link
					href="/admin/sponsors/new"
					className="rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-amber-500 hover:to-orange-500 hover:shadow-xl"
				>
					+ Add New Sponsor
				</Link>
			</header>

			{/* Sponsors Grid */}
			<div className="overflow-hidden rounded-2xl border border-amber-100 bg-white/90 shadow-lg backdrop-blur">
				<div className="border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
					<h2 className="text-xl font-semibold text-white">All Sponsors ({sponsors.length})</h2>
				</div>
				<div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
					{sponsors.map((sponsor) => (
						<div
							key={sponsor.id}
							className="group overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition hover:shadow-lg"
						>
							<div className="mb-3 flex items-center justify-between">
								<h3 className="text-lg font-semibold text-slate-900">{sponsor.name}</h3>
								<span
									className={`rounded-full px-3 py-1 text-xs font-semibold ${getTierColor(sponsor.tier)}`}
								>
									{sponsor.tier}
								</span>
							</div>
							{sponsor.website && (
								<a
									href={sponsor.website}
									target="_blank"
									rel="noopener noreferrer"
									className="mb-3 block text-sm text-amber-600 hover:underline"
								>
									🔗 {sponsor.website}
								</a>
							)}
							<div className="mt-4 flex gap-2">
								<Link
									href={`/admin/sponsors/${sponsor.id}`}
									className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow transition hover:from-blue-500 hover:to-indigo-500"
								>
									Edit
								</Link>
								<button
									onClick={() => handleDelete(sponsor.id)}
									className="flex-1 rounded-lg bg-gradient-to-r from-rose-500 to-red-600 px-3 py-2 text-sm font-semibold text-white shadow transition hover:from-rose-400 hover:to-red-500"
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
