"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditMerchandisePage() {
	const router = useRouter();
	const params = useParams();
	const merchandiseId = params.id;

	const [editingMerchandise, setEditingMerchandise] = useState<Merchandise>({
		id: 0,
		name: "",
		price: 0,
		sizes: [],
		imageUrl: "",
		available: true,
		description: "",
	});
	const [loading, setLoading] = useState(true);

	// Fetch product from API
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await fetch(`/api/admin/merchandise/management/${merchandiseId}`);
				const data = await response.json();
				if (data.product) {
					setEditingMerchandise({
						id: data.product.product_id,
						name: data.product.product_name,
						price: data.product.price,
						sizes: data.product.available_sizes || [],
						imageUrl: data.product.product_image || "",
						available: data.product.is_available,
						description: data.product.description || "",
					});
				}
			} catch (error) {
				console.error("Error fetching product:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
	}, [merchandiseId]);

	const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];

	const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (editingMerchandise.sizes.length === 0) {
			if (typeof window !== "undefined") {
				window.alert("Please select at least one size");
			}
			return;
		}

		try {
			const response = await fetch(`/api/admin/merchandise/management/${merchandiseId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					product_name: editingMerchandise.name,
					price: editingMerchandise.price,
					available_sizes: editingMerchandise.sizes,
					description: editingMerchandise.description,
					is_available: editingMerchandise.available,
					product_image: editingMerchandise.imageUrl,
				}),
			});

			const data = await response.json();
			if (response.ok) {
				router.push("/admin/merchandise/management");
			} else {
				alert(data.error || "Failed to update product");
			}
		} catch (error) {
			console.error("Error updating product:", error);
			alert("Failed to update product");
		}
	};

	const toggleSize = (size: string) => {
		const currentSizes = editingMerchandise.sizes;
		const newSizes = currentSizes.includes(size)
			? currentSizes.filter((s) => s !== size)
			: [...currentSizes, size];
		setEditingMerchandise({ ...editingMerchandise, sizes: newSizes });
	};

	return (
		<div className="space-y-6">
			<header className="flex items-center justify-between">
				<div>
					<Link
						href="/admin/merchandise/management"
						className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-800"
					>
						← Back to Merchandise
					</Link>
					<h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
				</div>
			</header>

			{/* Edit Form */}
			{loading ? (
				<div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-indigo-100 bg-white/90 shadow-lg">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
						<p className="text-sm text-slate-600">Loading product...</p>
					</div>
				</div>
			) : (
			<div className="rounded-2xl border border-indigo-100 bg-white/90 p-6 shadow-lg backdrop-blur">
				<div className="mb-6 flex items-center gap-3">
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xl font-bold text-white">
						✏️
					</span>
					<div>
						<h2 className="text-xl font-semibold text-slate-900">Product Details</h2>
						<p className="text-sm text-slate-600">Update the information below to edit this product</p>
					</div>
				</div>
				<form onSubmit={handleEditSave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Product Name
						</label>
						<input
							type="text"
							value={editingMerchandise.name}
							onChange={(e) =>
								setEditingMerchandise({
									...editingMerchandise,
									name: e.target.value,
								})
							}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
							required
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Price (₹)
						</label>
						<input
							type="number"
							value={editingMerchandise.price}
							onChange={(e) =>
								setEditingMerchandise({
									...editingMerchandise,
									price: parseFloat(e.target.value),
								})
							}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
							required
						/>
					</div>

					{/* Sizes Selection */}
					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Available Sizes
						</label>
						<div className="flex flex-wrap gap-2">
							{allSizes.map((size) => (
								<button
									key={size}
									type="button"
									onClick={() => toggleSize(size)}
									className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition ${
										editingMerchandise.sizes.includes(size)
											? "border-indigo-600 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
											: "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
									}`}
								>
									{size}
								</button>
							))}
						</div>
						<p className="mt-2 text-xs text-slate-500">
							Selected: {editingMerchandise.sizes.join(", ") || "None"}
						</p>
					</div>

					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Product Image
						</label>
						<input
							type="file"
							accept="image/*"
							className="block w-full cursor-pointer rounded-lg border border-slate-200 text-sm text-slate-500 shadow-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-indigo-50 file:to-purple-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:from-indigo-100 hover:file:to-purple-100"
						/>
					</div>

					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Description
						</label>
						<textarea
							value={editingMerchandise.description}
							onChange={(e) =>
								setEditingMerchandise({
									...editingMerchandise,
									description: e.target.value,
								})
							}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
							rows={4}
						/>
					</div>

					{/* Availability Toggle */}
					<div className="md:col-span-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
						<span className="text-sm font-semibold text-slate-700">Stock Status</span>
						<button
							type="button"
							onClick={() =>
								setEditingMerchandise({
									...editingMerchandise,
									available: !editingMerchandise.available,
								})
							}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								editingMerchandise.available ? "bg-green-500" : "bg-red-500"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
									editingMerchandise.available ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
						<span
							className={`text-xs font-semibold ${
								editingMerchandise.available ? "text-green-600" : "text-red-600"
							}`}
						>
							{editingMerchandise.available ? "In Stock" : "Out of Stock"}
						</span>
					</div>

					<div className="md:col-span-2 flex justify-end gap-3 border-t border-slate-200 pt-4">
						<Link
							href="/admin/merchandise/management"
							className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
						>
							Cancel
						</Link>
						<button
							type="submit"
							className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:to-purple-500"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
			)}
		</div>
	);
}
