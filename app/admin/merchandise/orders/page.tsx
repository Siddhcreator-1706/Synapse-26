"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type OrderItem = {
	product: string;
	size: string;
	quantity: number;
	price: number;
};

type Order = {
	id: number;
	userName: string;
	email: string;
	phone: string;
	items: OrderItem[];
	totalAmount: number;
	orderDate: string;
	paymentStatus: "Paid" | "Pending";
	paymentMethod?: string;
};

export default function MerchandiseOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch orders from API
	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const response = await fetch("/api/admin/merchandise/orders");
			const data = await response.json();
			if (data.orders) {
				// Map API response to component state
				const mappedOrders = data.orders.map((order: any) => ({
					id: order.order_id,
					userName: order.customer_id, // TODO: Fetch user details from customer_id
					email: "", // TODO: Fetch from user profile
					phone: "", // TODO: Fetch from user profile
					items: order.items || [],
					totalAmount: order.amount,
					orderDate: new Date(order.order_date).toISOString().split("T")[0],
					paymentStatus: order.payment_status,
					paymentMethod: order.payment_method,
				}));
				setOrders(mappedOrders);
			}
		} catch (error) {
			console.error("Error fetching orders:", error);
		} finally {
			setLoading(false);
		}
	};

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [productFilter, setProductFilter] = useState("All Products");

	// Get unique products
	const allProducts = [
		"All Products",
		...new Set(orders.flatMap((order) => order.items.map((item) => item.product))),
	];

	// Filter orders
	const filteredOrders = orders.filter((order) => {
		const matchesSearch =
			order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.email.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesProduct =
			productFilter === "All Products" ||
			order.items.some((item) => item.product === productFilter);

		return matchesSearch && matchesProduct;
	});

	// Download CSV
	const downloadCSV = () => {
		const headers = [
			"Order ID",
			"Customer Name",
			"Email",
			"Phone",
			"Product",
			"Size",
			"Quantity",
			"Price per Item",
			"Total Amount",
			"Order Date",
			"Payment Status",
		];

		const rows: (string | number)[][] = [];
		filteredOrders.forEach((order) => {
			order.items.forEach((item, idx) => {
				rows.push([
					idx === 0 ? order.id : "",
					idx === 0 ? order.userName : "",
					idx === 0 ? order.email : "",
					idx === 0 ? order.phone : "",
					item.product,
					item.size,
					item.quantity,
					item.price,
					idx === 0 ? order.totalAmount : "",
					idx === 0 ? order.orderDate : "",
					idx === 0 ? order.paymentStatus : "",
				]);
			});
		});

		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.join(",")),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);

		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`merchandise_orders_${new Date().toISOString().split("T")[0]}.csv`
		);
		link.style.visibility = "hidden";

		if (typeof document !== "undefined") {
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	return (
		<div className="space-y-6">
			<header className="flex items-center justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-wide text-purple-700">
						Order Management
					</p>
					<h1 className="text-3xl font-bold text-slate-900">Merchandise Orders</h1>
				</div>
				<span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-800">
					{filteredOrders.length} orders
				</span>
			</header>

			{/* Search and Filters */}
			<div className="rounded-2xl border border-purple-100 bg-white/90 p-6 shadow-lg backdrop-blur">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Search Orders
						</label>
						<input
							type="text"
							placeholder="Search by customer name or email..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Filter by Product
						</label>
						<select
							value={productFilter}
							onChange={(e) => setProductFilter(e.target.value)}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
						>
							{allProducts.map((product, idx) => (
								<option key={idx} value={product}>
									{product}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Active Filters */}
				{(searchTerm || productFilter !== "All Products") && (
					<div className="mt-4 flex items-center gap-2 text-sm">
						<span className="text-slate-600">Active filters:</span>
						{searchTerm && (
							<span className="rounded-full bg-purple-100 px-2.5 py-1 text-purple-700">
								Search: "{searchTerm}"
							</span>
						)}
						{productFilter !== "All Products" && (
							<span className="rounded-full bg-teal-100 px-2.5 py-1 text-teal-700">
								Product: {productFilter}
							</span>
						)}
						<button
							onClick={() => {
								setSearchTerm("");
								setProductFilter("All Products");
							}}
							className="ml-2 text-red-600 transition hover:text-red-800"
						>
							Clear all
						</button>
					</div>
				)}
			</div>

			{/* Orders Table */}
			<div className="overflow-hidden rounded-2xl border border-purple-100 bg-white/90 shadow-lg backdrop-blur">
				<div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
					<h2 className="text-xl font-semibold text-white">
						All Orders ({filteredOrders.length})
						{productFilter !== "All Products" && (
							<span className="ml-2 text-sm text-slate-300">- "{productFilter}"</span>
						)}
					</h2>
					<button
						onClick={downloadCSV}
						disabled={filteredOrders.length === 0}
						className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:from-emerald-500 hover:to-green-500 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
					>
						<span>📥</span>
						Download CSV
					</button>
				</div>
				{loading ? (
					<div className="flex min-h-[300px] items-center justify-center">
						<div className="text-center">
							<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
							<p className="text-sm text-slate-600">Loading orders...</p>
						</div>
					</div>
				) : filteredOrders.length === 0 ? (
					<div className="flex min-h-[300px] items-center justify-center">
						<p className="text-slate-600">No orders found.</p>
					</div>
				) : (
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-slate-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
									Order ID
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
									Customer
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
									Email
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
									Items
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
									Total Amount
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
									Date
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
									Payment
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200">
							{filteredOrders.length === 0 ? (
								<tr>
									<td
										colSpan={8}
										className="px-6 py-8 text-center text-slate-500"
									>
										No orders found matching the selected filters.
									</td>
								</tr>
							) : (
								filteredOrders.map((order) => (
									<tr key={order.id} className="transition hover:bg-slate-50">
										<td className="px-6 py-4 text-sm font-medium text-slate-900">
											#{order.id}
										</td>
										<td className="px-6 py-4 text-sm text-slate-900">
											{order.userName}
										</td>
										<td className="px-6 py-4 text-sm text-slate-900">
											{order.email}
										</td>
										<td className="px-6 py-4 text-sm text-purple-600">
											{order.items.length} item(s)
										</td>
										<td className="px-6 py-4 text-sm font-semibold text-slate-900">
											₹{order.totalAmount}
										</td>
										<td className="px-6 py-4 text-sm text-slate-500">
											{order.orderDate}
										</td>
										<td className="px-6 py-4 text-sm">
											<span
												className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
													order.paymentStatus === "Paid"
														? "bg-green-100 text-green-800"
														: "bg-yellow-100 text-yellow-800"
												}`}
											>
												{order.paymentStatus}
											</span>
										</td>
										<td className="px-6 py-4 text-sm">
											<button
												onClick={() => setSelectedOrder(order)}
												className="text-purple-600 transition hover:text-purple-800"
											>
												View Details
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>				)}			</div>

			{/* Order Details Modal */}
			{selectedOrder && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
						<div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-white">
							<h3 className="text-xl font-semibold">Order #{selectedOrder.id}</h3>
							<button
								onClick={() => setSelectedOrder(null)}
								className="text-2xl leading-none text-white/70 hover:text-white"
							>
								✕
							</button>
						</div>

						<div className="space-y-4 p-6">
							<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
								<h4 className="mb-3 font-semibold text-slate-900">Customer Details</h4>
								<div className="space-y-1 text-sm">
									<p>
										<strong className="text-slate-700">Name:</strong>{" "}
										<span className="text-slate-900">{selectedOrder.userName}</span>
									</p>
									<p>
										<strong className="text-slate-700">Email:</strong>{" "}
										<span className="text-slate-900">{selectedOrder.email}</span>
									</p>
									<p>
										<strong className="text-slate-700">Phone:</strong>{" "}
										<span className="text-slate-900">{selectedOrder.phone}</span>
									</p>
									<p>
										<strong className="text-slate-700">Order Date:</strong>{" "}
										<span className="text-slate-900">{selectedOrder.orderDate}</span>
									</p>
								</div>
							</div>

							<div>
								<h4 className="mb-3 font-semibold text-slate-900">Items Ordered</h4>
								<div className="space-y-2">
									{selectedOrder.items.map((item, idx) => (
										<div
											key={idx}
											className="flex items-center justify-between rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3"
										>
											<div>
												<p className="text-sm font-medium text-slate-900">
													{item.product}
												</p>
												<p className="text-xs text-slate-600">
													Size: {item.size} | Qty: {item.quantity}
												</p>
											</div>
											<p className="text-sm font-semibold text-purple-700">
												₹{item.price * item.quantity}
											</p>
										</div>
									))}
								</div>
							</div>

							<div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
								<div className="mb-2 flex items-center justify-between">
									<span className="font-semibold text-slate-900">Total Amount:</span>
									<span className="text-xl font-bold text-purple-700">
										₹{selectedOrder.totalAmount}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-semibold text-slate-900">Payment Status:</span>
									<span
										className={`rounded-full px-3 py-1 text-sm font-semibold ${
											selectedOrder.paymentStatus === "Paid"
												? "bg-green-100 text-green-800"
												: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{selectedOrder.paymentStatus}
									</span>
								</div>
							</div>

							<button
								onClick={() => setSelectedOrder(null)}
								className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-purple-500 hover:to-indigo-500"
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
