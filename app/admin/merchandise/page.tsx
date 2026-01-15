"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MerchandisePage() {
	const router = useRouter();

	useEffect(() => {
		router.push("/admin/merchandise/management");
	}, [router]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
				<p className="text-sm text-slate-600">Redirecting to merchandise management...</p>
			</div>
		</div>
	);
}
