'use client';

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const NUMBERS = "0123456789";
const FIRST_PHASE_TIME = 4000;

export default function HeroSection() {
    const [isLoading, setIsLoading] = useState(true);
    const [showEnter, setShowEnter] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [part3Active, setPart3Active] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
    });

    const svgContainerRef = useRef<HTMLDivElement>(null);
    const progressTextRef = useRef<HTMLDivElement>(null);
    const enterBtnRef = useRef<HTMLButtonElement>(null);
    const cardRef = useRef<HTMLImageElement>(null);
    const coloredImageRef = useRef<HTMLImageElement>(null);
    const maskLayerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const toggleRef = useRef<HTMLDivElement>(null);
    const part3Ref = useRef<HTMLDivElement>(null);
    const part3_2Ref = useRef<HTMLDivElement>(null);
    const screenContainerRef = useRef<HTMLDivElement>(null);
    const flipCardRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const daysRef = useRef<HTMLHeadingElement>(null);
    const hoursRef = useRef<HTMLHeadingElement>(null);
    const minutesRef = useRef<HTMLHeadingElement>(null);

    const assetsRef = useRef({
        paths: [] as SVGPathElement[],
        loaded: 0,
        total: 0,
        finished: false,
        strokeProgress: 0,
        strokeStartTime: 0,
        assetProgress: 0,
        pending: new Set<string>(),
        resolved: new Set<string>()
    });
    const PRELOAD_ASSETS = [
        // Hero visuals
        "/RedHand.png",
        "/redcard3.png",
        "/card_center.png",
        "/Logo_Synapse.png",

        // About section
        "/Group_9.png",

    ];

    const updateCountdown = useCallback(() => {
        const targetDate = new Date(2026, 1, 26, 0, 0, 0);
        const now = new Date();
        let diff = targetDate.getTime() - now.getTime();

        if (diff <= 0) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0 });
            return;
        }

        const totalMinutes = Math.floor(diff / (1000 * 60));
        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minutes = totalMinutes % 60;

        setTimeLeft({ days, hours, minutes });
    }, []);

    const updateProgressText = useCallback((progress: number) => {
        if (progressTextRef.current) {
            progressTextRef.current.textContent = `Loading ${Math.round(progress * 100)}%`;
        }
        setLoadingProgress(Math.round(progress * 100));
    }, []);

    const scrambleTween = useCallback((element: HTMLElement, finalText: string) => {
        const chars = finalText.split("");

        return gsap.to({}, {
            duration: 0.6,
            onUpdate: function () {
                const p = (this as any).progress();
                let out = "";

                chars.forEach((ch, i) => {
                    if (i < p * chars.length) {
                        out += ch;
                    } else if (/[A-Za-z]/.test(ch)) {
                        out += LETTERS[Math.floor(Math.random() * LETTERS.length)];
                    } else if (/[0-9]/.test(ch)) {
                        out += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
                    } else {
                        out += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    }
                });

                element.textContent = out;
            },
            onComplete: () => {
                element.textContent = finalText;
            },
            onReverseComplete: () => {
                element.textContent = "";
            }
        });
    }, []);

    const loadSVG = useCallback(async () => {
        try {
            const res = await fetch("/uncolored2.svg");
            if (!res.ok) throw new Error();
            const svgText = await res.text();
            if (svgContainerRef.current) {
                svgContainerRef.current.innerHTML = svgText;
            }
        } catch {
            if (svgContainerRef.current) {
                svgContainerRef.current.innerHTML = `
                    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 100h600v400H100z" />
                        <circle cx="400" cy="300" r="120" />
                    </svg>
                `;
            }
        }

        const svg = svgContainerRef.current?.querySelector("svg");
        if (svg) {
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.style.width = "100%";
            svg.style.height = "100%";
            svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
            const pathsArray = Array.from(svg.querySelectorAll("path, circle")) as SVGPathElement[];
            assetsRef.current.paths = pathsArray;

            pathsArray.forEach(p => {
                p.style.fillOpacity = "0";
                p.style.stroke = "#ffffff";
                p.style.strokeWidth = "1.6";

                const len = p.getTotalLength();
                p.style.strokeDasharray = `${len}`;
                p.style.strokeDashoffset = `${len}`;
                (p as any).dataset.len = len;
            });

        }
    }, []);

    const revealFill = useCallback(() => {
        if (progressTextRef.current) {
            progressTextRef.current.style.opacity = "0";
        }

        setTimeout(() => {
            if (enterBtnRef.current) {
                setShowEnter(true);
            }
        }, 600);
    }, []);

    const drawStroke = useCallback(() => {
        const now = Date.now();
        const elapsed = now - assetsRef.current.strokeStartTime;

        // Time-based (0 → 50%)
        const timeProgress = Math.min(1, elapsed / FIRST_PHASE_TIME);

        // Asset-based (50 → 100%)
        const combinedProgress =
            0.5 * timeProgress +
            0.5 * assetsRef.current.assetProgress;

        assetsRef.current.strokeProgress +=
            (combinedProgress - assetsRef.current.strokeProgress) * 0.12;

        assetsRef.current.paths.forEach(p => {
            p.style.strokeDashoffset =
                `${Number((p as any).dataset.len) * (1 - assetsRef.current.strokeProgress)}`;
        });

        updateProgressText(assetsRef.current.strokeProgress);

        const timeDone = elapsed >= FIRST_PHASE_TIME;
        const assetsDone = assetsRef.current.assetProgress >= 0.9;

        if (timeDone && assetsDone && !assetsRef.current.finished) {
            assetsRef.current.finished = true;
            revealFill();
            return;
        }

        requestAnimationFrame(drawStroke);
    }, [updateProgressText, revealFill]);

    const loadAssets = useCallback(() => {
        // Reset loader state
        assetsRef.current.loaded = 0;
        assetsRef.current.total = PRELOAD_ASSETS.length;
        assetsRef.current.assetProgress = 0;
        assetsRef.current.finished = false;

        // Load SVG immediately (not part of progress math)
        loadSVG().then(() => {
            assetsRef.current.strokeStartTime = Date.now();
            drawStroke();
        });

        const markLoaded = () => {
            assetsRef.current.loaded += 1;
            assetsRef.current.assetProgress = Math.min(
                1,
                assetsRef.current.loaded / assetsRef.current.total
            );
        };

        PRELOAD_ASSETS.forEach(src => {
            // IMAGE
            if (/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(src)) {
                const img = new Image();
                img.src = src;

                if (img.complete) {
                    markLoaded();
                } else {
                    img.onload = markLoaded;
                    img.onerror = markLoaded;
                }
                return;
            }

            // AUDIO / VIDEO
            if (/\.(mp3|wav|ogg|mp4|webm)$/i.test(src)) {
                const media = document.createElement("audio");
                media.src = src;
                media.preload = "auto";

                if (media.readyState >= 3) {
                    markLoaded();
                } else {
                    media.addEventListener("canplaythrough", markLoaded, { once: true });
                    media.addEventListener("error", markLoaded, { once: true });
                }
            }
        });
    }, [loadSVG, drawStroke]);

    const lockScroll = useCallback(() => {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
    }, []);

    const unlockScroll = useCallback(() => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        ScrollTrigger.refresh(true);
    }, []);

    const toggleMusic = useCallback(async () => {
        if (!audioRef.current) return;

        try {
            if (audioRef.current.paused) {
                await audioRef.current.play();
                setIsMusicPlaying(true);
            } else {
                audioRef.current.pause();
                setIsMusicPlaying(false);
            }
        } catch (e) {
            console.log("Audio play blocked:", e);
        }
    }, []);


    const handleEnter = useCallback((): void => {
        // Disable button immediately
        if (enterBtnRef.current) {
            enterBtnRef.current.style.pointerEvents = "none";
            enterBtnRef.current.style.opacity = "0";
        }

        setIsMusicPlaying(true);
        audioRef.current?.play().catch(() => { });

        // 🔑 Trigger render of maskLayer
        setIsLoading(false);
    }, []);

    const initScrollAnimations = useCallback(() => {
        if (!screenContainerRef.current || !part3_2Ref.current || !flipCardRef.current ||
            !part3Ref.current || !titleRef.current) return;

        // Pin the hero
        gsap.set(screenContainerRef.current, {
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden"
        });

        gsap.set(part3_2Ref.current, {
            rotateY: 180,
            transformOrigin: "center center",
            backfaceVisibility: "hidden"
        });

        // Master timeline for all animations
        const masterTL = gsap.timeline({
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "+=500%",
                scrub: 2.5,
                pin: true,
                pinSpacing: false,
                anticipatePin: 1.2
            }
        });

        masterTL.set("#part3_2", {
            scale: 0.2,
            rotation: 180
        })
            .to("#redCard", {
                rotation: 180,
                scale: 0.5,
                duration: 1,
                ease: "none"
            })
            .to(flipCardRef.current, {
                rotationY: 180,
                duration: 1,
                ease: "none"
            },)
            .to("#part3_2", {
                rotation: 360,
                duration: 1.5,
                scale: 1,
                ease: "none"
            })
            .addLabel("part3Reveal")
            .set("#part3", { opacity: 1 }, "part3Reveal")
            .from(
                [
                    "#part3 nav .fa-bars",
                    "#part3 #musicToggle",
                    "#part3 .register-btn"
                ],
                {
                    x: 100,
                    opacity: 0,
                    ease: "power3.out",
                    stagger: 0.2
                },
                "part3Reveal+=0.4"
            )
            .from(
                ["#part3 nav .logo", "#part3 .countdown .time-block"],
                {
                    x: -100,
                    opacity: 0,
                    ease: "power3.out",
                    stagger: 0.15
                },
                "part3Reveal+=0.4"
            )
            .from(
                "#part3 .title-wrapper",
                { opacity: 0 },
                "part3Reveal"
            )
            .add(
                scrambleTween(titleRef.current, "Synapse'26"),
                "part3Reveal+=0.2"
            )
            .to(".screen-container", { duration: 0.5, ease: "power2.inOut" })
            .addLabel("part3Hide")
            .to(
                [
                    "#part3 nav .fa-bars",
                    "#part3 #musicToggle",
                    "#part3 .register-btn"
                ],
                {
                    x: 100,
                    opacity: 0,
                    ease: "power3.out",
                    stagger: 0.2
                },
                "part3Hide+=0.2"
            )
            .to(
                [
                    "#part3 nav .logo",
                    "#part3 .countdown .time-block"
                ],
                {
                    x: -100,
                    opacity: 0,
                    ease: "power3.out",
                    stagger: 0.15
                },
                "part3Hide+=0.2"
            )
            .to(
                "#part3 .title-wrapper",
                { opacity: 0 },
                "part3Hide+=0.15"
            )
            .to(".screen-container", { rotationZ: 185, duration: 1.5, scale: 0.25, ease: "none" })
            .to(".screen-container", { rotationY: 180, duration: 1, ease: "none" })
            .to(".screen-container", { rotationZ: 420, duration: 2, scale: 0.15, ease: "none" })
            .to(".screen-container", { duration: 2, ease: "none" });

    }, [scrambleTween]);
    const hasRunMaskRef = useRef(false);

    useLayoutEffect(() => {
        if (isLoading) return;
        if (!maskLayerRef.current) return;
        if (hasRunMaskRef.current) return;

        gsap.to(maskLayerRef.current, {
            duration: 4,
            ease: "power2.inOut",
            webkitMaskSize: "cover",
            maskSize: "cover",
            onComplete: () => {
                if (svgContainerRef.current) {
                    svgContainerRef.current.style.display = "none";
                }

                initScrollAnimations();

                const endSection = document.querySelector(".end");
                if (endSection) {
                    (endSection as HTMLElement).style.display = "flex";
                }

                unlockScroll();
            }
        });
    }, [isLoading, initScrollAnimations, unlockScroll]);

    useEffect(() => {
        lockScroll();
        loadAssets();

        updateCountdown();
        const timer = setInterval(updateCountdown, 60000);

        return () => {
            clearInterval(timer);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [loadAssets, lockScroll, updateCountdown]);

    useEffect(() => {
        requestAnimationFrame(() => {
            loadAssets();
        });
    }, []);

    return (
        <div>
            <div id="svgContainer" className="fixed inset-0 z-10 transition-opacity duration-2400" ref={svgContainerRef} />

            {isLoading ? (
                <>
                    <div id="progress" ref={progressTextRef} className=" fixed bottom-[5%] right-[2%] text-white text-[40px] tracking-[2px] z-11 transition-opacity duration-600">
                        Loading {loadingProgress}%
                    </div>
                    <button id="enterBtn" ref={enterBtnRef} onClick={handleEnter} className={`fixed left-1/2 -translate-x-1/2 bottom-[10%] scale-90 px-[40px] py-[8px] text-[40px] text-white bg-transparent border-[5px] border-white rounded-[10px] cursor-pointer opacity-0 z-40 shadow-[10px_10px_0px_#ff0000] transition-all duration-200 font-['Roboto',sans-serif] pointer-events-auto hover:bg-[#EB0000] hover:text-black hover:border-black hover:shadow-[10px_10px_0px_#ffffff] ${showEnter
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-90 pointer-events-none"}`}>
                        Enter
                    </button>
                </>
            ) : (
                <div className="hero relative inset-0 h-screen z-25" ref={heroRef}>
                    <div id="maskLayer" className="absolute inset-0 opacity-100 " ref={maskLayerRef} style={{
                        WebkitMaskImage: 'url("/inkReveal2.gif")',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        WebkitMaskSize: '0% 0%',
                        maskImage: 'url("/inkReveal2.gif")',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        maskSize: '0% 0%',
                    }}>
                        <img id="coloredImage" src="/RedHand.png" alt="Red Hand" ref={coloredImageRef} className="absolute inset-0 h-full w-full object-cover pointer-events-none" />

                        <div id="flipCard" className="absolute inset-0 transform-3d" ref={flipCardRef}>
                            <img id="redCard" className="absolute inset-0 w-full h-full object-cover pointer-events-none backface-hidden" src="/redcard3.png" alt="Red Card" ref={cardRef} />

                            <div id="part3_2" ref={part3_2Ref} style={{
                                backgroundImage:
                                    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.75) 85%, #000 100%), url(/image_part3_2.jpg)",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }} className=" absolute inset-0 flex flex-col items-center justify-center opacity-100 will-change-transform backface-hidden transform-[rotateY(180deg)]">
                                <div className="screen-container relative w-screen h-screen flex items-center justify-center perspective-[1000px] transform-3d" ref={screenContainerRef}>
                                    <div className="screen-front absolute inset-0 bg-black bg-[url('/part3-image.png')] bg-no-repeat bg-center bg-contain z-2 backface-hidden"></div>
                                    <div className="center-joker-container absolute inset-0 flex items-center justify-center transform-[rotateY(180deg)] backface-hidden z-1">
                                        <img src="/card_center.png" className="center-joker w-full h-auto rotate-[-64deg] object-contain" alt="Joker Card" />
                                    </div>
                                </div>
                            </div>

                            <div id="part3" ref={part3Ref} className={`absolute inset-0 w-full h-screen transform-[rotateY(180deg)] backface-hidden ${part3Active ? "pointer-events-auto" : "pointer-events-none"}
  `}>
                                <nav className="h-[100px] pt-[20px] px-[40px] flex justify-between items-center">
                                    <img src="/Logo_Synapse.png" className="logo w-[70px]" alt="Logo" />
                                    <div className="symbols flex gap-[30px] items-center">
                                        <i className="fa-solid fa-bars fa-2xl"></i>
                                        <div
                                            id="musicToggle"
                                            ref={toggleRef}
                                            onClick={toggleMusic}
                                            className=" relative w-[44px] h-[44px] rounded-full border-2 border-white flex items-center justify-center cursor-pointer pointer-events-auto">
                                            <div className="flex items-center gap-[4px] h-[20px]">
                                                {[
                                                    { scale: 0.45, delay: "0s" },
                                                    { scale: 0.7, delay: "0.12s" },
                                                    { scale: 1.15, delay: "0.24s" },
                                                    { scale: 0.7, delay: "0.12s" },
                                                    { scale: 0.45, delay: "0s" },
                                                ].map((item, i) => (
                                                    <span
                                                        key={i}
                                                        className={`w-[3px] h-[14px] bg-white rounded-[2px] origin-center ${isMusicPlaying ? "animate-[equalizerWeighted_1.2s_ease-in-out_infinite]" : ""}`}
                                                        style={{
                                                            ["--base-scale" as any]: item.scale,
                                                            animationDelay: item.delay,
                                                            animationPlayState: isMusicPlaying ? "running" : "paused",
                                                            transform: isMusicPlaying ? undefined : "scaleY(0.2)",
                                                        }}
                                                    />
                                                ))}

                                            </div>
                                            <span
                                                className={`absolute w-[2px] h-[44px] bg-white rotate-45 transition-opacity duration-200 ${isMusicPlaying ? "opacity-0" : "opacity-100"}`}
                                            />
                                        </div>
                                    </div>
                                </nav>

                                <div className="title-wrapper flex justify-center pt-[40px] h-[calc(100vh-280px)]">
                                    <h1 className="title text-[140px] font-joker leading-none" ref={titleRef}>Synapse&apos;26</h1>
                                </div>

                                <div className="countdown absolute bottom-[40px] left-[40px] flex gap-[50px]">
                                    <div className="time-block relative flex flex-col items-center">
                                        <h2 className="text-[60px] font-normal leading-[1.1]" ref={daysRef}>{timeLeft.days}</h2>
                                        <h3 className="text-[26px] font-normal opacity-90">Days</h3>
                                        <span className="absolute translate-x-[180%] text-[60px] font-normal font-mono leading-none">
                                            :
                                        </span>
                                    </div>
                                    <div className="time-block relative flex flex-col items-center">
                                        <h2 className="text-[60px] font-normal leading-[1.1]" ref={hoursRef}>{timeLeft.hours}</h2>
                                        <h3 className="text-[26px] font-normal opacity-90">Hours</h3>
                                        <span className="absolute translate-x-[180%] text-[60px] font-normal font-mono leading-none">
                                            :
                                        </span>
                                    </div>
                                    <div className="time-block relative flex flex-col items-center">
                                        <h2 className="text-[60px] font-normal leading-[1.1]" ref={minutesRef}>{timeLeft.minutes}</h2>
                                        <h3 className="text-[26px] font-normal opacity-90">Minutes</h3>
                                    </div>
                                </div>

                                <div className="register-btn absolute bottom-[40px] right-[40px]">
                                    <button className="but px-[28px] py-[10px] text-[36px] border-[5px] border-white rounded-[10px] bg-transparent text-white shadow-[10px_10px_0px_#EB0000] transition-all duration-300 font-['Roboto',sans-serif] hover:bg-[#EB0000] hover:text-black hover:border-black hover:scale-105 hover:shadow-[10px_10px_0px_rgba(255,255,255,0.7)]">Register</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <audio
                ref={audioRef}
                id="bgMusic"
                src="/Synapse_Music.mp3"
                loop
                preload="auto"
            />
        </div>
    );

}