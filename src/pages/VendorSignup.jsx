import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Lock, Eye, EyeOff, Mail, Phone, User, Store, Package, Users,
  Gift, CheckCircle, Smartphone, Loader2, AlertCircle, LogOut,
} from 'lucide-react';
import PasswordStrength from '../components/PasswordStrength';
import AuthBrandPanel from '../components/auth/AuthBrandPanel';
import SEO from '../components/SEO';
import Logo from '../components/Logo';
import DemoModeNote from '../components/auth/DemoModeNote';
import { useAuth } from '../hooks/useAuth';
import { getSafeNext, withNext } from '../utils/authRedirect';
import { getAppDeepLink, APP_STORE_URL } from '../utils/appLinks';
import {
  REFERRAL_FORMAT, normalizeCode, getInvitedByCode, saveInvitedByCode,
} from '../utils/referral';

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_FORMAT = /^\+?\d{10,14}$/;

const SEO_PROPS = {
  title: 'Join Insanjo | Vendor sign up',
  description: 'Create your Insanjo vendor account and manage your goods, sales and team in one place.',
  url: 'https://insanjo.com/signup',
};

export default function VendorSignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup, user, isAuthenticated, logout } = useAuth();
  const next = searchParams.get('next');
  const linkCode = normalizeCode(searchParams.get('ref'));
  const invitedCode = linkCode || getInvitedByCode();

  const [form, setForm] = useState({
    businessName: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    referralCode: invitedCode,
    acceptTerms: false,
  });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    saveInvitedByCode(linkCode);
  }, [linkCode]);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  const referralCode = normalizeCode(form.referralCode);
  const referralLooksWrong = referralCode && !REFERRAL_FORMAT.test(referralCode);

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!form.businessName.trim()) return 'Please enter your business name.';
    if (!form.fullName.trim()) return 'Please enter your full name.';
    if (!EMAIL_FORMAT.test(form.email.trim())) return 'Please enter a valid email address.';
    if (!PHONE_FORMAT.test(form.phone.replace(/[\s-]/g, ''))) {
      return 'Please enter a valid phone number, e.g. 08012345678 or +2348012345678.';
    }
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    if (!form.acceptTerms) return 'Please accept the Terms & Privacy Policy to continue.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signup({
        businessName: form.businessName.trim(),
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/[\s-]/g, ''),
        password: form.password,
        referralCode: referralCode || undefined,
      });
      // Came from a page that needs an account (e.g. /invite): go straight back.
      if (next) {
        navigate(getSafeNext(searchParams), { replace: true });
        return;
      }
      setSuccess(true);
    } catch (err) {
      setError(err.userMessage || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-line bg-canvas py-3 pl-11 pr-4 text-sm text-ink placeholder:text-faint transition-all duration-200 focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15';
  const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-faint';
  const iconClass = 'pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint';

  // ── Success screen ──
  if (success) {
    return (
      <>
        <SEO {...SEO_PROPS} />
        <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-5 py-16 sm:px-8">
          <div className="w-full max-w-sm text-center">
            <div className="mb-10 flex justify-center">
              <Logo height={28} />
            </div>

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
              <CheckCircle className="text-accent" size={30} />
            </div>

            <h1 className="font-serif text-2xl font-semibold text-ink">Account created</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Welcome to Insanjo, {form.fullName.trim().split(' ')[0]}! Continue in the app to set up your store.
            </p>

            {user?.referralCode && (
              <div className="mt-6 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-faint">Your referral code</p>
                <p className="mt-0.5 font-mono text-xl font-semibold tracking-wider text-ink">{user.referralCode}</p>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <a
                href={getAppDeepLink('login')}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-canvas transition-all duration-300 hover:bg-accent"
              >
                <Smartphone size={16} />
                Open the Insanjo app
              </a>
              <p className="text-xs text-faint">
                No app yet?{' '}
                <a
                  href={APP_STORE_URL}
                  className="font-medium text-accent underline-offset-2 hover:underline"
                >
                  Download Insanjo
                </a>
              </p>
              <Link
                to="/invite"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <Gift size={16} />
                Invite other vendors
              </Link>
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

  // ── Split-screen layout ──
  return (
    <>
      <SEO {...SEO_PROPS} />

      <div className="flex min-h-screen flex-col lg:flex-row">
        <AuthBrandPanel
          heroImage="/2.png"
          heroHeading={<>manage your goods<br />better</>}
          heroParagraph="Sales, inventory and your team in one place — and customers who can find you."
          trustItems={[
            { icon: Package, text: 'Track stock without the guesswork' },
            { icon: Store, text: 'Get discovered by customers near you' },
            { icon: Users, text: 'Run your team from one dashboard' },
          ]}
        />

        {/* ── Form panel (right) ── */}
        <div className="flex flex-1 items-center justify-center bg-canvas px-6 py-12 lg:px-16">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <Logo height={24} />
            </div>

            <DemoModeNote />

            {isAuthenticated && (
              <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-3.5 py-2.5">
                <p className="text-xs text-muted">
                  You're logged in as <span className="font-semibold text-ink">{user.fullName}</span>.
                </p>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent hover:underline"
                >
                  <LogOut size={12} />
                  Log out
                </button>
              </div>
            )}

            <h1 className="font-serif text-2xl font-semibold text-ink">Create your vendor account</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Join Insanjo and manage your goods better.
            </p>

            {linkCode && (
              <div className="mt-5 flex items-center gap-2.5 rounded-lg border border-accent/30 bg-accent-soft px-3.5 py-2.5">
                <Gift size={16} className="shrink-0 text-accent" />
                <p className="text-xs text-ink">
                  You were invited with code{' '}
                  <span className="font-mono font-semibold tracking-wide">{linkCode}</span>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
              <div>
                <label htmlFor="business-name" className={labelClass}>Business name</label>
                <div className="relative">
                  <Store size={16} className={iconClass} />
                  <input
                    ref={firstFieldRef}
                    id="business-name"
                    type="text"
                    autoComplete="organization"
                    placeholder="e.g. Ada's Hardware & Building Co."
                    value={form.businessName}
                    onChange={update('businessName')}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="full-name" className={labelClass}>Full name</label>
                <div className="relative">
                  <User size={16} className={iconClass} />
                  <input
                    id="full-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={form.fullName}
                    onChange={update('fullName')}
                    className={inputClass}
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
                    placeholder="you@business.com"
                    value={form.email}
                    onChange={update('email')}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>Phone number</label>
                <div className="relative">
                  <Phone size={16} className={iconClass} />
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="08012345678"
                    value={form.phone}
                    onChange={update('phone')}
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
                    type={show.password ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={update('password')}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => ({ ...v, password: !v.password }))}
                    tabIndex={-1}
                    aria-label={show.password ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-muted"
                  >
                    {show.password ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrength password={form.password} confirmPassword={form.confirm} />
              </div>

              <div>
                <label htmlFor="confirm-password" className={labelClass}>Confirm password</label>
                <div className="relative">
                  <Lock size={16} className={iconClass} />
                  <input
                    id="confirm-password"
                    type={show.confirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={form.confirm}
                    onChange={update('confirm')}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => ({ ...v, confirm: !v.confirm }))}
                    tabIndex={-1}
                    aria-label={show.confirm ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-muted"
                  >
                    {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="referral-code" className={labelClass}>
                  Referral code <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Gift size={16} className={iconClass} />
                  <input
                    id="referral-code"
                    type="text"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    placeholder="e.g. INS088BE5CF"
                    value={form.referralCode}
                    onChange={update('referralCode')}
                    className={`${inputClass} font-mono uppercase tracking-wide`}
                  />
                </div>
                {referralLooksWrong && (
                  <p className="mt-1.5 text-xs text-faint">
                    Referral codes look like INS088BE5CF — double-check it, or leave it blank.
                  </p>
                )}
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
                  <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-500" />
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-canvas transition-all duration-300 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating account…
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-faint">
              Already have an account?{' '}
              <Link to={withNext('/login', searchParams)} className="font-medium text-accent hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
