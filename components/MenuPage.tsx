"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProniteMenuPage() {
  return (
    <div className="fixed inset-0 bg-black min-h-screen w-full overflow-y-auto text-white">

      {/* Logo */}
      <div className="absolute top-10 left-10">
        <Image
          src="/synapselogo.png"
          alt="Menu Icon"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Close button */}
      <button className="absolute top-8 right-10 text-4xl hover:text-red-600 transition">
        &times;
      </button>

      {/* Menu */}
      <div className="pt-32 pb-20 px-6 sm:px-10 md:px-20">
        <ul className="space-y-0">

          {[
            "PRONIGHT",
            "EVENTS",
            "TEAM",
            "SPONSORS",
            "MERCHANDISE",
            "ACCOMMODATION",
            "PROFILE",
            "TERMS AND CONDITION",
            "CONTACT US",
          ].map((item) => (
            <li key={item} className="menu-item group">
              <div className="text-wrapper">
                <span className="text default">{item}</span>
                <span className="text hover">{item}</span>
              </div>
              <span className="arrow">↗</span>
            </li>
          ))}

        </ul>
      </div>

      {/* Social Icons */}
      <div className="fixed bottom-8 right-10 flex gap-6 text-3xl">
        <Link href="https://instagram.com" target="_blank">
          <i className="fab fa-instagram hover:text-red-600 cursor-pointer"></i>
        </Link>
        <Link href="https://youtube.com" target="_blank">
          <i className="fab fa-youtube hover:text-red-600 cursor-pointer"></i>
        </Link>
        <Link href="https://facebook.com" target="_blank">
          <i className="fab fa-facebook hover:text-red-600 cursor-pointer"></i>
        </Link>
      </div>

      {/* Page-specific styles */}
      <style jsx global>{`
        @font-face {
          font-family: "CardCharacters";
          src: url("/cardc.TTF") format("truetype");
          font-weight: 400;
          font-style: normal;
        }

        body {
          font-family: "CardCharacters";
        }

        .menu-item {
          font-size: clamp(24px, 6vw, 80px);
          line-height: clamp(48px, 10vw, 120px);
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          cursor: pointer;
          font-weight: 400;
        }

        .text-wrapper {
          position: relative;
          overflow: hidden;
          height: clamp(48px, 10vw, 120px);
        }

        .text {
          position: absolute;
          left: 0;
          top: 0;
          transition: transform 0.5s ease;
        }

        .text.default {
          transform: translateY(0);
        }

        .text.hover {
          transform: translateY(100%);
        }

        .menu-item:hover .text.default {
          transform: translateY(-100%);
        }

        .menu-item:hover .text.hover {
          transform: translateY(0);
        }

        .menu-item:hover {
          color: red;
        }

        .arrow {
          font-size: clamp(35px, 8vw, 100px);
          transition: 0.3s ease;
          margin-left: clamp(10px, 2vw, 20px);
          flex-shrink: 0;
        }

        .menu-item:hover .arrow {
          transform: translateX(6px);
          color: red;
        }

        @media (max-width: 640px) {
          .menu-item {
            font-size: 24px;
            line-height: 48px;
          }

          .text-wrapper {
            height: 48px;
          }

          .arrow {
            font-size: 35px;
          }
        }
      `}</style>
    </div>
  );
}