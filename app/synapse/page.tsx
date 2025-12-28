"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSection } from "@/components/HeroSection";
import Events from "@/components/Synapse-Events";
import HallOfFame from "@/components/Synapse-HallOfFame";
import Footer from "@/components/ui/Footer";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/Resizable-navbar";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const navItems = [
  { name: "Home", link: "/" },
  { name: "Events", link: "/events" },
  { name: "About", link: "/about" },
  { name:"Merchandise", link: "/merchandise" },
];

export default function Synapse() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // About section refs
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraph1Ref = useRef<HTMLParagraphElement>(null);
  const paragraph2Ref = useRef<HTMLParagraphElement>(null);
  const paragraph3Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // About Section Scroll Animation
      if (aboutSectionRef.current) {
        ScrollTrigger.create({
          trigger: aboutSectionRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            // Title animation
            if (titleRef.current) {
              gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: -30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
              );
            }

            // Paragraph animations
            if (paragraph1Ref.current) {
              gsap.fromTo(
                paragraph1Ref.current,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
              );
            }

            if (paragraph2Ref.current) {
              gsap.fromTo(
                paragraph2Ref.current,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 0.4 }
              );
            }

            if (paragraph3Ref.current) {
              gsap.fromTo(
                paragraph3Ref.current,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 0.6 }
              );
            }
          },
        });
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative bg-black overflow-x-hidden">
      {/* Navbar - Fixed */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => setMobileMenuOpen(false)}
                className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400"
              >
                {item.name}
              </a>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Section 1: Hero Section */}
      <section className="relative min-h-screen">
        <HeroSection />
      </section>

      {/* Section 2: About Section */}
      <section
        ref={aboutSectionRef}
        className="relative min-h-screen bg-black overflow-hidden"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
          <div className="grid grid-cols-1 gap-12 lg:gap-16 items-start">
            {/* Left Column - Text Content */}
            <div className="space-y-8 md:space-y-10">
              {/* Title */}
              <h1
                ref={titleRef}
                className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none opacity-0"
                style={{
                  fontFamily: "var(--font-bebas), 'Bebas Neue', 'Impact', sans-serif",
                  letterSpacing: "0.05em",
                  textShadow: "0 0 40px rgba(255, 255, 255, 0.1)",
                }}
              >
                ABOUT SYnapse
              </h1>

              {/* Paragraphs */}
              <div className="space-y-6 md:space-y-8 text-white/90 text-lg md:text-xl leading-relaxed">
                <p
                  ref={paragraph1Ref}
                  className="opacity-0"
                >
                  Synapse is more than a college fest – it&apos;s an experience. A
                  convergence of creativity, competition, culture, and chaos, Synapse
                  brings together minds that dare to think, perform, and challenge the
                  ordinary.
                </p>

                <p
                  ref={paragraph2Ref}
                  className="opacity-0"
                >
                  This year, Synapse &apos;26 invites you into{" "}
                  <span className="text-red-400 font-semibold">The Joker&apos;s Realm</span>{" "}
                  — a world where every choice is a move, every event is a game, and
                  nothing is ever as simple as it seems. Inspired by the concept of{" "}
                  <span className="text-red-400 font-semibold">House of Cards</span>, the
                  realm is ruled by unpredictability, strategy, and thrill.
                </p>

                <p
                  ref={paragraph3Ref}
                  className="opacity-0"
                >
                  From high-energy concert nights and intense competitions to immersive
                  events spread across four action-packed days, Synapse &apos;26 transforms
                  the campus into a playground of possibilities. Step in, choose your
                  game, and remember – in the Joker&apos;s Realm,{" "}
                  <span className="text-red-400 font-semibold italic">
                    the game is always watching.
                  </span>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Diagonal Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-white"
            style={{
              clipPath: "polygon(0 60%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      </section>

      {/* Content Sections */}
      <div className="relative z-10">
        {/* Section 4: Events */}
        <Events />
        {/* Section 5: Hall of Fame */}
        <HallOfFame />
        {/* Section 6: Footer */}
        <Footer />
      </div>
    </div>
  );
}
