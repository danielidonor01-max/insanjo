/**
 * Referral codes are issued by the backend when a vendor signs up:
 * "INS" + 8 uppercase hex characters, e.g. INS088BE5CF.
 */
export const REFERRAL_FORMAT = /^INS[0-9A-F]{8}$/;

// Path the mobile app already shares in its invite message — keep it stable.
const SIGNUP_PATH = '/auth.html';

// Code a visitor arrived with, kept for the session so a refresh doesn't lose it.
const INVITED_BY_KEY = 'insanjo:referralCode';

export const normalizeCode = (value) => (value || '').trim().toUpperCase();

/** Same origin as the current page, so local/staging links stay on local/staging. */
export function buildInviteLink(code) {
  return `${window.location.origin}${SIGNUP_PATH}?ref=${encodeURIComponent(code)}`;
}

/** Mirrors the invite text the mobile app shares. */
export function buildInviteMessage(code) {
  return [
    'Join me on Insanjo and manage your goods better!',
    '',
    `Use my referral code: ${code}`,
    `Or sign up here 👉 ${buildInviteLink(code)}`,
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
  } catch {
    // Storage unavailable (private mode etc.) — the code still lives in the form.
  }
}
