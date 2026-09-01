import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, Loader2, Smartphone, AlertCircle } from 'lucide-react';
import PasswordStrength from '../PasswordStrength';
import webApi from '../../services/webApi';
import SEO from '../SEO';
import Logo from '../Logo';
import { getAppDeepLink, APP_STORE_URL } from '../../utils/appLinks';

/**
 * Shared shell for the customer/vendor reset- and set-password pages — the four
 * pages are identical except for copy, the API endpoint, and the deep link.
 */
export default function PasswordAuthPage({
  deepLinkPath,
  heroImage,
  heroHeading,
  heroParagraph,
  trustItems,
  endpoint,
  successSeo,
  formSeo,
  successMessage,
  formSubtitleValid,
  formSubtitleInvalid,
  submitLabel,
  submitLoadingLabel,
  invalidTokenError,
  defaultFailureError,
}) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [appDetected, setAppDetected] = useState(false);
  const appCheckTimer = useRef(null);
  const passwordRef = useRef(null);

  const getDeepLink = () => getAppDeepLink(deepLinkPath);

  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!success) return;

    const tryOpenApp = () => {
      window.location.href = getDeepLink();
      appCheckTimer.current = setTimeout(() => {
        setAppDetected(false);
      }, 2000);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        setAppDetected(true);
        if (appCheckTimer.current) clearTimeout(appCheckTimer.current);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    tryOpenApp();

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (appCheckTimer.current) clearTimeout(appCheckTimer.current);
    };
  }, [success]);

  const validate = () => {
    if (!form.password) {
      setError('Please enter a new password.');
      return false;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    if (!form.confirm) {
      setError('Please confirm your password.');
      return false;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    if (!token) {
      setError(invalidTokenError);
      return;
    }

    setLoading(true);
    try {
      const res = await webApi.post(endpoint, {
        token,
        newPassword: form.password,
      });
      if (res.data?.success || res.status === 200) {
        setSuccess(true);
      } else {
        setError(res.data?.message || defaultFailureError);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.userMessage ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputProps = (field) => ({
    value: form[field],
    onChange: (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError('');
    },
    autoComplete: 'new-password',
    required: true,
    className:
      'w-full rounded-lg border border-line bg-canvas py-3 pl-11 pr-11 text-sm text-ink placeholder:text-faint transition-all duration-200 focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15',
  });

  // ── Success screen ──
  if (success) {
    return (
      <>
        <SEO {...successSeo} />
        <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-5 py-16 sm:px-8">
          <div className="w-full max-w-sm text-center">
            <div className="mb-10 flex justify-center">
              <Logo height={28} />
            </div>

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
              <CheckCircle className="text-accent" size={30} />
            </div>

            <h1 className="font-serif text-2xl font-semibold text-ink">
              Password updated
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {successMessage}
              {appDetected === false && ' Opening the Insanjo app…'}
            </p>

            <div className="mt-8">
              {appDetected === false ? (
                <div className="space-y-4">
                  <Loader2 size={20} className="mx-auto animate-spin text-accent" />

                  <div className="rounded-lg border border-dashed border-line bg-surface/50 p-5">
                    <Smartphone size={20} className="mx-auto mb-2 text-faint" />
                    <p className="text-xs text-faint">
                      Didn't open?{' '}
                      <a
                        href={getDeepLink()}
                        className="font-medium text-accent underline-offset-2 hover:underline"
                      >
                        Tap to open app
                      </a>
                    </p>
                    <p className="mt-1 text-xs text-faint">
                      No app yet?{' '}
                      <a
                        href={APP_STORE_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-accent underline-offset-2 hover:underline"
                      >
                        Download Insanjo
                      </a>
                    </p>
                  </div>

                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
                  >
                    <ArrowLeft size={14} />
                    Back to home
                  </Link>
                </div>
              ) : (
                <p className="text-xs text-faint">
                  You can close this tab and continue in the app.
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Split-screen layout ──
  return (
    <>
      <SEO {...formSeo} />

      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* ── Brand panel (left) — hidden on mobile ── */}
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

        {/* ── Form panel (right) ── */}
        <div className="flex flex-1 items-center justify-center bg-canvas px-6 py-12 lg:px-16">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <Logo height={24} />
            </div>

            <h1 className="font-serif text-2xl font-semibold text-ink">
              Set new password
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {token ? formSubtitleValid : formSubtitleInvalid}
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* New password */}
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint"
                >
                  New password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
                  />
                  <input
                    ref={passwordRef}
                    id="new-password"
                    type={show.password ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    {...inputProps('password')}
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

                {/* Password strength & validation */}
                <PasswordStrength
                  password={form.password}
                  confirmPassword={form.confirm}
                />
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
                  />
                  <input
                    id="confirm-password"
                    type={show.confirm ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    {...inputProps('confirm')}
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

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3.5 py-2.5 dark:bg-red-950/20">
                  <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-500" />
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !token}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-canvas transition-all duration-300 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {submitLoadingLabel}
                  </>
                ) : (
                  submitLabel
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-faint">
              Remember your password?{' '}
              <span className="font-medium text-accent cursor-pointer hover:underline">
                Sign in
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
