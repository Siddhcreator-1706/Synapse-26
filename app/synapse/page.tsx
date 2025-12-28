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
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          {/* Brand gradient overlays for depth - using brand colors */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-60" 
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.1) 40%, rgba(239,68,68,0.05) 70%, transparent 100%)',
            }}
          />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-50"
            style={{
              background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, rgba(236,72,153,0.08) 40%, rgba(168,85,247,0.05) 70%, transparent 100%)',
            }}
          />
          
          {/* Subtle grid pattern with brand color tint */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(236,72,153,0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(236,72,153,0.3) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 lg:py-40">
          <div className="max-w-4xl">
            {/* Title with improved styling */}
            <div className="mb-12 md:mb-16">
              <div className="inline-block mb-4">
                <span 
                  className="text-sm md:text-base font-semibold tracking-widest uppercase"
                  style={{
                    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  The Story
                </span>
                <div 
                  className="h-0.5 w-16 mt-2"
                  style={{
                    background: "linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
                  }}
                />
              </div>
              <h1
                ref={titleRef}
                className="text-6xl md:text-7xl lg:text-8xl font-black leading-none opacity-0"
                style={{
                  fontFamily: "var(--font-bebas), 'Bebas Neue', 'Impact', sans-serif",
                  letterSpacing: "0.05em",
                  background: "linear-gradient(135deg, #ffffff 0%, #f3f4f6 50%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "0 0 80px rgba(168, 85, 247, 0.3), 0 0 40px rgba(236, 72, 153, 0.2), 0 4px 20px rgba(0, 0, 0, 0.5)",
                  filter: "drop-shadow(0 0 30px rgba(168, 85, 247, 0.2))",
                }}
              >
                ABOUT SYNAPSE
              </h1>
            </div>

            {/* Paragraphs with improved typography and spacing */}
            <div className="space-y-8 md:space-y-10">
              <p
                ref={paragraph1Ref}
                className="opacity-0 text-white/90 text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-loose font-light"
              >
                Synapse is more than a college fest – it&apos;s an experience. A
                convergence of creativity, competition, culture, and chaos, Synapse
                brings together minds that dare to think, perform, and challenge the
                ordinary.
              </p>

              <p
                ref={paragraph2Ref}
                className="opacity-0 text-white/90 text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-loose font-light"
              >
                This year, Synapse &apos;26 invites you into{" "}
                <span className="font-semibold relative inline-block">
                  <span
                    style={{
                      background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    The Joker&apos;s Realm
                  </span>
                  <span 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 opacity-40"
                    style={{
                      background: "linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
                    }}
                  />
                </span>
                {" "}— a world where every choice is a move, every event is a game, and
                nothing is ever as simple as it seems. Inspired by the concept of{" "}
                <span className="font-semibold relative inline-block">
                  <span
                    style={{
                      background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    House of Cards
                  </span>
                  <span 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 opacity-40"
                    style={{
                      background: "linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
                    }}
                  />
                </span>
                , the realm is ruled by unpredictability, strategy, and thrill.
              </p>

              <p
                ref={paragraph3Ref}
                className="opacity-0 text-white/90 text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-loose font-light"
              >
                From high-energy concert nights and intense competitions to immersive
                events spread across four action-packed days, Synapse &apos;26 transforms
                the campus into a playground of possibilities. Step in, choose your
                game, and remember – in the Joker&apos;s Realm,{" "}
                <span className="font-semibold italic relative inline-block">
                  <span
                    style={{
                      background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    the game is always watching.
                  </span>
                  <span 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 opacity-40"
                    style={{
                      background: "linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)",
                    }}
                  />
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Diagonal Divider with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 md:h-56 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-white"
            style={{
              clipPath: "polygon(0 50%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </div>
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
