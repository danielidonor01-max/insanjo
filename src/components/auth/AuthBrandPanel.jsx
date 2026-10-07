import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/** Left-hand brand panel shared by the split-screen auth pages. Hidden below `lg`. */
export default function AuthBrandPanel({ heroImage, heroHeading, heroParagraph, trustItems }) {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden px-8 py-10 lg:flex lg:min-h-screen lg:w-1/2 lg:px-14 lg:py-12">
      {/* Background image */}
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0a1424]/25 to-[#0a1424]/95" />

      {/* Decorative circles */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/5" />

      {/* Back link */}
      <Link
        to="/"
        className="group relative z-10 flex w-fit items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
      >
        <ArrowLeft
          size={16}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        Back
      </Link>

      {/* Center content */}
      <div className="relative z-10">
        <div className="mb-6">
          <img
            src="/insanjo-white.svg"
            alt="Insanjo"
            height={32}
            style={{ height: 32 }}
            className="w-auto"
          />
        </div>
        <h2 className="font-serif text-3xl font-medium leading-tight text-white sm:text-4xl lg:text-5xl">
          {heroHeading}
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
          {heroParagraph}
        </p>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-col gap-3">
          {trustItems.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <Icon size={14} className="text-white" />
              </div>
              <span className="text-xs text-white/60">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom text */}
      <p className="relative z-10 text-xs text-white/40">
        &copy; 2026 Lechi-Tech. All rights reserved.
      </p>
    </div>
  );
}
