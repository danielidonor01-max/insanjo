import ReferralLanding from '../components/auth/ReferralLanding';

/**
 * /auth/ven?ref=… — the vendor referral landing. A vendor invited from the
 * Insanjo app lands here, chooses to sign up if new, then continues in the app.
 */
export default function VendorReferral() {
  return <ReferralLanding role="vendor" />;
}