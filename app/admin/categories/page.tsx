"use client";

import { useState } from "react";

type Category = {
	id: number;
	name: string;
	description: string;
	eventCount: number;
	imageUrl: string;
};

type FormData = {
	name: string;
	description: string;
};

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([
		{
			id: 1,
			name: "Technical",
			description: "Coding, Robotics, Hackathons",
			eventCount: 5,
			imageUrl: "",
		},
		{
			id: 2,
			name: "Cultural",
			description: "Dance, Music, Drama",
			eventCount: 4,
			imageUrl: "",
		},
		{
			id: 3,
			name: "Sports",
			description: "Gaming, E-sports",
			eventCount: 3,
			imageUrl: "",
		},
	]);

	const [formData, setFormData] = useState<FormData>({
		name: "",
		description: "",
	});

	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [editingId, setEditingId] = useState<number | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			setPreviewImage(null);
			return;
		}
		const url = URL.createObjectURL(file);
		setPreviewImage(url);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (editingId) {
			setCategories(
				categories.map((cat) =>
					cat.id === editingId
						? { ...cat, ...formData, imageUrl: previewImage || cat.imageUrl }
						: cat
				)
			);
			setEditingId(null);
		} else {
			setCategories([
				...categories,
				{
					id: Date.now(),
					...formData,
					eventCount: 0,
					imageUrl: previewImage || "",
				},
			]);
		}

		setFormData({ name: "", description: "" });
		setPreviewImage(null);
	};

	const handleEdit = (category: Category) => {
		setFormData({ name: category.name, description: category.description });
		setPreviewImage(category.imageUrl || null);
		setEditingId(category.id);
	};

	const handleDelete = (id: number) => {
		if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete this category?")) {
			setCategories(categories.filter((cat) => cat.id !== id));
		}
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setFormData({ name: "", description: "" });
		setPreviewImage(null);
	};

	return (
		<div className="space-y-6">
			<header className="flex items-center justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Management</p>
					<h1 className="text-3xl font-bold text-slate-900">Event Categories</h1>
				</div>
				<span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800">
					{categories.length} categories
				</span>
			</header>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Form Section */}
				<div className="lg:col-span-1">
					<div className="rounded-2xl border border-teal-100 bg-white/90 p-6 shadow-lg backdrop-blur">
						<div className="mb-4 flex items-center gap-3">
							<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-xl font-bold text-white">
								{editingId ? "✏️" : "+"}
							</span>
							<h2 className="text-xl font-semibold text-slate-900">
								{editingId ? "Edit Category" : "Add New Category"}
							</h2>
						</div>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Category Name
								</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
									placeholder="e.g., Technical, Cultural"
									required
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Description
								</label>
								<textarea
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
									rows={3}
									placeholder="Brief description of this category"
									required
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Category Image
									<span className="ml-1 text-xs font-normal text-slate-500">
										(for frontend card)
									</span>
								</label>
								<input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="block w-full cursor-pointer rounded-lg border border-slate-200 text-sm text-slate-500 shadow-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-teal-50 file:to-cyan-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:file:from-teal-100 hover:file:to-cyan-100"
								/>
							</div>

							<button
								type="submit"
								className="w-full rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-teal-500 hover:to-cyan-500 hover:shadow-xl"
							>
								{editingId ? "Update Category" : "Add Category"}
							</button>

							{editingId && (
								<button
									type="button"
									onClick={handleCancelEdit}
									className="w-full rounded-lg border border-slate-200 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
								>
									Cancel
								</button>
							)}
						</form>
					</div>
				</div>

				{/* Preview & List Section */}
				<div className="space-y-6 lg:col-span-2">
					{/* Live Card Preview */}
					<div className="rounded-2xl border border-purple-100 bg-white/90 p-6 shadow-lg backdrop-blur">
						<div className="mb-4 flex items-center gap-3">
							<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white">
								👁️
							</span>
							<h2 className="text-lg font-semibold text-slate-900">Card Preview</h2>
						</div>
						<div className="flex justify-center">
							<div className="relative aspect-[457/640] w-full max-w-[457px] overflow-hidden rounded-xl bg-black shadow-2xl">
								{/* Background image */}
								<img
									src={previewImage || "/card.png"}
									alt="Card background"
									className="absolute inset-0 h-full w-full object-cover"
								/>

								{/* Category image overlay */}
								{previewImage && (
									<div className="absolute inset-0">
										<img
											src={previewImage}
											alt="Category"
											className="h-full w-full object-cover opacity-90"
										/>
									</div>
								)}

								{/* Text at bottom center */}
								<div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-4 py-2 backdrop-blur-sm">
									<span className="text-lg font-semibold tracking-wide text-white md:text-2xl">
										{formData.name || "Category Name"}
									</span>
								</div>
							</div>
						</div>
						<p className="mt-3 text-center text-xs text-slate-500">
							This is how your image + category name will look in the frontend card
							(scaled down here, original size ~457×640).
						</p>
					</div>

					{/* Categories List */}
					<div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white/90 shadow-lg backdrop-blur">
						<div className="border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
							<h2 className="text-xl font-semibold text-white">All Categories</h2>
						</div>
						<div className="space-y-4 p-6">
							{categories.map((category) => (
								<div
									key={category.id}
									className="group flex gap-4 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition hover:shadow-md"
								>
									{/* Thumbnail */}
									{category.imageUrl ? (
										<img
											src={category.imageUrl}
											alt={category.name}
											className="h-16 w-16 rounded-md border border-slate-200 object-cover shadow-sm"
										/>
									) : (
										<div className="flex h-16 w-16 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-xs text-slate-400">
											No Image
										</div>
									)}

									<div className="flex flex-1 items-start justify-between">
										<div>
											<h3 className="text-lg font-semibold text-slate-800">
												{category.name}
											</h3>
											<p className="mt-1 text-sm text-slate-600">
												{category.description}
											</p>
											<p className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
												<span>📊</span>
												{category.eventCount} events
											</p>
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => handleEdit(category)}
												className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:from-blue-500 hover:to-indigo-500"
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(category.id)}
												className="rounded-lg bg-gradient-to-r from-rose-500 to-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:from-rose-400 hover:to-red-500"
											>
												Delete
											</button>
										</div>
									</div>
								</div>
							))}

							{categories.length === 0 && (
								<p className="py-8 text-center text-sm text-slate-500">
									No categories yet. Add your first category above.
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
