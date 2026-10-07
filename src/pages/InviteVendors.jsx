import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Copy, Check, Link2, MessageCircle, Share2, ExternalLink, Users, Store, Sparkles, Loader2, LogOut, UserPlus,
} from 'lucide-react';
import AuthBrandPanel from '../components/auth/AuthBrandPanel';
import DemoModeNote from '../components/auth/DemoModeNote';
import SEO from '../components/SEO';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { fetchReferrals } from '../services/auth';
import { buildInviteLink, buildInviteMessage } from '../utils/referral';

/** Clipboard API with a textarea fallback for older/insecure contexts. */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    el.remove();
    return ok;
  }
}

const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function InviteVendors() {
  const { user, status, logout } = useAuth();
  const [copied, setCopied] = useState('');
  const [referrals, setReferrals] = useState(null); // null = loading
  const [referralsError, setReferralsError] = useState('');

  useEffect(() => {
    if (status !== 'authenticated') return;
    let cancelled = false;
    fetchReferrals()
      .then((list) => !cancelled && setReferrals(list))
      .catch((err) => {
        if (cancelled) return;
        setReferrals([]);
        setReferralsError(err.userMessage || 'Could not load your invites.');
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas">
        <Loader2 size={22} className="animate-spin text-accent" />
      </div>
    );
  }

  // Invites must be tied to an account so referrals can be credited to the inviter.
  if (status !== 'authenticated') return <Navigate to="/login?next=%2Finvite" replace />;

  const code = user.referralCode;
  const link = buildInviteLink(code, 'vendor');
  const message = buildInviteMessage(code, 'vendor');
  const invitePath = `/auth/ven?ref=${encodeURIComponent(code)}`;

  const handleCopy = async (key, text) => {
    if (await copyText(text)) {
      setCopied(key);
      setTimeout(() => setCopied((current) => (current === key ? '' : current)), 2000);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: 'Join me on Insanjo', text: message });
    } catch {
      // User closed the share sheet — nothing to do.
    }
  };

  const copyIcon = (id) => (copied === id ? <Check size={15} /> : <Copy size={15} />);

  return (
    <>
      <SEO
        title="Invite vendors | Insanjo"
        description="Share your Insanjo referral link and invite other vendors to manage their goods better."
        url="https://insanjo.com/invite"
      />

      <div className="flex min-h-screen flex-col lg:flex-row">
        <AuthBrandPanel
          heroImage="/1.png"
          heroHeading={<>grow together<br />on Insanjo</>}
          heroParagraph="Know a vendor who'd love an easier way to run their business? Send them your link."
          trustItems={[
            { icon: Users, text: 'Invite as many vendors as you like' },
            { icon: Store, text: 'They join with your code already filled in' },
            { icon: Sparkles, text: 'Built for African businesses' },
          ]}
        />

        <div className="flex flex-1 items-center justify-center bg-canvas px-6 py-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between gap-3">
              <Logo height={24} />
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-ink"
              >
                <LogOut size={13} />
                Log out
              </button>
            </div>

            <DemoModeNote />

            <h1 className="font-serif text-2xl font-semibold text-ink">Invite vendors</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Hi {user.fullName.split(' ')[0]}, share your link from {user.businessName}. When someone opens it,
              the sign-up page fills in your code for them.
            </p>

            <div className="mt-7 space-y-5">
              {/* Code */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3.5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-faint">Your referral code</p>
                  <p className="mt-0.5 font-mono text-xl font-semibold tracking-wider text-ink">{code}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('code', code)}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  {copyIcon('code')}
                  {copied === 'code' ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Link */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-faint">Invite link</p>
                <div className="flex items-center gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-surface px-3.5 py-3">
                    <Link2 size={15} className="shrink-0 text-faint" />
                    <span className="truncate text-sm text-ink" title={link}>{link}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('link', link)}
                    aria-label="Copy invite link"
                    className="grid h-11.5 w-11.5 shrink-0 place-items-center rounded-lg border border-line text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    {copyIcon('link')}
                  </button>
                </div>
                {copied === 'link' && <p className="mt-1.5 text-xs text-accent">Link copied</p>}
              </div>

              {/* Message preview */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-faint">Message</p>
                <div className="whitespace-pre-wrap wrap-break-word rounded-lg border border-line bg-surface px-3.5 py-3 text-sm leading-relaxed text-muted">
                  {message}
                </div>
              </div>

              {/* Share actions */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <MessageCircle size={16} />
                  Share on WhatsApp
                </a>
                {canNativeShare ? (
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-canvas transition-colors hover:bg-accent"
                  >
                    <Share2 size={16} />
                    Share…
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCopy('message', message)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-canvas transition-colors hover:bg-accent"
                  >
                    {copyIcon('message')}
                    {copied === 'message' ? 'Message copied' : 'Copy message'}
                  </button>
                )}
              </div>

              <a
                href={invitePath}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                <ExternalLink size={13} />
                Preview what your invitee sees
              </a>

              {/* Who joined */}
              <div className="border-t border-line pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-faint">Joined with your link</p>
                  {referrals && <span className="text-xs font-semibold text-ink">{referrals.length}</span>}
                </div>
                {referrals === null ? (
                  <Loader2 size={16} className="animate-spin text-faint" />
                ) : referralsError ? (
                  <p className="text-xs text-faint">{referralsError}</p>
                ) : referrals.length === 0 ? (
                  <div className="flex items-center gap-2.5 rounded-lg border border-dashed border-line px-3.5 py-3">
                    <UserPlus size={15} className="shrink-0 text-faint" />
                    <p className="text-xs text-faint">No one yet. Vendors who sign up with your link will show here.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-line rounded-lg border border-line">
                    {referrals.map((r) => (
                      <li key={`${r.businessName}-${r.joinedAt}`} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{r.businessName}</p>
                          <p className="truncate text-xs text-faint">{r.fullName}</p>
                        </div>
                        <span className="shrink-0 text-xs text-faint">{formatDate(r.joinedAt)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
