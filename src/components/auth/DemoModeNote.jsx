import { FlaskConical } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/** Shown on auth pages while accounts are faked in the browser (see services/auth.js). */
export default function DemoModeNote() {
  const { isDemo } = useAuth();
  if (!isDemo) return null;

  return (
    <div className="mb-6 flex items-start gap-2 rounded-lg border border-dashed border-amber-500/40 bg-amber-500/10 px-3.5 py-2.5">
      <FlaskConical size={14} className="mt-0.5 shrink-0 text-amber-500" />
      <p className="text-xs leading-relaxed text-muted">
        <span className="font-semibold text-ink">Demo mode.</span> Accounts and referral codes are
        stored in this browser only, not on Insanjo's servers.
      </p>
    </div>
  );
}
