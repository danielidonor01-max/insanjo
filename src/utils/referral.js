/**
 * Referral codes are issued by the backend when someone joins Insanjo.
 * Two accepted shapes:
 *   - Legacy vendor codes: "INS" + 8 uppercase hex characters, e.g. INS088BE5CF.
 *   - New app-issued codes: lowercase alphanumeric, 5–16 chars, e.g. e8euei383 (customer)
 *     or w9w9iwjss (vendor) — the shape the Insanjo app shares today.
 */
export const LEGACY_INS_FORMAT = /^INS[0-9A-F]{8}$/;
export const REFERRAL_FORMAT = /^(?:INS[0-9A-F]{8}|[a-z0-9]{5,16})$/i;

// Landing pages that handle each referral audience.
const REFERRAL_PATHS = {
  customer: '/auth/cus',
  vendor: '/auth/ven',
};

// Code a visitor arrived with, kept for the session so a refresh doesn't lose it.
const INVITED_BY_KEY = 'insanjo:referralCode';

export const normalizeCode = (value) => {
  const raw = (value || '').trim();
  if (!raw) return '';
  // Keep legacy INS codes uppercase; fold everything else to lowercase.
  return LEGACY_INS_FORMAT.test(raw.toUpperCase()) ? raw.toUpperCase() : raw.toLowerCase();
};

export const isValidReferralCode = (code) => REFERRAL_FORMAT.test((code || '').trim());

/**
 * Same-origin landing link for an invite. `role` decides between the customer
 * and vendor pages. Defaults to vendor for backwards compatibility.
 */
export function buildInviteLink(code, role = 'vendor') {
  const path = REFERRAL_PATHS[role] || REFERRAL_PATHS.vendor;
  return `${window.location.origin}${path}?ref=${encodeURIComponent(code)}`;
}

/** Mirrors the invite text the mobile app shares. */
export function buildInviteMessage(code, role = 'vendor') {
  return [
    'Join me on Insanjo and manage your goods better!',
    '',
    `Use my referral code: ${code}`,
    `Or sign up here 👉 ${buildInviteLink(code, role)}`,
  ].join('\n');
}

export function getInvitedByCode() {
  try {
    return sessionStorage.getItem(INVITED_BY_KEY) || '';
  } catch {
    return '';
  }
}

export function saveInvitedByCode(code) {
  try {
    if (code) sessionStorage.setItem(INVITED_BY_KEY, code);
    else sessionStorage.removeItem(INVITED_BY_KEY);
  } catch {
    // Storage unavailable (private mode etc.) — the code still lives in the form.
  }
}
