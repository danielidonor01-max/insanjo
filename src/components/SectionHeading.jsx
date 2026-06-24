export default function SectionHeading({ kicker, title, intro, align = 'center' }) {
  const alignment = align === 'left' ? 'text-left' : 'text-center mx-auto';
  return (
    <div className={`reveal max-w-2xl ${alignment}`}>
      {kicker && (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
          {kicker}
        </span>
      )}
      <h2 className="mt-3 font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.1] tracking-tight text-ink">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}
