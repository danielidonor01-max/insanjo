import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function WaitlistCTA() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent('Insanjo early access');
    const body = encodeURIComponent(`Please add me to the Insanjo waitlist: ${email}`);
    window.location.href = `mailto:info@insanjo.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="waitlist" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="reveal relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center sm:px-12 sm:py-24">
        {/* soft accent glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/2 h-[360px] w-[640px] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"
        />

        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-canvas">
            Your business deserves{' '}
            <span className="italic text-white/70">better tools.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-white/60">
            Join the waitlist and be the first to get early access.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-canvas placeholder:text-white/40 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-canvas px-7 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:bg-accent hover:text-canvas"
            >
              {sent ? (
                <>
                  Sent <Check size={16} strokeWidth={2.5} />
                </>
              ) : (
                <>
                  Join Now
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
