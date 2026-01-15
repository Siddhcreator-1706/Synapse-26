"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Merchandise = {
	id: number;
	name: string;
	price: number;
	sizes: string[];
	imageUrl: string;
	available: boolean;
	description: string;
};

export default function MerchandiseManagementPage() {
	const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch products from API
	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const response = await fetch("/api/admin/merchandise/management");
			const data = await response.json();
			if (data.products) {
				// Map API response to component state
				const mappedProducts = data.products.map((product: any) => ({
					id: product.product_id,
					name: product.product_name,
					price: product.price,
					sizes: product.available_sizes || [],
					imageUrl: product.product_image || "",
					available: product.is_available,
					description: product.description || "",
				}));
				setMerchandise(mappedProducts);
			}
		} catch (error) {
			console.error("Error fetching products:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete this merchandise?")) {
			try {
				const response = await fetch(`/api/admin/merchandise/management/${id}`, {
					method: "DELETE",
				});
				if (response.ok) {
					setMerchandise(merchandise.filter((m) => m.id !== id));
				} else {
					const data = await response.json();
					alert(data.error || "Failed to delete product");
				}
			} catch (error) {
				console.error("Error deleting product:", error);
				alert("Failed to delete product");
			}
		}
	};

	const toggleAvailability = async (id: number) => {
		const item = merchandise.find((m) => m.id === id);
		if (!item) return;

		try {
			const response = await fetch(`/api/admin/merchandise/management/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ is_available: !item.available }),
			});

			if (response.ok) {
				setMerchandise(
					merchandise.map((m) => (m.id === id ? { ...m, available: !m.available } : m))
				);
			} else {
				const data = await response.json();
				alert(data.error || "Failed to update availability");
			}
		} catch (error) {
			console.error("Error toggling availability:", error);
			alert("Failed to update availability");
		}
	};

	return (
		<div className="space-y-6">
			<header className="flex items-center justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
						Store Management
					</p>
					<h1 className="text-3xl font-bold text-slate-900">Merchandise</h1>
				</div>
				<Link
					href="/admin/merchandise/management/new"
					className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-teal-500 hover:to-cyan-500 hover:shadow-xl"
				>
					+ Add New Product
				</Link>
			</header>

			{/* Merchandise Grid */}
			<div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white/90 shadow-lg backdrop-blur">
				<div className="border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
					<h2 className="text-xl font-semibold text-white">All Merchandise ({merchandise.length})</h2>
				</div>
				{loading ? (
					<div className="flex min-h-[300px] items-center justify-center">
						<div className="text-center">
							<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
							<p className="text-sm text-slate-600">Loading products...</p>
						</div>
					</div>
				) : merchandise.length === 0 ? (
					<div className="flex min-h-[300px] items-center justify-center">
						<p className="text-slate-600">No products found. Add your first product!</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
					{merchandise.map((item) => (
						<div
							key={item.id}
							className="group overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition hover:shadow-lg"
						>
							{/* Availability Toggle */}
							<div className="mb-3 flex items-start justify-between">
								<h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
								<button
									onClick={() => toggleAvailability(item.id)}
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
										item.available ? "bg-green-500" : "bg-red-500"
									}`}
									aria-label="Toggle availability"
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
											item.available ? "translate-x-6" : "translate-x-1"
										}`}
									/>
								</button>
							</div>

							<span
								className={`mb-3 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
									item.available
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{item.available ? "✓ In Stock" : "✗ Out of Stock"}
							</span>

							<div className="mb-4 space-y-2">
								<p className="text-2xl font-bold text-indigo-700">₹{item.price}</p>
								<div className="text-sm text-slate-600">
									<p className="mb-1 font-medium">Available Sizes:</p>
									<div className="flex flex-wrap gap-1">
										{item.sizes.map((size) => (
											<span
												key={size}
												className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700"
											>
												{size}
											</span>
										))}
									</div>
								</div>
								{item.description && (
									<p className="mt-2 text-sm text-slate-600">📝 {item.description}</p>
								)}
							</div>

							<div className="mt-4 flex gap-2">
								<Link
									href={`/admin/merchandise/management/${item.id}`}
									className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow transition hover:from-blue-500 hover:to-indigo-500"
								>
									Edit
								</Link>
								<button
									onClick={() => handleDelete(item.id)}
									className="flex-1 rounded-lg bg-gradient-to-r from-rose-500 to-red-600 px-3 py-2 text-sm font-semibold text-white shadow transition hover:from-rose-400 hover:to-red-500"
								>
									Delete
								</button>
							</div>
						</div>
					))}
					</div>
				)}
			</div>
		</div>
	);
}
