"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function MerchandiseOrderDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const orderId = params.id;

	const [order, setOrder] = useState<Order>({
		id: 0,
		userName: "",
		email: "",
		phone: "",
		items: [],
		totalAmount: 0,
		orderDate: "",
		paymentStatus: "Pending",
		paymentMethod: "",
	});
	const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Pending">("Pending");
	const [loading, setLoading] = useState(true);

	// Fetch order from API
	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const response = await fetch(`/api/admin/merchandise/orders/${orderId}`);
				const data = await response.json();
				if (data.order) {
					const orderData = {
						id: data.order.order_id,
						userName: data.order.customer_id, // TODO: Fetch user details
						email: "",
						phone: "",
						items: data.order.items || [],
						totalAmount: data.order.amount,
						orderDate: new Date(data.order.order_date).toISOString().split("T")[0],
						paymentStatus: data.order.payment_status,
						paymentMethod: data.order.payment_method,
					};
					setOrder(orderData);
					setPaymentStatus(data.order.payment_status);
				}
			} catch (error) {
				console.error("Error fetching order:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchOrder();
	}, [orderId]);

	const handleUpdateStatus = async () => {
		try {
			const response = await fetch(`/api/admin/merchandise/orders/${orderId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ payment_status: paymentStatus }),
			});

			const data = await response.json();
			if (response.ok) {
				if (typeof window !== "undefined") {
					window.alert(`Payment status updated to: ${paymentStatus}`);
				}
				setOrder({ ...order, paymentStatus });
			} else {
				alert(data.error || "Failed to update payment status");
			}
		} catch (error) {
			console.error("Error updating payment status:", error);
			alert("Failed to update payment status");
		}
	};

	return (
		<div className="space-y-6">
			<header>
				<Link
					href="/admin/merchandise/orders"
					className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-800"
				>
					← Back to Orders
				</Link>
				{!loading && (
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-semibold uppercase tracking-wide text-purple-700">
							Order Management
						</p>
						<h1 className="text-3xl font-bold text-slate-900">Order #{order.id}</h1>
					</div>
					<span
						className={`rounded-full px-4 py-2 text-sm font-semibold ${
							order.paymentStatus === "Paid"
								? "bg-green-100 text-green-800"
								: "bg-yellow-100 text-yellow-800"
						}`}
					>
						{order.paymentStatus}
					</span>
				</div>
				)}
			</header>

			{loading ? (
				<div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-purple-100 bg-white/90 shadow-lg">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
						<p className="text-sm text-slate-600">Loading order details...</p>
					</div>
				</div>
			) : (
			<>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Customer Details */}
				<div className="rounded-2xl border border-purple-100 bg-white/90 p-6 shadow-lg backdrop-blur lg:col-span-2">
					<div className="mb-4 flex items-center gap-3">
						<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-xl font-bold text-white">
							👤
						</span>
						<h2 className="text-xl font-semibold text-slate-900">Customer Details</h2>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm font-semibold text-slate-700">
								Customer Name
							</label>
							<p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900">
								{order.userName}
							</p>
						</div>
						<div>
							<label className="mb-1 block text-sm font-semibold text-slate-700">
								Email Address
							</label>
							<p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900">
								{order.email}
							</p>
						</div>
						<div>
							<label className="mb-1 block text-sm font-semibold text-slate-700">
								Phone Number
							</label>
							<p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900">
								{order.phone}
							</p>
						</div>
						<div>
							<label className="mb-1 block text-sm font-semibold text-slate-700">
								Order Date
							</label>
							<p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900">
								{order.orderDate}
							</p>
						</div>
					</div>
				</div>

				{/* Payment Status */}
				<div className="rounded-2xl border border-purple-100 bg-white/90 p-6 shadow-lg backdrop-blur">
					<div className="mb-4 flex items-center gap-3">
						<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-xl font-bold text-white">
							💳
						</span>
						<h2 className="text-xl font-semibold text-slate-900">Payment</h2>
					</div>
					<div className="space-y-4">
						<div>
							<label className="mb-2 block text-sm font-semibold text-slate-700">
								Payment Status
							</label>
							<select
								value={paymentStatus}
								onChange={(e) => setPaymentStatus(e.target.value as "Paid" | "Pending")}
								className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
							>
								<option value="Pending">Pending</option>
								<option value="Paid">Paid</option>
							</select>
						</div>
						<button
							onClick={handleUpdateStatus}
							className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-purple-500 hover:to-indigo-500"
						>
							Update Status
						</button>
					</div>
				</div>
			</div>

			{/* Order Items */}
			<div className="overflow-hidden rounded-2xl border border-purple-100 bg-white/90 shadow-lg backdrop-blur">
				<div className="border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
					<h2 className="text-xl font-semibold text-white">
						Order Items ({order.items.length})
					</h2>
				</div>
				<div className="p-6">
					<div className="space-y-3">
						{order.items.map((item, idx) => (
							<div
								key={idx}
								className="flex items-center justify-between rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 transition hover:shadow-md"
							>
								<div className="flex-1">
									<h3 className="font-semibold text-slate-900">{item.product}</h3>
									<div className="mt-1 flex gap-4 text-sm text-slate-600">
										<span>
											<strong>Size:</strong> {item.size}
										</span>
										<span>
											<strong>Quantity:</strong> {item.quantity}
										</span>
										<span>
											<strong>Price per item:</strong> ₹{item.price}
										</span>
									</div>
								</div>
								<div className="text-right">
									<p className="text-xs text-slate-500">Item Total</p>
									<p className="text-xl font-bold text-purple-700">
										₹{item.price * item.quantity}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* Order Summary */}
					<div className="mt-6 rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-semibold text-slate-700">Order Total</p>
								<p className="text-xs text-slate-600">
									{order.items.reduce((sum, item) => sum + item.quantity, 0)} items
								</p>
							</div>
							<p className="text-3xl font-bold text-purple-700">₹{order.totalAmount}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-end gap-3">
				<button
					onClick={() => router.push("/admin/merchandise/orders")}
					className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
				>
					Cancel
				</button>
				<button
					onClick={() => {
						if (typeof window !== "undefined") {
							window.print();
						}
					}}
					className="rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-slate-500 hover:to-slate-600"
				>
					🖨️ Print Invoice
				</button>
			</div>
			</>
			)}
		</div>
	);
}
