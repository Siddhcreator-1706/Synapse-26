import Link from 'next/link';
import type { ReactNode } from 'react';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

export const metadata = {
	title: 'Admin | Synapse',
	description: 'Admin dashboard for Synapse',
};

const navItems = [
	{ href: '/admin', label: 'Dashboard' },
	{ href: '/admin/events', label: 'Events' },
	{ href: '/admin/events/categories', label: 'Categories' },
	{ href: '/admin/registrations', label: 'Registrations' },
	{ href: '/admin/users', label: 'Users' },
	{ href: '/admin/sponsors', label: 'Sponsors' },
	{ href: '/admin/accommodation', label: 'Accommodation' },
	{ href: '/admin/concerts', label: 'Concerts' },
	{ href: '/admin/artists', label: 'Artists' },
	{ href: '/admin/merchandise', label: 'Merchandise' },
	{ href: '/admin/merchandise/orders', label: 'Orders' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<AdminAuthGuard>
			<div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-cyan-100 text-slate-900">
				<div className="flex min-h-screen">
					<aside className="w-64 border-r border-slate-800/20 bg-slate-900 text-slate-50 shadow-xl">
						<div className="px-6 py-5 border-b border-slate-800/50 bg-gradient-to-r from-slate-900 to-slate-800">
							<h1 className="text-xl font-semibold tracking-wide">Synapse Admin</h1>
						</div>
						<nav className="px-4 py-4 space-y-1">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-100/90 transition-colors hover:bg-teal-500/20 hover:text-white"
								>
									{item.label}
								</Link>
							))}
						</nav>
					</aside>

					<main className="flex-1 p-6">
						<div className="max-w-6xl mx-auto space-y-6 rounded-2xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur">
							{children}
						</div>
					</main>
				</div>
			</div>
		</AdminAuthGuard>
	);
}
