import webApi from './webApi';
import { ENV } from '../config/env';

/**
 * Vendor auth for the website. Every function resolves to plain data and
 * rejects with an Error carrying `userMessage`, whichever backend is used.
 *
 * Expected API contract (TODO: confirm all routes + shapes with backend):
 *   POST /vendors/register  { businessName, fullName, email, phone, password, referralCode? }
 *                           -> { token, user }
 *   POST /vendors/login     { identifier, password } -> { token, user }
 *   GET  /vendors/me        -> { user }
 *   GET  /vendors/referrals -> { referrals: [{ businessName, fullName, joinedAt }] }
 * where user = { id, businessName, fullName, email, phone, referralCode }.
 */

const TOKEN_KEY = 'authToken'; // also read by the webApi request interceptor

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage unavailable — the session just won't survive a reload.
  }
}

// ── Real API ─────────────────────────────────────────────

const unwrap = (res) => res.data?.data ?? res.data;

function toUserError(err, fallback) {
  const error = new Error(err.response?.data?.message || err.userMessage || fallback);
  error.userMessage = error.message;
  return error;
}

const apiBackend = {
  async signup(payload) {
    try {
      return unwrap(await webApi.post('/vendors/register', payload));
    } catch (err) {
      throw toUserError(err, 'Sign up failed. Please try again.');
    }
  },
  async login(identifier, password) {
    try {
      return unwrap(await webApi.post('/vendors/login', { identifier, password }));
    } catch (err) {
      throw toUserError(err, 'Login failed. Please try again.');
    }
  },
  async me() {
    try {
      return unwrap(await webApi.get('/vendors/me'));
    } catch (err) {
      throw toUserError(err, 'Could not load your account.');
    }
  },
  async referrals() {
    try {
      return unwrap(await webApi.get('/vendors/referrals'));
    } catch (err) {
      throw toUserError(err, 'Could not load your invites.');
    }
  },
};

// ── Demo backend (this browser only) ─────────────────────
// Stands in for the API so the signup → login → invite flow can be tried end
// to end. Not secure: everything, passwords included, lives in localStorage.

const MOCK_DB_KEY = 'insanjo:mock:vendors';
const MOCK_TOKEN_PREFIX = 'mock.';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

function mockError(message) {
  const error = new Error(message);
  error.userMessage = message;
  return error;
}

function readDb() {
  try {
    return JSON.parse(localStorage.getItem(MOCK_DB_KEY)) || [];
  } catch {
    return [];
  }
}

function writeDb(vendors) {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(vendors));
}

function randomHex(length) {
  const bytes = crypto.getRandomValues(new Uint8Array(length / 2));
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function generateReferralCode(vendors) {
  let code;
  do {
    code = `INS${randomHex(8)}`;
  } while (vendors.some((v) => v.referralCode === code));
  return code;
}

const publicUser = ({ password, ...user }) => user;

function vendorFromToken(vendors) {
  const token = getToken();
  if (!token.startsWith(MOCK_TOKEN_PREFIX)) return null;
  const id = token.slice(MOCK_TOKEN_PREFIX.length);
  return vendors.find((v) => v.id === id) || null;
}

const mockBackend = {
  async signup({ businessName, fullName, email, phone, password, referralCode }) {
    await delay();
    const vendors = readDb();
    if (vendors.some((v) => v.email.toLowerCase() === email.toLowerCase())) {
      throw mockError('An account with this email already exists. Try logging in.');
    }
    if (vendors.some((v) => v.phone === phone)) {
      throw mockError('An account with this phone number already exists. Try logging in.');
    }
    const vendor = {
      id: randomHex(16),
      businessName,
      fullName,
      email,
      phone,
      password,
      referralCode: generateReferralCode(vendors),
      referredBy: referralCode || null,
      joinedAt: new Date().toISOString(),
    };
    writeDb([...vendors, vendor]);
    return { token: MOCK_TOKEN_PREFIX + vendor.id, user: publicUser(vendor) };
  },
  async login(identifier, password) {
    await delay();
    const id = identifier.trim().toLowerCase();
    const vendor = readDb().find((v) => v.email.toLowerCase() === id || v.phone === id);
    if (!vendor || vendor.password !== password) {
      throw mockError('Incorrect email/phone or password.');
    }
    return { token: MOCK_TOKEN_PREFIX + vendor.id, user: publicUser(vendor) };
  },
  async me() {
    await delay(150);
    const vendor = vendorFromToken(readDb());
    if (!vendor) throw mockError('Session expired. Please log in again.');
    return { user: publicUser(vendor) };
  },
  async referrals() {
    await delay(150);
    const vendors = readDb();
    const me = vendorFromToken(vendors);
    if (!me) throw mockError('Session expired. Please log in again.');
    return {
      referrals: vendors
        .filter((v) => v.referredBy === me.referralCode)
        .map(({ businessName, fullName, joinedAt }) => ({ businessName, fullName, joinedAt })),
    };
  },
};

const backend = ENV.useMockAuth ? mockBackend : apiBackend;
export const isDemoAuth = ENV.useMockAuth;

// ── Public API ───────────────────────────────────────────

export async function signup(payload) {
  const { token, user } = await backend.signup(payload);
  setToken(token);
  return user;
}

export async function login(identifier, password) {
  const { token, user } = await backend.login(identifier, password);
  setToken(token);
  return user;
}

export async function fetchCurrentUser() {
  const { user } = await backend.me();
  return user;
}

export async function fetchReferrals() {
  const { referrals } = await backend.referrals();
  return referrals || [];
}

export function logout() {
  setToken('');
}
