import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, User, Loader2, AlertCircle, Store, Gift, Users } from 'lucide-react';
import AuthBrandPanel from '../components/auth/AuthBrandPanel';
import DemoModeNote from '../components/auth/DemoModeNote';
import SEO from '../components/SEO';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { getSafeNext, withNext } from '../utils/authRedirect';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const next = getSafeNext(searchParams);

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const identifierRef = useRef(null);

  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  if (isAuthenticated && !loading) return <Navigate to={next} replace />;

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.identifier.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }
    if (!form.password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(form.identifier.trim(), form.password);
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.userMessage || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-line bg-canvas py-3 pl-11 pr-4 text-sm text-ink placeholder:text-faint transition-all duration-200 focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15';
  const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-faint';
  const iconClass = 'pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint';

  return (
    <>
      <SEO
        title="Log in | Insanjo"
        description="Log in to your Insanjo vendor account."
        url="https://insanjo.com/login"
      />

      <div className="flex min-h-screen flex-col lg:flex-row">
        <AuthBrandPanel
          heroImage="/2.png"
          heroHeading={<>welcome<br />back</>}
          heroParagraph="Log in to get your referral link and invite other vendors to Insanjo."
          trustItems={[
            { icon: Store, text: 'One account for your whole business' },
            { icon: Gift, text: 'Your own referral code and invite link' },
            { icon: Users, text: 'See who joined with your link' },
          ]}
        />

        <div className="flex flex-1 items-center justify-center bg-canvas px-6 py-12 lg:px-16">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <Logo height={24} />
            </div>

            <DemoModeNote />

            <h1 className="font-serif text-2xl font-semibold text-ink">Log in</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {searchParams.get('next')
                ? 'Log in to continue. Your invite link is waiting.'
                : 'Welcome back to Insanjo.'}
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
              <div>
                <label htmlFor="identifier" className={labelClass}>Email or phone</label>
                <div className="relative">
                  <User size={16} className={iconClass} />
                  <input
                    ref={identifierRef}
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    placeholder="you@business.com or 08012345678"
                    value={form.identifier}
                    onChange={update('identifier')}
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
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={form.password}
                    onChange={update('password')}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-muted"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

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
                    Logging in…
                  </>
                ) : (
                  'Log in'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-faint">
              New to Insanjo?{' '}
              <Link to={withNext('/signup', searchParams)} className="font-medium text-accent hover:underline">
                Create a vendor account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
