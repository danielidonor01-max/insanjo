import { useRef, useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import axios from 'axios';

export default function WaitlistCTA() {
  const [form, setForm] = useState({
    name: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const sectionRef = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], [80, -120]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) return;

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        'https://api.insanjo.com/waitlist',
        {
          name: form.name,
          email: form.email,
        }
      );

      console.log(response.data);

      setSent(true);

      setForm({
        name: '',
        email: '',
      });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="waitlist"
      className="px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="reveal relative mx-auto max-w-5xl overflow-hidden rounded-4xl bg-[#0a1424] px-6 py-16 text-center sm:px-12 sm:py-24">
        <motion.div
          aria-hidden="true"
          style={{ x: '-50%', y: reduce ? undefined : glowY }}
          className="pointer-events-none absolute -bottom-32 left-1/2 h-90 w-160 rounded-full bg-[#066ff2]/25 blur-3xl"
        />

        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-white">
            Your business deserves{' '}
            <span className="italic text-white/70">better tools.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-md text-base text-white/60">
            Join the waitlist and be the first to get early access.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-9 flex max-w-md flex-col  gap-3"
          >
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-canvas placeholder:text-white/40 focus:border-accent focus:outline-none"
            />

            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@business.com"
              className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-canvas placeholder:text-white/40 focus:border-accent focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading || sent}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-canvas px-7 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:bg-accent hover:text-canvas disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Joining...
                </>
              ) : sent ? (
                <>
                  Joined <Check size={16} />
                </>
              ) : (
                <>
                  Join Now
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            {sent && (
              <p className="text-sm text-green-400">
                Thank you! You've been added to the waitlist.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}