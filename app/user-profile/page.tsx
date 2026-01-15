"use client"

import gsap from 'gsap';
import React, { useEffect } from 'react';
import UserProfile from '@/components/user-profile';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function page() {
    useEffect(() => {
        ScrollTrigger.normalizeScroll({
            allowNestedScroll: true,
        })
    }, [])
    return (
        <>
            <UserProfile />
        </>
    )
}