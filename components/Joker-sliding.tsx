"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

interface JokerSlidingProps {
  className?: string;
  onComplete?: () => void;
  autoPlay?: boolean;
  delay?: number;
}

export default function JokerSliding({
  className = "",
  onComplete,
  autoPlay = true,
  delay = 0,
}: JokerSlidingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftHalfRef = useRef<HTMLDivElement>(null);
  const rightHalfRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;

    const ctx = gsap.context(() => {
      // Initial state - both halves together (overlapping at center)
      gsap.set([leftHalfRef.current, rightHalfRef.current], {
        x: 0,
        opacity: 0,
        scale: 1.05,
        force3D: true, // Enable GPU acceleration
      });

      // Initial fade-in animation with smooth ease
      const initialFade = gsap.timeline({
        defaults: { ease: "expo.out", force3D: true },
      });
      initialFade.to([leftHalfRef.current, rightHalfRef.current], {
        opacity: 1,
        scale: 1,
        duration: 0.8,
      });

      // Main split animation timeline
      const timeline = gsap.timeline({
        delay: delay + 1.0, // Slightly longer wait for smoother transition
        defaults: { ease: "expo.inOut", force3D: true },
        onComplete: () => {
          setIsAnimating(false);
          // Smooth fade out with better timing
          gsap.delayedCall(0.3, () => {
            if (containerRef.current) {
              gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "expo.out",
                force3D: true,
                onComplete: () => {
                  onComplete?.();
                },
              });
            } else {
              onComplete?.();
            }
          });
        },
      });

      // Break animation - split in half (separate outward) simultaneously with smooth easing
      timeline
        .to(
          leftHalfRef.current,
          {
            x: "-50%",
            duration: 1.8,
            ease: "expo.inOut",
          },
          0
        )
        .to(
          rightHalfRef.current,
          {
            x: "50%",
            duration: 1.8,
            ease: "expo.inOut",
          },
          0
        );
    }, containerRef);

    return () => ctx.revert();
  }, [autoPlay, delay, onComplete]);

  const triggerAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const ctx = gsap.context(() => {
      // Initial fade-in with smooth easing
      gsap.to([leftHalfRef.current, rightHalfRef.current], {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "expo.out",
        force3D: true,
      });

      // Main split animation timeline
      const timeline = gsap.timeline({
        delay: 1.0,
        defaults: { ease: "expo.inOut", force3D: true },
        onComplete: () => {
          setIsAnimating(false);
          // Smooth fade out
          gsap.delayedCall(0.3, () => {
            if (containerRef.current) {
              gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "expo.out",
                force3D: true,
                onComplete: () => {
                  onComplete?.();
                },
              });
            } else {
              onComplete?.();
            }
          });
        },
      });

      timeline
        .to(
          leftHalfRef.current,
          {
            x: "-50%",
            duration: 1.8,
            ease: "expo.inOut",
          },
          0
        )
        .to(
          rightHalfRef.current,
          {
            x: "50%",
            duration: 1.8,
            ease: "expo.inOut",
          },
          0
        );
    }, containerRef);

    return () => ctx.revert();
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-visible ${className}`}
      style={{
        opacity: 1,
      }}
    >
      {/* Left Half - Background and Image */}
      <div
        ref={leftHalfRef}
        className="absolute top-0 bottom-0 origin-left overflow-hidden"
        style={{
          width: "50%",
          height: "100%",
          left: 0,
          opacity: 0,
          willChange: "transform",
        }}
      >
        {/* Black background that moves with the half */}
        <div className="absolute inset-0 bg-black" />
        <Image
          src="/Joker-Slider.svg"
          alt="Joker's Realm"
          fill
          className="object-cover relative z-10"
          priority
          style={{
            objectPosition: "left center",
          }}
        />
      </div>

      {/* Right Half - Background and Image */}
      <div
        ref={rightHalfRef}
        className="absolute top-0 bottom-0 origin-right overflow-hidden"
        style={{
          width: "50%",
          height: "100%",
          right: 0,
          opacity: 0,
          willChange: "transform",
        }}
      >
        {/* Black background that moves with the half */}
        <div className="absolute inset-0 bg-black" />
        <Image
          src="/Joker-Slider.svg"
          alt="Joker's Realm"
          fill
          className="object-cover relative z-10"
          priority
          style={{
            objectPosition: "right center",
          }}
        />
      </div>

      {/* Optional: Trigger button for manual control */}
      {!autoPlay && (
        <button
          onClick={triggerAnimation}
          className="absolute inset-0 z-10 w-full h-full bg-transparent cursor-pointer"
          aria-label="Trigger animation"
        />
      )}
    </div>
  );
}
