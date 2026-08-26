"use client";

import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Recognition", href: "#recognition" },
  { label: "Arsenal", href: "#arsenal" },
  { label: "About", href: "#about" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const menuButton = menuButtonRef.current;
    const mobileNav = mobileNavRef.current;
    const originalOverflow = document.body.style.overflow;
    const backgroundElements = [
      document.querySelector<HTMLElement>("#main-content"),
      document.querySelector<HTMLElement>("footer"),
    ].filter((element): element is HTMLElement => element !== null);

    document.body.style.overflow = "hidden";
    backgroundElements.forEach((element) => element.setAttribute("inert", ""));

    const navigationItems = () =>
      Array.from(mobileNav?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
    const focusableItems = () => (menuButton ? [menuButton, ...navigationItems()] : navigationItems());

    window.requestAnimationFrame(() => navigationItems()[0]?.focus() ?? menuButton?.focus());

    const manageKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const items = focusableItems();
      if (!items.length) return;

      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const currentTarget = document.activeElement;

      if (event.shiftKey && (currentTarget === firstItem || !items.includes(currentTarget as HTMLAnchorElement))) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && currentTarget === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", manageKeyboard);
    return () => {
      document.body.style.overflow = originalOverflow;
      backgroundElements.forEach((element) => element.removeAttribute("inert"));
      document.removeEventListener("keydown", manageKeyboard);
      (previousActiveElement ?? menuButton)?.focus();
    };
  }, [open]);

  return (
    <header className="site-header">
      <nav className="nav-island" aria-label="Primary navigation">
        <a className="nav-mark" href="#main-content" aria-label="Kunal Raha, back to top">
          KR
        </a>

        <div className="desktop-nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a className="nav-contact" href="#contact">
            Contact
          </a>
        </div>

        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? (
            <X size={20} weight="light" aria-hidden="true" />
          ) : (
            <List size={22} weight="light" aria-hidden="true" />
          )}
        </button>
      </nav>

      <div
        ref={mobileNavRef}
        id="mobile-navigation"
        className="mobile-nav"
        data-open={open}
        aria-hidden={!open}
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
      >
        <div className="mobile-nav-inner">
          {[...navItems, { label: "Contact", href: "#contact" }].map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              tabIndex={open ? 0 : -1}
              style={{ "--nav-index": index } as React.CSSProperties}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
