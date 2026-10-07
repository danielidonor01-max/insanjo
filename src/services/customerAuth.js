import webApi from './webApi';

/**
 * Real CUSTOMER auth API — mounted at /customers (see api/routes/customers.js).
 *
 * The /auth/cus landing uses this OTP flow:
 *
 *   1. GET  /customers/check-referral-code?code=…&email=…   → { valid, reason }
 *   2. POST /customers/check-email        { email }           → { exists, reason?, message? }
 *   3. POST /customers/request-otp { email, firstName, lastName, password, referralCode, policyAccepted, termsVersion }
 *   4. POST /customers/verify-otp         { email, otp }      → { token, username, email, publicId }
 *
 * Note: this router's /request-otp expects the referral in `referralCode`
 * (unlike the vendor router, which uses `referredBy`).
 *
 * Every function resolves to plain data and rejects with an Error carrying
 * `userMessage` (text safe to show in the UI) and optionally `reason`.
 */

function toUserError(err, fallback) {
  const message = err.response?.data?.message || err.userMessage || fallback;
  const error = new Error(message);
  error.userMessage = message;
  error.reason = err.response?.data?.reason;
  return error;
}

/** 1. Is this referral code real? (the system's "check".) */
export async function checkReferralCode(code, email) {
  try {
    const res = await webApi.get('/customers/check-referral-code', { params: { code, email } });
    return res.data; // { valid, reason }
  } catch (err) {
    throw toUserError(err, 'Could not verify your invite link. Please try again.');
  }
}

/** 2. Does a customer account already exist for this email? */
export async function checkEmail(email) {
  try {
    const res = await webApi.post('/customers/check-email', { email });
    return res.data; // { exists, reason?, message? }
  } catch (err) {
    throw toUserError(err, 'Could not check that email.');
  }
}

/** 3. Send the sign-up/activation OTP (stages account + referral on the server). */
export async function requestOTP(payload) {
  try {
    const res = await webApi.post('/customers/request-otp', payload);
    return res.data; // { message }
  } catch (err) {
    throw toUserError(err, 'Failed to send your verification code.');
  }
}

/** 4. Verify the OTP — creates the customer and returns a session token. */
export async function verifyOTP(email, otp) {
  try {
    const res = await webApi.post('/customers/verify-otp', { email, otp });
    return res.data; // { token, username, email, publicId }
  } catch (err) {
    throw toUserError(err, 'That code was incorrect or expired. Please request a new one.');
  }
}