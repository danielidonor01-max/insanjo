import { Shield, Sparkles } from 'lucide-react';
import PasswordAuthPage from '../components/auth/PasswordAuthPage';

export default function CustomerResetPassword() {
  return (
    <PasswordAuthPage
      deepLinkPath="(customer)/login"
      heroImage="/2.png"
      heroHeading={<>Reset your password<br />the fun way</>}
      heroParagraph="Don't worry — mistakes happen. Pick something you'll actually remember (or let us save it for you)."
      trustItems={[
        { icon: Shield, text: 'Your data? Locked. Tight. Safe.' },
        { icon: Sparkles, text: 'Built for vendors, loved by customers' },
      ]}
      endpoint="/customers/reset-password"
      successSeo={{
        title: 'Password Reset Successful | Insanjo',
        description: 'Your Insanjo password has been reset successfully.',
        url: 'https://insanjo.com/customers/reset-password',
      }}
      formSeo={{
        title: 'Reset Password | Insanjo',
        description: 'Set a new password for your Insanjo customer account.',
        url: 'https://insanjo.com/customers/reset-password',
      }}
      successMessage="Your customer account password has been reset successfully."
      formSubtitleValid="Choose a strong password for your customer account."
      formSubtitleInvalid="A valid reset token is required to proceed."
      submitLabel="Reset password"
      submitLoadingLabel="Resetting…"
      invalidTokenError="Invalid or missing reset token."
      defaultFailureError="Reset failed. Please try again."
    />
  );
}
