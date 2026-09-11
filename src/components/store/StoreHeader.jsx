import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function HandDrawnUnderline({ className = "" }) {
  return (
    <svg viewBox="0 0 120 12" className={className} fill="none" aria-hidden="true">
      <path
        d="M2 8.5C22 3 48 2 68 5.5C82 8 100 4 118 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Soft blurred color wash, shared by every hero variant. Positioned so it
 * peaks over the image/pattern side but bleeds softly all the way across
 * the card — this is what makes the two halves read as one composition
 * instead of a text box glued to a picture.
 */
function HeroGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute right-[8%] top-[-25%] h-[85%] w-[65%] rounded-full blur-3xl"
        style={{ background: "var(--pattern-royal)", opacity: "var(--pattern-glow-opacity)" }}
      />
      <div
        className="absolute bottom-[-30%] right-[22%] h-[75%] w-[45%] rounded-full blur-3xl"
        style={{ background: "var(--pattern-cyan)", opacity: "var(--pattern-glow-opacity)" }}
      />
      <div
        className="absolute -left-[10%] top-[10%] h-[60%] w-[40%] rounded-full blur-3xl"
        style={{ background: "var(--pattern-royal)", opacity: "calc(var(--pattern-glow-opacity) * 0.5)" }}
      />
    </div>
  );
}

/** Blurred halo that escapes the card's own rounded edge, like light spilling past it. */
function HeroHalo() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-6 rounded-store-section blur-3xl"
      style={{ background: "var(--pattern-royal)", opacity: "calc(var(--pattern-glow-opacity) * 0.6)" }}
    />
  );
}

const VB_W = 1200;
const VB_H = 520;
const PILL_W = 84;
const PILL_H = 190;
const GAP_X = 16;
const GAP_Y = 16;
const COL_W = PILL_W + GAP_X;
const ROW_H = PILL_H + GAP_Y;
const PATTERN_START_X = 440;

// Tones map to --pattern-royal/cyan/navy in index.css, which hold bold
// brand hex values in dark mode and soft transparent tints in light mode.
function buildPills() {
  const numCols = Math.ceil((VB_W - PATTERN_START_X) / COL_W) + 1;
  const pills = [];
  for (let c = 0; c < numCols; c++) {
    const x = PATTERN_START_X + c * COL_W;
    const stagger = c % 2 === 0 ? 0 : ROW_H / 2;
    let y = -PILL_H - ROW_H + stagger;
    let row = 0;
    while (y < VB_H + PILL_H) {
      const tone = (c + row) % 6;
      const varName = tone === 4 ? "--pattern-navy" : tone === 5 ? "--pattern-cyan" : "--pattern-royal";
      pills.push({ key: `${c}-${row}`, x, y, varName });
      y += ROW_H;
      row++;
    }
  }
  return pills;
}

/**
 * Category-agnostic tile pattern — vertical "pill" shapes concentrated on
 * the right, sitting on top of HeroGlow so the soft wash still reads
 * behind the copy on the left. Works identically for any vendor type
 * since it's pure geometry, never product photography.
 */
function PillPattern({ className = "" }) {
  const pills = useMemo(buildPills, []);

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      {pills.map((p) => (
        <rect
          key={p.key}
          x={p.x}
          y={p.y}
          width={PILL_W}
          height={PILL_H}
          rx={PILL_W / 2}
          style={{ fill: `var(${p.varName})` }}
        />
      ))}
    </svg>
  );
}

function Copy({ withAccentDot = false }) {
  return (
    <div className="relative z-20 max-w-sm">
      {withAccentDot && (
        <span className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-store-primary dark:text-cyan-300">
          <Sparkles size={12} />
          Discover
        </span>
      )}
      <h1 className="font-sans text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-store-fg drop-shadow-sm sm:text-5xl">
        Your next favourite find
        <br />
        <span className="text-store-primary dark:text-cyan-300">is just a click away.</span>
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-store-muted-fg sm:text-base">
        Premium quality. Local vendors.
        <br />
        Discovered by you.
      </p>
    </div>
  );
}

function PatternHero() {
  return (
    <div className="relative min-h-96 w-full overflow-hidden sm:min-h-104">
      <PillPattern className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 flex h-full flex-col justify-center gap-4 px-6 py-10 sm:px-10 sm:py-14">
        <Copy withAccentDot />

        <div className="mt-2 flex items-center gap-2 self-end drop-shadow-sm sm:mr-4">
          <Sparkles className="h-4 w-4 text-store-primary/80 dark:text-cyan-200/90" />
          <p className="font-hand text-xl font-semibold leading-none text-store-fg sm:text-2xl">
            Same Quality. New Finds.
          </p>
        </div>
        <HandDrawnUnderline className="-mt-3 ml-auto h-2.5 w-20 self-end text-store-fg/80 sm:mr-4" />
      </div>
    </div>
  );
}

function PhotoHero({ details }) {
  return (
    <div className="grid grid-cols-1 items-center gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[0.95fr_1.35fr] lg:gap-6">
      <Copy />

      <div className="relative z-10 flex min-h-72 w-full items-center justify-center gap-3 sm:min-h-80 sm:gap-5 lg:min-h-96 lg:justify-end">
        <div className="relative w-[85%] max-w-lg flex-1 rotate-2 overflow-hidden rounded-2xl shadow-xl sm:w-[78%]">
          <img
            src={details.coverImage1}
            alt={details.businessName}
            className="aspect-4/5 w-full object-cover transition-[filter] duration-300 dark:brightness-[0.72] dark:saturate-[0.9]"
          />
          <Sparkles className="absolute -right-1 -top-1 h-4 w-4 -rotate-2 text-white/80" />
        </div>

        <div className="hidden shrink-0 -rotate-3 text-left font-hand text-store-fg sm:block">
          <p className="text-xl font-semibold leading-[1.05] sm:text-2xl lg:text-3xl">
            Same
            <br />
            Quality.
            <br />
            New
            <br />
            Finds.
          </p>
          <HandDrawnUnderline className="mt-1 h-2.5 w-14 text-store-fg lg:w-16" />
        </div>
      </div>
    </div>
  );
}

export default function StoreHeader({ details }) {
  const hasCover = Boolean(details.coverImage1);

  return (
    <div className="relative mt-6">
      <HeroHalo />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative isolate overflow-hidden rounded-store-section bg-store-surface"
      >
        <HeroGlow />
        {hasCover ? <PhotoHero details={details} /> : <PatternHero />}
      </motion.section>
    </div>
  );
}
