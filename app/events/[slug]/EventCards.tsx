"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import type { EventCard } from "./eventcontent";
import { useNavigationState } from "@/lib/useNavigationState";

export default function EventCards({ cards }: { cards: EventCard[] }) {
  const router = useRouter();
  const params = useParams();
  const currentSlug = params?.slug as string;

  const { startTransition } = useNavigationState();

  const handleRegisterClick = (cardName: string) => {
    startTransition();
    // Slugify the event name for the URL
    // e.g. "Battle of Bands" -> "battle-of-bands"
    const eventSlug = cardName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/events/${currentSlug}/${eventSlug}`);
  };

  return (
    <>
      {/* EVENTS GRID */}
      <section className="px-4 sm:px-10 lg:px-24  pb-32">
        <div className="flex justify-center gap-10 flex-wrap">
          {cards.map((card, idx) => (
            <article
              key={idx}
              className="bg-[#111] w-[500px] rounded-sm overflow-hidden flex flex-col"
            >
              {/* IMAGE */}
              <div className="relative h-[320px]">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 500px"
                  className="object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h2 className="font-adventor text-[40px] leading-tight">
                  {card.name}
                </h2>

                <p className="text-sm text-[#c0c0c0] leading-relaxed">
                  {card.description.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>

              {/* FOOTER */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => handleRegisterClick(card.name)}
                  className="
                    w-full h-[52px]
                    bg-white text-black
                    flex items-center justify-center gap-2
                    hover:bg-[#b41c32] hover:text-white font-jqka
                    text-2xl md:text-3xl
                    transition-all duration-150 rounded-sm cursor-pointer
                  "
                >
                  Register
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
