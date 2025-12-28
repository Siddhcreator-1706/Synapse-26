"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        ScrollTrigger.create({
          trigger: titleRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              titleRef.current,
              { opacity: 0, y: 30, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "expo.out",
              }
            );
          },
        });
      }

      // Contact section animation
      if (contactSectionRef.current) {
        ScrollTrigger.create({
          trigger: contactSectionRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            const items = contactSectionRef.current?.querySelectorAll(".contact-item");
            if (items && items.length > 0) {
              gsap.fromTo(
                items,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "power2.out",
                  stagger: 0.1,
                }
              );
            }
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative w-full bg-black overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/30 to-black">
          {/* Subtle animated particles */}
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-pink-500/60 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-500/60 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
          <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-red-500/50 rounded-full animate-pulse" style={{ animationDelay: '800ms' }} />
          <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-pink-400/60 rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
          <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: '1200ms' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
        {/* SYNAPSE Title */}
        <div className="text-center mb-20 md:mb-24">
          <h1
            ref={titleRef}
            className="text-7xl md:text-9xl lg:text-[10rem] font-black text-white leading-none opacity-0 mb-4"
            style={{
              fontFamily: "var(--font-bebas), 'Bebas Neue', 'Impact', sans-serif",
              letterSpacing: "0.05em",
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SYNAPSE
          </h1>
          <p className="text-white/60 text-lg md:text-xl tracking-wider">
            DA KA TYOHAAR
          </p>
        </div>

        {/* Contact Section */}
        <div
          ref={contactSectionRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16 mb-20"
        >
          {/* Left Column - Contact Persons */}
          <div className="space-y-8 contact-item opacity-0">
            <div>
              <h2
                className="text-4xl md:text-5xl font-black text-white leading-none mb-3"
                style={{
                  fontFamily: "var(--font-bebas), 'Bebas Neue', 'Impact', sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                CONTACT
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            </div>
            <div className="space-y-6">
              <div>
                <p className="font-bold text-white text-lg md:text-xl mb-2">Vivek Chaudhari</p>
                <Link
                  href="tel:+916354042414"
                  className="text-white/70 hover:text-pink-400 transition-colors text-base md:text-lg block"
                >
                  +91 6354 042 414
                </Link>
              </div>
              <div>
                <p className="font-bold text-white text-lg md:text-xl mb-2">Harshali Dharmik</p>
                <Link
                  href="tel:+917600051765"
                  className="text-white/70 hover:text-pink-400 transition-colors text-base md:text-lg block"
                >
                  +91 7600 051 765
                </Link>
              </div>
              <div>
                <p className="font-bold text-white text-lg md:text-xl mb-2">Kushal Desai</p>
                <Link
                  href="tel:+919727055132"
                  className="text-white/70 hover:text-pink-400 transition-colors text-base md:text-lg block"
                >
                  +91 9727 055 132
                </Link>
              </div>
            </div>
          </div>

          {/* Middle Column - Address */}
          <div className="space-y-8 contact-item opacity-0">
            <div>
              <h2
                className="text-4xl md:text-5xl font-black text-white leading-none mb-3"
                style={{
                  fontFamily: "var(--font-bebas), 'Bebas Neue', 'Impact', sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                LOCATION
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            </div>
            <div className="text-white/80 text-base md:text-lg leading-relaxed">
              <p>
                DAIICT-campus, near Reliance Cross Rd,
                <br />
                Gandhinagar, Gujarat 382007
              </p>
            </div>
          </div>

          {/* Right Column - Email & Logo */}
          <div className="space-y-8 contact-item opacity-0">
            <div>
              <h2
                className="text-4xl md:text-5xl font-black text-white leading-none mb-3"
                style={{
                  fontFamily: "var(--font-bebas), 'Bebas Neue', 'Impact', sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                EMAIL
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            </div>
            <div className="space-y-4">
              <Link
                href="mailto:synapse.thefest@gmail.com"
                className="block text-white/70 hover:text-pink-400 transition-colors text-base md:text-lg"
              >
                synapse.thefest@gmail.com
              </Link>
              <Link
                href="mailto:synapse@daiict.ac.in"
                className="block text-white/70 hover:text-pink-400 transition-colors text-base md:text-lg"
              >
                synapse@daiict.ac.in
              </Link>
            </div>
            {/* Synapse Logo */}
            <div className="pt-4">
              <div className="relative w-16 h-16">
                <Image
                  src="/Synapse Logo.png"
                  alt="Synapse Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-white/10 pt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Social Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-pink-400 transition-colors text-base md:text-lg font-semibold uppercase tracking-wider contact-item opacity-0"
              >
                Facebook
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-pink-400 transition-colors text-base md:text-lg font-semibold uppercase tracking-wider contact-item opacity-0"
              >
                Instagram
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-pink-400 transition-colors text-base md:text-lg font-semibold uppercase tracking-wider contact-item opacity-0"
              >
                YouTube
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-white/50 text-sm md:text-base text-center md:text-right contact-item opacity-0">
              <p>© 2026 SYNAPSE. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
