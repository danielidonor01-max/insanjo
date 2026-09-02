import { Store, Sparkles } from 'lucide-react';
import PasswordAuthPage from '../components/auth/PasswordAuthPage';

export default function VendorResetPassword() {
  return (
    <PasswordAuthPage
      deepLinkPath="login"
      heroImage="/1.png"
      heroHeading={<>Reset your password<br />the fun way</>}
      heroParagraph="Don't worry vendor — mistakes happen. Pick something you'll actually remember (or let us save it for you)."
      trustItems={[
        { icon: Store, text: 'Your store? Secured. Protected. Yours.' },
        { icon: Sparkles, text: 'Built for vendors, loved by customers' },
      ]}
      endpoint="/pages/reset-password"
      successSeo={{
        title: 'Password Reset Successful | Insanjo',
        description: 'Your Insanjo vendor password has been reset successfully.',
        url: 'https://insanjo.com/pages/reset-password',
      }}
      formSeo={{
        title: 'Reset Password | Insanjo',
        description: 'Set a new password for your Insanjo vendor account.',
        url: 'https://insanjo.com/pages/reset-password',
      }}
      successMessage="Your vendor account password has been reset successfully."
      formSubtitleValid="Choose a strong password for your vendor account."
      formSubtitleInvalid="A valid reset token is required to proceed."
      submitLabel="Reset password"
      submitLoadingLabel="Resetting…"
      invalidTokenError="Invalid or missing reset token."
      defaultFailureError="Reset failed. Please try again."
    />
  );
}
