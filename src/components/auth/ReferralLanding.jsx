import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle, Eye, EyeOff, Gift, LinkIcon, Loader2,
  Lock, Mail, Store, User,
} from 'lucide-react';
import AuthBrandPanel from './AuthBrandPanel';
import SEO from '../SEO';
import Logo from '../Logo';
import PasswordStrength from '../PasswordStrength';
import ReferralContinue from './ReferralContinue';
import * as vendorAuth from '../../services/vendorAuth';
import * as customerAuth from '../../services/customerAuth';
import { normalizeCode, isValidReferralCode, saveInvitedByCode } from '../../utils/referral';

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * Role-specific copy + behaviour. Both /auth/cus and /auth/ven share one real
 * flow: check the referral → sign up via email OTP if new → continue in the app.
 */
const ROLES = {
  customer: {
    seo: {
      title: 'Join Insanjo | Customer',
      description: 'You were invited to Insanjo! Create your account and start shopping smarter with exclusive deals near you.',
      url: 'https://insanjo.com/auth/cus',
    },
    brand: {
      heroHeading: <>shop smart,<br />earn more</>,
      heroParagraph: 'Discover stores near you, track orders and unlock exclusive deals — all in the Insanjo app.',
      trustItems: [
        { icon: Store, text: 'Discover stores and deals near you' },
        { icon: LinkIcon, text: 'Track orders and pay securely' },
        { icon: User, text: 'Personalised, for you' },
      ],
    },
    formTitle: 'Create your account',
    formSubtitle: 'You have been invited to shop smarter on Insanjo.',
    submitLabel: 'Send me a code',
    continueTitle: 'You’re all set!',
    continueBody:
      'Your invite is confirmed. Open the Insanjo app to continue — if you already have it installed it will open right away, otherwise download it first.',
  },
  vendor: {
    seo: {
      title: 'Join Insanjo | Vendor',
      description: 'You were invited to Insanjo! Create your vendor account and manage your goods, sales and team in one place.',
      url: 'https://insanjo.com/auth/ven',
    },
    brand: {
      heroHeading: <>manage your goods<br />better</>,
      heroParagraph: 'Sales, inventory and your team in one place — and customers who can find you.',
      trustItems: [
        { icon: Store, text: 'Track stock without the guesswork' },
        { icon: LinkIcon, text: 'Get discovered by customers near you' },
        { icon: User, text: 'Run your team from one dashboard' },
      ],
    },
    formTitle: 'Create your vendor account',
    formSubtitle: 'Join Insanjo and manage your goods better.',
    submitLabel: 'Send me a code',
    continueTitle: 'You’re all set!',
    continueBody:
      'Your invite is confirmed. Open the Insanjo app to continue — if you already have it installed it will open right away, otherwise download it first.',
  },
};

