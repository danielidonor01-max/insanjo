import { Linkedin, Instagram } from 'lucide-react';
import Logo from './Logo';

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: "Who it's for", href: '#audience' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <Logo height={28} />

          <nav className="flex flex-wrap gap-x-7 gap-y-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/company/insanjo"
              target="_blank"
              rel="noreferrer"
              aria-label="Insanjo on LinkedIn"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://www.instagram.com/insanjo"
              target="_blank"
              rel="noreferrer"
              aria-label="Insanjo on Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-faint">© 2026 Lechi-Tech. All rights reserved.</p>
          <a
            href="mailto:info@insanjo.com"
            className="text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            hello@insanjo.com
          </a>
        </div>
      </div>
    </footer>
  );
}
