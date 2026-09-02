import { Store, Sparkles } from 'lucide-react';
import PasswordAuthPage from '../components/auth/PasswordAuthPage';

export default function VendorSetPassword() {
  return (
    <PasswordAuthPage
      deepLinkPath="login"
      heroImage="/1.png"
      heroHeading={<>set your password<br />the fun way</>}
      heroParagraph="Don't worry vendor — mistakes happen. Pick something you'll actually remember (or let us save it for you)."
      trustItems={[
        { icon: Store, text: 'Your store? Secured. Protected. Yours.' },
        { icon: Sparkles, text: 'Built for vendors, loved by customers' },
      ]}
      endpoint="/pages/set-password"
      successSeo={{
        title: 'Password set Successful | Insanjo',
        description: 'Your Insanjo vendor password has been set successfully.',
        url: 'https://insanjo.com/pages/set-password',
      }}
      formSeo={{
        title: 'set Password | Insanjo',
        description: 'Set a new password for your Insanjo vendor account.',
        url: 'https://insanjo.com/pages/set-password',
      }}
      successMessage="Your vendor account password has been set successfully."
      formSubtitleValid="Choose a strong password for your vendor account."
      formSubtitleInvalid="A valid set token is required to proceed."
      submitLabel="set password"
      submitLoadingLabel="setting…"
      invalidTokenError="Invalid or missing set token."
      defaultFailureError="set failed. Please try again."
    />
  );
}
