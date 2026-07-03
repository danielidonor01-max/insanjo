import { motion, useReducedMotion } from 'framer-motion';
import { TrendingUp, Check, Bell, Boxes } from 'lucide-react';
import { InsanjoMark } from './Logo';

const EASE = [0.22, 1, 0.36, 1];

export default function ProductPreview() {
  const reduce = useReducedMotion();

  // Gentle infinite float for the side cards (disabled under reduced-motion)
  const float = (range) =>
    reduce ? {} : { y: [0, range, 0], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } };

  return (
    <div className="relative">
      {/* ── Dashboard card ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative z-10 overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_2px_4px_rgba(10,20,36,0.04),0_36px_72px_-34px_rgba(4,67,149,0.26)]"
      >
        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <InsanjoMark size={36} />
              <div>
                <p className="text-base font-bold leading-tight text-ink">Sales overview</p>
                <p className="text-sm text-faint">Hardware &amp; Building Co.</p>
              </div>
            </div>
            <div className="hidden items-center rounded-full bg-canvas p-1 text-xs font-semibold sm:flex">
              <span className="rounded-full px-3 py-1.5 text-faint">Day</span>
              <span className="rounded-full bg-surface px-3 py-1.5 text-accent-ink shadow-sm">Week</span>
              <span className="rounded-full px-3 py-1.5 text-faint">Month</span>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
            <StatTile label="Revenue this week" value="₦689,990" delta="+58%" />
            <StatTile label="Orders" value="6,768" delta="+12%" />
          </div>

          {/* Chart */}
          <Chart reduce={reduce} />

          {/* Inventory */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-faint">
              <span>Inventory stock</span>
              <span>In stock</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-ink">
                <Boxes size={18} strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">Hammer — 1kg Stainless</p>
                <p className="text-xs text-faint">Building Materials</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-line sm:block">
                  <motion.div
                    className="h-full rounded-full bg-brand-gradient"
                    initial={{ width: 0 }}
                    whileInView={{ width: '64%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6, ease: EASE }}
                  />
                </div>
                <span className="font-serif text-lg text-ink tabular-nums">20</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Floating card: new sale (top-left) ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -24, y: 10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
        className="absolute -left-3 top-16 z-20 hidden md:block lg:-left-10"
      >
        <motion.div
          animate={float(-9)}
          className="flex items-center gap-2.5 rounded-lg border border-line bg-surface/95 px-3.5 py-2.5 shadow-[0_18px_40px_-22px_rgba(4,67,149,0.4)] backdrop-blur"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-positive-soft text-positive">
            <Check size={17} strokeWidth={3} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">New sale recorded</p>
            <p className="text-xs text-faint">₦18,000 · 2 items · Cashier: Amaka</p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Floating card: low stock (bottom-right) ────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 24, y: -10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
        className="absolute -right-3 bottom-12 z-20 hidden md:block lg:-right-10"
      >
        <motion.div
          animate={float(9)}
          className="flex items-center gap-2.5 rounded-lg border border-line bg-surface/95 px-3.5 py-2.5 shadow-[0_18px_40px_-22px_rgba(4,67,149,0.4)] backdrop-blur"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-warn-soft text-warn">
            <Bell size={16} strokeWidth={2.25} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Low stock alert</p>
            <p className="text-xs text-faint">Trowel down to 5 units</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function StatTile({ label, value, delta }) {
  return (
    <div className="rounded-2xl bg-canvas p-4 sm:p-5">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1.5 font-serif text-xl text-ink sm:text-2xl">{value}</p>
      <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-positive-soft px-2 py-0.5 text-xs font-bold text-positive">
        <TrendingUp size={12} strokeWidth={2.5} />
        {delta}
      </span>
    </div>
  );
}

function Chart({ reduce }) {
  const line =
    'M0,150 C60,120 110,118 170,140 C230,160 270,150 330,126 C390,104 450,96 510,70 C545,58 575,50 600,44';
  const area = `${line} L600,200 L0,200 Z`;

  return (
    <div className="relative mt-6">
      <svg viewBox="0 0 600 200" className="h-28 w-full sm:h-36" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#044395" />
            <stop offset="55%" stopColor="#066FF2" />
            <stop offset="100%" stopColor="#05F1DB" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#05F1DB" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#05F1DB" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {[50, 100, 150].map((y) => (
          <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#eef1f6" strokeWidth="1" />
        ))}

        <motion.path
          d={area}
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />
      </svg>

      {/* glowing peak dot — positioned over the (510,70) crest */}
      <motion.span
        className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_0_4px_rgba(5,241,219,0.25),0_0_16px_rgba(5,241,219,0.9)]"
        style={{ left: '85%', top: '35%' }}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={
          reduce
            ? { scale: 1, opacity: 1 }
            : { scale: [0, 1.15, 1], opacity: 1 }
        }
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.5, ease: EASE }}
      />
    </div>
  );
}
