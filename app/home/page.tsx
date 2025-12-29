"use client";

import HeroSection from "@/components/HomeMainSection";
import AboutSection from "@/components/HomeAboutSection";
import JokerSection from "@/components/HomeJokerSection";
import Artists from "@/components/HomeArtists";
import HallOfFame from "@/components/HomeHallOfFame";
import Footer from "@/components/HomeFooter";

export default function HomeSection() {
  return (
    <main className="flex flex-col ">
      <HeroSection />
      <div className="end hidden overflow-x-hidden w-full flex-col relative top-[500vh]">
        <AboutSection />
        <JokerSection />
        <Artists />
        <HallOfFame />
        <Footer />
      </div>
    </main>
  );
}