export default function ReferralLanding({ role = 'vendor' }) {
  const [searchParams] = useSearchParams();
  const cfg = ROLES[role] || ROLES.vendor;
  // Pick the real backend client for this audience (customer vs vendor router).
  const auth = role === 'customer' ? customerAuth : vendorAuth;

  const linkCode = normalizeCode(searchParams.get('ref') || '');
  const validRef = linkCode ? isValidReferralCode(linkCode) : false;

  // 'ucheck' → 'signup' | 'otp' | 'continue' | 'invalid'
  const [mode, setMode] = useState('ucheck');
  const [createdName, setCreatedName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    acceptTerms: false,
  });
  const [otp, setOtp] = useState('');
  const [show, setShow] = useState(false);
  const firstFieldRef = useRef(null);
  const otpRef = useRef(null);

  // Keep the referral code for the session so a refresh doesn't lose it.
  useEffect(() => {
    if (linkCode) saveInvitedByCode(linkCode);
  }, [linkCode]);

  // ── STEP 1: check the referral code against the real backend ──
  useEffect(() => {
    if (mode !== 'ucheck') return;

    if (!validRef) {
      setMode('invalid');
      return;
    }

    let cancelled = false;
    auth.checkReferralCode(linkCode)
      .then((res) => {
        if (cancelled) return;
        // If the backend is down we still let them try — request-otp re-validates.
        setMode(res && res.valid === true ? 'signup' : 'invalid');
      })
      .catch(() => {
        if (!cancelled) setMode('signup');
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, linkCode, validRef, auth]);

  useEffect(() => {
    if (mode === 'signup') firstFieldRef.current?.focus();
    if (mode === 'otp') otpRef.current?.focus();
  }, [mode]);

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateSignup = () => {
    if (!form.firstName.trim()) return 'Please enter your first name.';
    if (!form.lastName.trim()) return 'Please enter your last name.';
    if (!EMAIL_FORMAT.test(form.email.trim())) return 'Please enter a valid email address.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (!form.acceptTerms) return 'Please accept the Terms & Privacy Policy to continue.';
    return '';
  };

  // ── STEP 2: check for an existing account, then request the sign-up OTP ──
  const handleSignup = async (e) => {
    e.preventDefault();
    const validationError = validateSignup();
    if (validationError) return setError(validationError);

    setLoading(true);
    setError('');
    try {
      const email = form.email.trim();

      // Already signed up? Skip straight to "open the app" instead of a new OTP.
      try {
        const existing = await auth.checkEmail(email);
        if (existing?.exists) {
          if (existing.reason === 'active_account') {
            setMode('continue');
            return;
          }
          if (existing.reason === 'account_deleted') {
            setError(existing.message || 'This account has been permanently deleted.');
            return;
          }
          // Deactivated (reason reactivation_required) → proceed; request-otp
          // sends a code and verify-otp restores the account.
        }
      } catch (existingErr) {
        // Ignore check-email failures; request-otp will surface the real error.
      }

      const identity = {
        email,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        password: form.password,
        policyAccepted: form.acceptTerms,
      };

      if (role === 'customer') {
        // Customer router/request-otp expects the referral as `referralCode`.
        await auth.requestOTP({
          ...identity,
          referralCode: linkCode,
          termsVersion: 'v1.0',
        });
      } else {
        // Vendor router/request-otp expects the referral as `referredBy`.
        await auth.requestOTP({ ...identity, referredBy: linkCode });
      }

      setMode('otp');
    } catch (err) {
      setError(err.userMessage || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 3: verify the OTP → account created → continue in the app ──
  const handleOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return setError('Please enter the 6-digit code from your email.');

    setLoading(true);
    setError('');
    try {
      const data = await auth.verifyOTP(form.email.trim(), otp.trim());
      // Persist the real session token so the account can be used on the web.
      if (data?.token) {
        try { localStorage.setItem('authToken', data.token); } catch { /* private mode */ }
      }
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      setCreatedName(fullName.split(' ')[0] || data?.email?.split('@')[0]);
      setMode('continue');
    } catch (err) {
      setError(err.userMessage || 'That code was incorrect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-line bg-canvas py-3 pl-11 pr-4 text-sm text-ink placeholder:text-faint transition-all duration-200 focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15';
  const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-faint';
  const iconClass = 'pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint';

  // ── Checking ──
  if (mode === 'ucheck') {
    return (
      <>
        <SEO {...cfg.seo} />
        <div className="grid min-h-screen place-items-center bg-canvas">
          <Loader2 size={22} className="animate-spin text-accent" />
        </div>
      </>
    );
  }

// ── Invalid / missing referral link ──
  if (mode === 'invalid') {
    return (
      <>
        <SEO {...cfg.seo} />
        <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-5 py-16 sm:px-8">
          <div className="w-full max-w-sm text-center">
            <div className="mb-10 flex justify-center">
              <Logo height={28} />
            </div>

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
              <Gift className="text-accent" size={30} />
            </div>

            <h1 className="font-serif text-2xl font-semibold text-ink">
              That invite link looks incomplete
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {linkCode
                ? 'The referral code doesn’t look right. Double-check the invite link you were sent.'
                : 'No referral code was found in that link. Check the invite you were sent or start fresh below.'}
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="https://insanjo.com/download"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-canvas transition-all duration-300 hover:bg-accent"
              >
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                Download the Insanjo app
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                <ArrowLeft size={14} />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Split-screen: signup, otp or continue ──
  return (
    <>
      <SEO {...cfg.seo} />

      <div className="flex min-h-screen flex-col lg:flex-row">
        <AuthBrandPanel
          heroImage={role === 'customer' ? '/1.png' : '/2.png'}
          heroHeading={cfg.brand.heroHeading}
          heroParagraph={cfg.brand.heroParagraph}
          trustItems={cfg.brand.trustItems}
        />

        <div className="flex flex-1 items-center justify-center bg-canvas px-6 py-12 lg:px-16">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <Logo height={24} />
            </div>

{mode === 'continue' ? (
              <>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
                  <CheckCircle className="text-accent" size={30} />
                </div>
                <h1 className="font-serif text-2xl font-semibold text-ink">
                  {createdName ? `You’re in, ${createdName}!` : cfg.continueTitle}
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{cfg.continueBody}</p>

                <ReferralContinue role={role} />

                <p className="mt-8 text-center text-xs text-faint">
                  <Link to={role === 'vendor' ? '/invite' : '/'} className="font-medium text-accent hover:underline">
                    {role === 'vendor' ? 'Invite other vendors' : 'Back to home'}
                  </Link>
                </p>
              </>
            ) : mode === 'otp' ? (
              <>
                <h1 className="font-serif text-2xl font-semibold text-ink">Almost there</h1>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  We sent a verification code to <span className="font-medium text-ink">{form.email}</span>.
                  Enter it below to finish creating your account.
                </p>

                <form onSubmit={handleOtp} noValidate className="mt-7 space-y-5">
                  <div>
                    <label htmlFor="otp" className={labelClass}>Verification code</label>
                    <input
                      ref={otpRef}
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="6-digit code"
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); if (error) setError(''); }}
                      className={`${inputClass} font-mono tracking-widest`}
                    />
                  </div>

                  {error && (
                    <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 px-3.5 py-2.5 dark:bg-red-950/20">
                      <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-canvas transition-all duration-300 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Verifying…</>
                    ) : (
                      'Verify code'
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-faint">
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setOtp(''); setError(''); }}
                    className="font-medium text-accent hover:underline"
                  >
                    ← Change details or resend
                  </button>
                </p>
              </>
            ) : (
              <>
                <h1 className="font-serif text-2xl font-semibold text-ink">{cfg.formTitle}</h1>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{cfg.formSubtitle}</p>

                {linkCode && (
                  <div className="mt-5 flex items-center gap-2.5 rounded-lg border border-accent/30 bg-accent-soft px-3.5 py-2.5">
                    <Gift size={16} className="shrink-0 text-accent" />
                    <p className="text-xs text-ink">
                      You were invited with code{' '}
                      <span className="font-mono font-semibold tracking-wide">{linkCode}</span>
                    </p>
                  </div>
                )}

<form onSubmit={handleSignup} noValidate className="mt-7 space-y-5">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="first-name" className={labelClass}>First name</label>
                      <div className="relative">
                        <User size={16} className={iconClass} />
                        <input
                          ref={firstFieldRef}
                          id="first-name"
                          type="text"
                          autoComplete="given-name"
                          placeholder="Ada"
                          value={form.firstName}
                          onChange={update('firstName')}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="last-name" className={labelClass}>Last name</label>
                      <input
                        id="last-name"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Okafor"
                        value={form.lastName}
                        onChange={update('lastName')}
                        className="w-full rounded-lg border border-line bg-canvas py-3 pr-4 text-sm text-ink placeholder:text-faint transition-all duration-200 focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>Email</label>
                    <div className="relative">
                      <Mail size={16} className={iconClass} />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={update('email')}
                        className={inputClass}
                      />
                    </div>
                  </div>

<div>
                    <label htmlFor="password" className={labelClass}>Password</label>
                    <div className="relative">
                      <Lock size={16} className={iconClass} />
                      <input
                        id="password"
                        type={show ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Min. 8 characters"
                        value={form.password}
                        onChange={update('password')}
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShow((v) => !v)}
                        tabIndex={-1}
                        aria-label={show ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-muted"
                      >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <PasswordStrength password={form.password} />
                  </div>

                  <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted">
                    <input
                      type="checkbox"
                      checked={form.acceptTerms}
                      onChange={update('acceptTerms')}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
                    />
                    <span>
                      I agree to Insanjo's{' '}
                      <Link
                        to="/legal/terms-and-privacy"
                        target="_blank"
                        className="font-medium text-accent underline-offset-2 hover:underline"
                      >
                        Terms &amp; Privacy Policy
                      </Link>
                    </span>
                  </label>

                  {error && (
                    <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 px-3.5 py-2.5 dark:bg-red-950/20">
                      <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-canvas transition-all duration-300 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending code…</>
                    ) : (
                      cfg.submitLabel
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}