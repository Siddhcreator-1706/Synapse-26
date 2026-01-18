"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Navbar,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  MobileAnimatedMenuItem,
} from "@/components/ui/Resizable-navbar";
import { useAuth } from "@/hooks/useAuth";

export default function NavigationPanel() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  // Dynamic nav items based on auth state
  const navItems = useMemo(() => {
    const baseItems = [
      { name: "home", link: "/" },
      { name: "about us", link: "/about" },
      { name: "events", link: "/events" },
      { name: "pronite", link: "/pronite" },
      { name: "timeline", link: "/timeline" },
      { name: "accomodation", link: "/accomodation" },
      { name: "merchandise", link: "/merchandise" },
      { name: "sponsors", link: "/sponsors" },
      { name: "terms and conditions", link: "/terms-and-conditions" },
      { name: "contact us", link: "#contact", isContact: true },
    ];

    // Add "My Profile" or "Register" based on auth state
    if (isAuthenticated) {
      baseItems.unshift({ name: "my profile", link: "/user-profile" });
    } else {
      baseItems.unshift({ name: "register", link: "/auth" });
    }

    return baseItems;
  }, [isAuthenticated]);

  const handleContactClick = (e: any) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const footer = document.getElementById("contact");
    if (!footer) return;

    footer.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <div ref={toggleRef}>
            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu
          ref={menuRef}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <MobileAnimatedMenuItem
              key={idx}
              name={item.name}
              link={item.link}
              onClick={(e) => {
                if (item.isContact) {
                  handleContactClick(e);
                } else {
                  setMobileMenuOpen(false);
                }
              }}
            />
          ))}
        </MobileNavMenu>
      </MobileNav>
    </>
  );
}
