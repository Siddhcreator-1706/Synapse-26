"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavigationState } from "@/lib/useNavigationState";
import TransitionOverlay from "./TransitionOverlay";


export default function TransitionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { startTransition, endTransition, isFirstLoad, isTransitioning, loadingCount } =
        useNavigationState();

    // Smart Loading Logic
    useEffect(() => {
        if (!isTransitioning) return;

        const startTime = Date.now();
        const MIN_DURATION = 4000; // Minimum time to show loader
        const MAX_DURATION = 20000; // Fail-safe max time

        // Check constantly if we can dismiss
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;

            // If we exceeded max duration, force close
            if (elapsed > MAX_DURATION) {
                endTransition();
                clearInterval(interval);
                return;
            }

            // Only close if:
            // 1. Min duration passed
            // 2. No active loading requests
            if (elapsed > MIN_DURATION && loadingCount === 0) {
                endTransition();
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isTransitioning, loadingCount, endTransition]);

    return (
        <>
            <TransitionOverlay />
            {children}
        </>
    );
}
