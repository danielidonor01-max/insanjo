import ReferralLanding from '../components/auth/ReferralLanding';

/**
 * /auth/cus?ref=… — the customer referral landing. A customer invited from the
 * Insanjo app lands here, chooses to sign up if new, then continues in the app.
 */
export default function CustomerReferral() {
  return <ReferralLanding role="customer" />;
}