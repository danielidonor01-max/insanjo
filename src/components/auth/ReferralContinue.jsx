import { ArrowRight, Smartphone, Download } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { APP_STORE_URL, getAppDeepLink } from '../../utils/appLinks';

/**
 * Shared "Continue in the Insanjo app" block shown after a referral sign-up
 * (or when the visitor is already recognised).
 *
 * It accounts for both cases the mobile invite needs to cover:
 *   - App already installed → "Open the app" launches it via the custom scheme
 *     so the user can log in. Clicking it also cues the fallback hint.
 *   - App not yet installed → "Download the app" points at the /download page.
 */
export default function ReferralContinue({ role = 'vendor' }) {
  // Deep link into the login screen so the new member can sign straight in.
  const appHref = getAppDeepLink('login');

  const handleOpen = () => {
    trackEvent('app_open_app', { source: `auth_${role}`, action: 'open_app' });
  };

  const handleDownload = () => {
    trackEvent('app_download_click', { source: `auth_${role}`, action: 'download' });
  };

  return (
    <div className="mt-7 space-y-3.5">
      <a
        href={appHref}
        onClick={handleOpen}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3.5 text-sm font-semibold text-canvas transition-all duration-300 hover:bg-accent"
      >
        {role === 'customer' ? (
          <Smartphone size={16} />
        ) : (
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        )}
        Open the Insanjo app
      </a>

      <a
        href={APP_STORE_URL}
        onClick={handleDownload}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-surface px-5 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent"
      >
        <Download size={16} />
        No app yet? Download Insanjo
      </a>
    </div>
  );
}