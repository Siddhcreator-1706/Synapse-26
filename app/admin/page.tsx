"use client";

import { useState } from "react";

type Stats = {
	totalEvents: number;
	totalRegistrations: number;
	totalUsers: number;
	totalSponsors: number;
};

type Registration = {
	id: number;
	userName: string;
	event: string;
	date: string;
};

export default function AdminPage() {
	const [stats] = useState<Stats>({
		totalEvents: 12,
		totalRegistrations: 456,
		totalUsers: 234,
		totalSponsors: 8,
	});

	const [recentRegistrations] = useState<Registration[]>([
		{ id: 1, userName: "John Doe", event: "Coding Competition", date: "2025-12-14" },
		{ id: 2, userName: "Jane Smith", event: "Dance Battle", date: "2025-12-14" },
		{ id: 3, userName: "Mike Johnson", event: "Robotics Workshop", date: "2025-12-13" },
		{ id: 4, userName: "Sarah Williams", event: "Gaming Tournament", date: "2025-12-13" },
		{ id: 5, userName: "Tom Brown", event: "Art Exhibition", date: "2025-12-12" },
	]);

	return (
		<div className="space-y-6">
			<header>
				<p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Overview</p>
				<h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
			</header>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<div className="group overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-lg transition hover:shadow-xl">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-semibold text-slate-600">Total Events</p>
							<p className="mt-1 text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
								{stats.totalEvents}
							</p>
						</div>
						<div className="text-5xl transition group-hover:scale-110">🎪</div>
					</div>
				</div>

				<div className="group overflow-hidden rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-6 shadow-lg transition hover:shadow-xl">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-semibold text-slate-600">Total Registrations</p>
							<p className="mt-1 text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
								{stats.totalRegistrations}
							</p>
						</div>
						<div className="text-5xl transition group-hover:scale-110">📝</div>
					</div>
				</div>

				<div className="group overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg transition hover:shadow-xl">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-semibold text-slate-600">Total Users</p>
							<p className="mt-1 text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
								{stats.totalUsers}
							</p>
						</div>
						<div className="text-5xl transition group-hover:scale-110">👥</div>
					</div>
				</div>

				<div className="group overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-lg transition hover:shadow-xl">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-semibold text-slate-600">Total Sponsors</p>
							<p className="mt-1 text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
								{stats.totalSponsors}
							</p>
						</div>
						<div className="text-5xl transition group-hover:scale-110">🤝</div>
					</div>
				</div>
			</div>

			{/* Recent Registrations */}
			<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-lg">
				<div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-white">
					<h2 className="text-lg font-semibold">Recent Registrations</h2>
					<span className="text-sm text-white/80">Latest activity</span>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-slate-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
									User
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
									Event
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
									Date
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{recentRegistrations.map((reg) => (
								<tr key={reg.id} className="transition hover:bg-slate-50">
									<td className="px-6 py-4 text-sm font-semibold text-slate-900">{reg.userName}</td>
									<td className="px-6 py-4 text-sm text-slate-700">
										<span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 font-medium text-teal-700">
											{reg.event}
										</span>
									</td>
									<td className="px-6 py-4 text-sm text-slate-600">{reg.date}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}