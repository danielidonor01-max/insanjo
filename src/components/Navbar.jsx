
import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import Logo from "./Logo";
import { useTheme } from "../hooks/useTheme";


const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: "Who it's for", href: '#audience' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
        ? 'border-b border-line bg-canvas/80 backdrop-blur-xl'
        : 'border-b border-transparent bg-transparent'
        }`}
    >
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo height={26} />

        {/* Centered links */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink transition-all duration-300 hover:bg-accent-soft hover:rotate-12"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href="#waitlist"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-canvas transition-colors duration-300 hover:bg-accent"
          >
            Be The First
          </a>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-ink md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-line bg-canvas/95 backdrop-blur-xl md:hidden ${open ? 'max-h-96 border-t' : 'max-h-0'
          } transition-[max-height] duration-300 ease-out`}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 text-base font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#waitlist"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-canvas"
          >
            Be The First
          </a>
        </div>
      </div>
    </header>
  );
}
