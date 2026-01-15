"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormData = {
	name: string;
	price: string;
	sizes: string[];
	description: string;
};

export default function CreateMerchandisePage() {
	const router = useRouter();
	const [formData, setFormData] = useState<FormData>({
		name: "",
		price: "",
		sizes: [],
		description: "",
	});

	const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (formData.sizes.length === 0) {
			if (typeof window !== "undefined") {
				window.alert("Please select at least one size");
			}
			return;
		}

		try {
			const response = await fetch("/api/admin/merchandise/management", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					product_name: formData.name,
					price: parseFloat(formData.price),
					available_sizes: formData.sizes,
					description: formData.description,
					is_available: true,
					product_image: "", // TODO: Handle image upload
				}),
			});

			const data = await response.json();
			if (response.ok) {
				router.push("/admin/merchandise/management");
			} else {
				alert(data.error || "Failed to create product");
			}
		} catch (error) {
			console.error("Error creating product:", error);
			alert("Failed to create product");
		}
	};

	const toggleSize = (size: string) => {
		const currentSizes = formData.sizes;
		const newSizes = currentSizes.includes(size)
			? currentSizes.filter((s) => s !== size)
			: [...currentSizes, size];
		setFormData({ ...formData, sizes: newSizes });
	};

	return (
		<div className="space-y-6">
			<header className="flex items-center justify-between">
				<div>
					<Link
						href="/admin/merchandise/management"
						className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
					>
						← Back to Merchandise
					</Link>
					<h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
				</div>
			</header>

			{/* Add Merchandise Form */}
			<div className="rounded-2xl border border-teal-100 bg-white/90 p-6 shadow-lg backdrop-blur">
				<div className="mb-6 flex items-center gap-3">
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-xl font-bold text-white">
						+
					</span>
					<div>
						<h2 className="text-xl font-semibold text-slate-900">Product Details</h2>
						<p className="text-sm text-slate-600">Fill in the information below to add new merchandise</p>
					</div>
				</div>
				<form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Product Name
						</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
							placeholder="e.g., Synapse T-Shirt"
							required
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Price (₹)
						</label>
						<input
							type="number"
							value={formData.price}
							onChange={(e) => setFormData({ ...formData, price: e.target.value })}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
							placeholder="Product price"
							required
						/>
					</div>

					{/* Sizes Selection */}
					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Available Sizes (Select multiple)
						</label>
						<div className="flex flex-wrap gap-2">
							{allSizes.map((size) => (
								<button
									key={size}
									type="button"
									onClick={() => toggleSize(size)}
									className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition ${
										formData.sizes.includes(size)
											? "border-teal-600 bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md"
											: "border-slate-300 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50"
									}`}
								>
									{size}
								</button>
							))}
						</div>
						<p className="mt-2 text-xs text-slate-500">
							Selected: {formData.sizes.join(", ") || "None"}
						</p>
					</div>

					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Product Image
						</label>
						<input
							type="file"
							accept="image/*"
							className="block w-full cursor-pointer rounded-lg border border-slate-200 text-sm text-slate-500 shadow-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-teal-50 file:to-cyan-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:file:from-teal-100 hover:file:to-cyan-100"
						/>
					</div>

					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							Description
						</label>
						<textarea
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
							rows={4}
							placeholder="Product details, material, design info, etc."
						/>
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
							className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-teal-500 hover:to-cyan-500 hover:shadow-xl"
						>
							Add Product
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
