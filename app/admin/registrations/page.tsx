"use client";

import React, { useState } from "react";

type Registration = {
	id: number;
	userName: string;
	email: string;
	phone: string;
	college: string;
	event: string;
	category: string;
	participationType: string;
	teamSize: number;
	registrationDate: string;
	paymentMethod: string;
	paymentStatus: string;
	amount: number;
	transactionId: string;
};

type GatewayCharges = {
	[key: string]: number;
};

export default function RegistrationsPage() {
	const [registrations] = useState<Registration[]>([
		{
			id: 1,
			userName: "John Doe",
			email: "john@example.com",
			phone: "9876543210",
			college: "ABC College",
			event: "Hackathon 2025",
			category: "Technical",
			participationType: "Solo",
			teamSize: 1,
			registrationDate: "2025-12-10",
			paymentMethod: "UPI",
			paymentStatus: "Paid",
			amount: 200,
			transactionId: "TXN123456789",
		},
		{
			id: 2,
			userName: "Jane Smith",
			email: "jane@example.com",
			phone: "9876543211",
			college: "XYZ University",
			event: "Dance Battle",
			category: "Cultural",
			participationType: "Duet",
			teamSize: 2,
			registrationDate: "2025-12-11",
			paymentMethod: "Credit Card",
			paymentStatus: "Paid",
			amount: 250,
			transactionId: "TXN987654321",
		},
		{
			id: 3,
			userName: "Mike Johnson",
			email: "mike@example.com",
			phone: "9876543212",
			college: "DEF Institute",
			event: "Hackathon 2025",
			category: "Technical",
			participationType: "Group",
			teamSize: 5,
			registrationDate: "2025-12-12",
			paymentMethod: "Debit Card",
			paymentStatus: "Pending",
			amount: 500,
			transactionId: "TXN456789123",
		},
		{
			id: 4,
			userName: "Sarah Williams",
			email: "sarah@example.com",
			phone: "9876543213",
			college: "GHI College",
			event: "Coding Competition",
			category: "Technical",
			participationType: "Solo",
			teamSize: 1,
			registrationDate: "2025-12-13",
			paymentMethod: "UPI",
			paymentStatus: "Paid",
			amount: 150,
			transactionId: "TXN789456123",
		},
		{
			id: 5,
			userName: "Tom Brown",
			email: "tom@example.com",
			phone: "9876543214",
			college: "JKL University",
			event: "Dance Battle",
			category: "Cultural",
			participationType: "Group",
			teamSize: 6,
			registrationDate: "2025-12-14",
			paymentMethod: "Net Banking",
			paymentStatus: "Paid",
			amount: 720,
			transactionId: "TXN321654987",
		},
	]);

	const [searchTerm, setSearchTerm] = useState("");
	const [eventFilter, setEventFilter] = useState("All Events");
	const [paymentMethodFilter, setPaymentMethodFilter] = useState("All Methods");
	const [paymentStatusFilter, setPaymentStatusFilter] = useState("All Status");
	const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

	// Gateway charges configuration
	const [gatewayCharges, setGatewayCharges] = useState<GatewayCharges>({
		UPI: 2,
		"Credit Card": 3,
		"Debit Card": 2.5,
		"Net Banking": 2,
	});

	const [isGatewaySettingsOpen, setIsGatewaySettingsOpen] = useState(false);

	// Get unique values for filters
	const allEvents = ["All Events", ...new Set(registrations.map((r) => r.event))];
	const allPaymentMethods = [
		"All Methods",
		...new Set(registrations.map((r) => r.paymentMethod)),
	];
	const allPaymentStatus = ["All Status", "Paid", "Pending", "Failed"];

	// Filter registrations
	const filteredRegistrations = registrations.filter((reg) => {
		const matchesSearch =
			reg.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			reg.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
			reg.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesEvent = eventFilter === "All Events" || reg.event === eventFilter;
		const matchesPaymentMethod =
			paymentMethodFilter === "All Methods" || reg.paymentMethod === paymentMethodFilter;
		const matchesPaymentStatus =
			paymentStatusFilter === "All Status" || reg.paymentStatus === paymentStatusFilter;

		return matchesSearch && matchesEvent && matchesPaymentMethod && matchesPaymentStatus;
	});

	// Calculate gateway charges for a registration
	const calculateGatewayCharge = (amount: number, method: string) => {
		const chargePercentage = gatewayCharges[method] || 0;
		return (amount * chargePercentage) / 100;
	};

	// Calculate statistics
	const paidRegistrations = filteredRegistrations.filter((r) => r.paymentStatus === "Paid");

	const totalGrossRevenue = paidRegistrations.reduce((sum, r) => sum + r.amount, 0);

	const totalGatewayCharges = paidRegistrations.reduce(
		(sum, r) => sum + calculateGatewayCharge(r.amount, r.paymentMethod),
		0
	);

	const totalNetRevenue = totalGrossRevenue - totalGatewayCharges;

	const paidCount = paidRegistrations.length;
	const pendingCount = filteredRegistrations.filter((r) => r.paymentStatus === "Pending").length;

	// Download CSV
	const downloadCSV = () => {
		if (typeof window === "undefined" || typeof document === "undefined") return;

		const headers = [
			"Registration ID",
			"Name",
			"Email",
			"Phone",
			"College",
			"Event",
			"Category",
			"Participation Type",
			"Team Size",
			"Registration Date",
			"Payment Method",
			"Payment Status",
			"Amount (₹)",
			"Gateway Charge %",
			"Gateway Charge (₹)",
			"Net Amount (₹)",
			"Transaction ID",
		];

		const rows = filteredRegistrations.map((reg) => {
			const gatewayCharge =
				reg.paymentStatus === "Paid"
					? calculateGatewayCharge(reg.amount, reg.paymentMethod)
					: 0;
			const netAmount = reg.paymentStatus === "Paid" ? reg.amount - gatewayCharge : reg.amount;

			return [
				reg.id,
				reg.userName,
				reg.email,
				reg.phone,
				reg.college,
				reg.event,
				reg.category,
				reg.participationType,
				reg.teamSize,
				reg.registrationDate,
				reg.paymentMethod,
				reg.paymentStatus,
				reg.amount,
				gatewayCharges[reg.paymentMethod] || 0,
				gatewayCharge.toFixed(2),
				netAmount.toFixed(2),
				reg.transactionId,
			];
		});

		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);

		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`event_registrations_${eventFilter.replace(/\s+/g, "_")}_${
				new Date().toISOString().split("T")[0]
			}.csv`
		);
		link.style.visibility = "hidden";

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Clear all filters
	const clearAllFilters = () => {
		setSearchTerm("");
		setEventFilter("All Events");
		setPaymentMethodFilter("All Methods");
		setPaymentStatusFilter("All Status");
	};

	return (
		<div className="space-y-6">
			<header className="flex items-center justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
						Overview
					</p>
					<h1 className="text-3xl font-bold text-slate-900">Event Registrations</h1>
				</div>
				<span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800">
					{filteredRegistrations.length} registrations
				</span>
			</header>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
				<div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Total Registrations</p>
							<p className="text-3xl font-bold text-indigo-700">
								{filteredRegistrations.length}
							</p>
						</div>
						<div className="text-4xl">📝</div>
					</div>
				</div>
				<div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Paid</p>
							<p className="text-3xl font-bold text-green-700">{paidCount}</p>
						</div>
						<div className="text-4xl">✅</div>
					</div>
				</div>
				<div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Gross Revenue</p>
							<p className="text-2xl font-bold text-blue-700">
								₹{totalGrossRevenue.toFixed(2)}
							</p>
						</div>
						<div className="text-4xl">💵</div>
					</div>
				</div>
				<div className="rounded-xl bg-gradient-to-br from-red-50 to-rose-50 p-6 shadow-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Gateway Charges</p>
							<p className="text-2xl font-bold text-red-700">
								-₹{totalGatewayCharges.toFixed(2)}
							</p>
						</div>
						<div className="text-4xl">💳</div>
					</div>
				</div>
				<div className="rounded-xl border-2 border-green-500 bg-gradient-to-br from-green-50 to-teal-50 p-6 shadow-xl">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-semibold text-slate-700">Net Revenue</p>
							<p className="text-2xl font-bold text-green-700">
								₹{totalNetRevenue.toFixed(2)}
							</p>
						</div>
						<div className="text-4xl">💰</div>
					</div>
				</div>
			</div>

			{/* Gateway Settings Button */}
			<div className="flex justify-end">
				<button
					onClick={() => setIsGatewaySettingsOpen(true)}
					className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-purple-500 hover:to-pink-500 hover:shadow-xl"
				>
					<span>⚙️</span>
					Gateway Charges Settings
				</button>
			</div>

			{/* Search and Filters */}
			<div className="rounded-2xl border border-teal-100 bg-white/90 p-6 shadow-lg backdrop-blur">
				<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
					{/* Search */}
					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Search Registrations
						</label>
						<input
							type="text"
							placeholder="Search by name, email, college, or transaction ID..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
						/>
					</div>

					{/* Event Filter */}
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Filter by Event
						</label>
						<select
							value={eventFilter}
							onChange={(e) => setEventFilter(e.target.value)}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
						>
							{allEvents.map((event, idx) => (
								<option key={idx} value={event}>
									{event}
								</option>
							))}
						</select>
					</div>

					{/* Payment Method Filter */}
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Payment Method
						</label>
						<select
							value={paymentMethodFilter}
							onChange={(e) => setPaymentMethodFilter(e.target.value)}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
						>
							{allPaymentMethods.map((method, idx) => (
								<option key={idx} value={method}>
									{method}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Payment Status Filter */}
				<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Payment Status
						</label>
						<select
							value={paymentStatusFilter}
							onChange={(e) => setPaymentStatusFilter(e.target.value)}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
						>
							{allPaymentStatus.map((status, idx) => (
								<option key={idx} value={status}>
									{status}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Active Filters Display */}
				{(searchTerm ||
					eventFilter !== "All Events" ||
					paymentMethodFilter !== "All Methods" ||
					paymentStatusFilter !== "All Status") && (
					<div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
						<span className="font-medium text-slate-600">Active filters:</span>
						{searchTerm && (
							<span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
								Search: &quot;{searchTerm}&quot;
							</span>
						)}
						{eventFilter !== "All Events" && (
							<span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
								Event: {eventFilter}
							</span>
						)}
						{paymentMethodFilter !== "All Methods" && (
							<span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
								Method: {paymentMethodFilter}
							</span>
						)}
						{paymentStatusFilter !== "All Status" && (
							<span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
								Status: {paymentStatusFilter}
							</span>
						)}
						<button
							onClick={clearAllFilters}
							className="ml-2 font-semibold text-red-600 hover:text-red-800"
						>
							Clear all
						</button>
					</div>
				)}
			</div>

			{/* Registrations Table */}
			<div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white/90 shadow-lg backdrop-blur">
				<div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-white">
					<h2 className="text-xl font-semibold">
						All Registrations ({filteredRegistrations.length})
					</h2>
					<button
						onClick={downloadCSV}
						disabled={filteredRegistrations.length === 0}
						className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:from-green-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
					>
						<span>📥</span>
						Download CSV
					</button>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gradient-to-r from-slate-100 to-slate-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-700">
									ID
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-700">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-700">
									Event
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-700">
									Participation
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-700">
									Payment Method
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-700">
									Gross Amount
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-700">
									Gateway Charge
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-700">
									Net Amount
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-700">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-700">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{filteredRegistrations.length === 0 ? (
								<tr>
									<td colSpan={10} className="px-6 py-8 text-center text-sm text-slate-500">
										No registrations found matching the selected filters.
									</td>
								</tr>
							) : (
								filteredRegistrations.map((reg) => {
									const gatewayCharge =
										reg.paymentStatus === "Paid"
											? calculateGatewayCharge(reg.amount, reg.paymentMethod)
											: 0;
									const netAmount =
										reg.paymentStatus === "Paid" ? reg.amount - gatewayCharge : reg.amount;

									return (
										<tr key={reg.id} className="transition hover:bg-slate-50">
											<td className="px-6 py-4 text-sm font-medium text-slate-900">
												#{reg.id}
											</td>
											<td className="px-6 py-4 text-sm text-slate-900">
												<div>
													<p className="font-medium">{reg.userName}</p>
													<p className="text-xs text-slate-500">{reg.college}</p>
												</div>
											</td>
											<td className="px-6 py-4 text-sm text-slate-900">
												<div>
													<p className="font-medium">{reg.event}</p>
													<p className="text-xs text-slate-500">{reg.category}</p>
												</div>
											</td>
											<td className="px-6 py-4 text-sm text-slate-700">
												{reg.participationType} ({reg.teamSize})
											</td>
											<td className="px-6 py-4 text-sm">
												<span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
													{reg.paymentMethod}
												</span>
											</td>
											<td className="px-6 py-4 text-sm font-semibold text-slate-900">
												₹{reg.amount}
											</td>
											<td className="px-6 py-4 text-sm text-red-600">
												{reg.paymentStatus === "Paid" ? (
													<>
														-₹{gatewayCharge.toFixed(2)}
														<span className="block text-xs text-slate-500">
															({gatewayCharges[reg.paymentMethod]}%)
														</span>
													</>
												) : (
													"-"
												)}
											</td>
											<td className="px-6 py-4 text-sm font-bold text-green-600">
												{reg.paymentStatus === "Paid" ? `₹${netAmount.toFixed(2)}` : "-"}
											</td>
											<td className="px-6 py-4 text-sm">
												<span
													className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
														reg.paymentStatus === "Paid"
															? "bg-green-100 text-green-800"
															: reg.paymentStatus === "Pending"
															? "bg-yellow-100 text-yellow-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{reg.paymentStatus}
												</span>
											</td>
											<td className="px-6 py-4 text-sm">
												<button
													onClick={() => setSelectedRegistration(reg)}
													className="font-semibold text-indigo-600 hover:text-indigo-800"
												>
													View Details
												</button>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Gateway Settings Modal */}
			{isGatewaySettingsOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
						<div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-white">
							<h3 className="text-xl font-semibold">Gateway Charges Settings</h3>
							<button
								onClick={() => setIsGatewaySettingsOpen(false)}
								className="text-2xl leading-none text-white/70 hover:text-white"
							>
								✕
							</button>
						</div>

						<div className="p-6">
							<p className="mb-4 text-sm text-slate-600">
								Set the gateway charges percentage for each payment method. These will be
								deducted from the gross revenue.
							</p>

							<div className="space-y-4">
								{Object.keys(gatewayCharges).map((method) => (
									<div key={method}>
										<label className="mb-2 block text-sm font-semibold text-slate-700">
											{method}
										</label>
										<div className="flex items-center gap-2">
											<input
												type="number"
												step="0.1"
												min="0"
												max="10"
												value={gatewayCharges[method]}
												onChange={(e) =>
													setGatewayCharges({
														...gatewayCharges,
														[method]: parseFloat(e.target.value) || 0,
													})
												}
												className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
											/>
											<span className="font-semibold text-slate-600">%</span>
										</div>
									</div>
								))}
							</div>

							<button
								onClick={() => setIsGatewaySettingsOpen(false)}
								className="mt-6 w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-purple-500 hover:to-pink-500"
							>
								Save Settings
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Registration Details Modal */}
			{selectedRegistration && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
						<div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-white">
							<h3 className="text-xl font-semibold">
								Registration Details #{selectedRegistration.id}
							</h3>
							<button
								onClick={() => setSelectedRegistration(null)}
								className="text-2xl leading-none text-white/70 hover:text-white"
							>
								✕
							</button>
						</div>

						<div className="space-y-4 p-6">
							{/* Participant Info */}
							<div className="border-b border-slate-200 pb-4">
								<h4 className="mb-3 font-semibold text-slate-800">
									Participant Information
								</h4>
								<div className="space-y-2 text-sm">
									<p className="flex justify-between">
										<strong className="text-slate-700">Name:</strong>
										<span className="text-slate-900">{selectedRegistration.userName}</span>
									</p>
									<p className="flex justify-between">
										<strong className="text-slate-700">Email:</strong>
										<span className="text-slate-900">{selectedRegistration.email}</span>
									</p>
									<p className="flex justify-between">
										<strong className="text-slate-700">Phone:</strong>
										<span className="text-slate-900">{selectedRegistration.phone}</span>
									</p>
									<p className="flex justify-between">
										<strong className="text-slate-700">College:</strong>
										<span className="text-slate-900">{selectedRegistration.college}</span>
									</p>
								</div>
							</div>

							{/* Event Info */}
							<div className="border-b border-slate-200 pb-4">
								<h4 className="mb-3 font-semibold text-slate-800">Event Information</h4>
								<div className="space-y-2 text-sm">
									<p className="flex justify-between">
										<strong className="text-slate-700">Event:</strong>
										<span className="text-slate-900">{selectedRegistration.event}</span>
									</p>
									<p className="flex justify-between">
										<strong className="text-slate-700">Category:</strong>
										<span className="text-slate-900">{selectedRegistration.category}</span>
									</p>
									<p className="flex justify-between">
										<strong className="text-slate-700">Participation Type:</strong>
										<span className="text-slate-900">
											{selectedRegistration.participationType}
										</span>
									</p>
									<p className="flex justify-between">
										<strong className="text-slate-700">Team Size:</strong>
										<span className="text-slate-900">
											{selectedRegistration.teamSize}{" "}
											{selectedRegistration.teamSize === 1 ? "person" : "people"}
										</span>
									</p>
									<p className="flex justify-between">
										<strong className="text-slate-700">Registration Date:</strong>
										<span className="text-slate-900">
											{selectedRegistration.registrationDate}
										</span>
									</p>
								</div>
							</div>

							{/* Payment Info */}
							<div className="border-b border-slate-200 pb-4">
								<h4 className="mb-3 font-semibold text-slate-800">Payment Information</h4>
								<div className="space-y-3 text-sm">
									<p className="flex justify-between">
										<strong className="text-slate-700">Payment Method:</strong>
										<span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
											{selectedRegistration.paymentMethod}
										</span>
									</p>
									<p className="flex justify-between">
										<strong className="text-slate-700">Payment Status:</strong>
										<span
											className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
												selectedRegistration.paymentStatus === "Paid"
													? "bg-green-100 text-green-800"
													: selectedRegistration.paymentStatus === "Pending"
													? "bg-yellow-100 text-yellow-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{selectedRegistration.paymentStatus}
										</span>
									</p>
									<p className="flex justify-between">
										<strong className="text-slate-700">Transaction ID:</strong>
										<span className="font-mono text-xs text-slate-900">
											{selectedRegistration.transactionId}
										</span>
									</p>
								</div>
							</div>

							{/* Financial Breakdown */}
							{selectedRegistration.paymentStatus === "Paid" && (
								<div className="rounded-xl bg-gradient-to-br from-green-50 to-teal-50 p-4">
									<h4 className="mb-3 font-semibold text-slate-800">
										Financial Breakdown
									</h4>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-slate-700">Gross Amount:</span>
											<span className="font-semibold text-slate-900">
												₹{selectedRegistration.amount}
											</span>
										</div>
										<div className="flex justify-between text-red-600">
											<span>
												Gateway Charge (
												{gatewayCharges[selectedRegistration.paymentMethod]}%):
											</span>
											<span className="font-semibold">
												-₹
												{calculateGatewayCharge(
													selectedRegistration.amount,
													selectedRegistration.paymentMethod
												).toFixed(2)}
											</span>
										</div>
										<div className="flex justify-between border-t border-green-200 pt-2 text-lg font-bold text-green-700">
											<span>Net Amount Received:</span>
											<span>
												₹
												{(
													selectedRegistration.amount -
													calculateGatewayCharge(
														selectedRegistration.amount,
														selectedRegistration.paymentMethod
													)
												).toFixed(2)}
											</span>
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="border-t border-slate-100 p-6">
							<button
								onClick={() => setSelectedRegistration(null)}
								className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:to-purple-500"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
