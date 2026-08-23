import { ArrowLeft, Shield, Scale, Info, Mail, FileText, Lock, UserCheck, ShoppingBag, Ban, CreditCard, Handshake, Activity, AlertTriangle, CheckCircle2, BookOpen, Eye, Cookie, Server, Globe, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const termsSections = [
    {
        id: 'acceptance',
        title: '1.1 Acceptance of Terms',
        icon: CheckCircle2,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                By accessing or using Insanjo, you agree to be bound by these terms. If you do not agree, you must not use the platform.
            </p>
        ),
    },
    {
        id: 'platform-role',
        title: '1.2 Platform Role',
        icon: Handshake,
        content: (
            <>
                <p className="text-sm leading-relaxed text-muted">
                    Insanjo is a platform that connects vendors and customers.
                </p>
                <ul className="mt-3 space-y-2">
                    {[
                        'Insanjo does not own, control, or endorse listed products',
                        'Insanjo does not act as the seller in transactions',
                        'All transactions occur directly between vendors and customers',
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            </span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        id: 'eligibility',
        title: '1.3 Eligibility',
        icon: UserCheck,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                You must be at least 18 years old or have legal capacity under applicable laws to use Insanjo.
            </p>
        ),
    },
    {
        id: 'user-accounts',
        title: '1.4 User Accounts',
        icon: Lock,
        content: (
            <ul className="space-y-2">
                {[
                    'You must provide accurate and complete information',
                    'You are responsible for maintaining account security',
                    'You are responsible for all activities under your account',
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        id: 'vendor-responsibilities',
        title: '1.5 Vendor Responsibilities',
        icon: ShoppingBag,
        content: (
            <ul className="space-y-2">
                {[
                    'Provide accurate product and business information',
                    'Fulfill orders honestly and timely',
                    'Comply with all applicable laws and regulations',
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        id: 'prohibited',
        title: '1.6 Prohibited Activities',
        icon: Ban,
        content: (
            <ul className="space-y-2">
                {[
                    'Fraud or deceptive practices',
                    'Posting false or misleading listings',
                    'Uploading illegal, harmful, or restricted content',
                    'Attempting to hack, disrupt, or abuse the platform',
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-50 dark:bg-red-950/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                        </span>
                        <span className="text-red-600 dark:text-red-400">{item}</span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        id: 'payments',
        title: '1.7 Payments & Fees',
        icon: CreditCard,
        content: (
            <>
                <p className="text-sm leading-relaxed text-muted">
                    Certain features of Insanjo may be offered on a paid or subscription basis. By using such features:
                </p>
                <ul className="mt-3 space-y-2">
                    {[
                        'You agree to provide valid payment information',
                        'Fees may be charged on a recurring or one-time basis',
                        'Pricing may change with prior notice',
                        'All fees are non-refundable except where required by law',
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            </span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        id: 'transactions',
        title: '1.8 Transactions & Liability',
        icon: Handshake,
        content: (
            <ul className="space-y-2">
                {[
                    'Transactions are solely between vendors and customers',
                    'Insanjo is not responsible for product quality, delivery, or disputes',
                    'Users agree to resolve disputes directly with each other',
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        id: 'availability',
        title: '1.9 Service Availability',
        icon: Activity,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                Insanjo is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We do not guarantee uninterrupted or error-free service.
            </p>
        ),
    },
    {
        id: 'liability',
        title: '1.10 Limitation of Liability',
        icon: AlertTriangle,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                To the maximum extent permitted by law, Insanjo shall not be liable for any indirect, incidental, or consequential damages arising from the use of the platform.
            </p>
        ),
    },
    {
        id: 'intellectual-property',
        title: '1.11 Intellectual Property',
        icon: FileText,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                All platform content, features, and functionality belong to Insanjo. Users retain ownership of their own content but grant Insanjo the right to use it for operating and improving the platform.
            </p>
        ),
    },
    {
        id: 'suspension',
        title: '1.12 Account Suspension & Termination',
        icon: Ban,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                Insanjo may suspend or terminate accounts that violate these terms. Users may also delete their accounts at any time.
            </p>
        ),
    },
    {
        id: 'governing-law',
        title: '1.13 Governing Law',
        icon: Scale,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                These terms are governed by applicable laws, including the Nigeria Data Protection Act and other relevant regulations.
            </p>
        ),
    },
    {
        id: 'changes-to-terms',
        title: '1.14 Changes to Terms',
        icon: RefreshCw,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                We may update these terms at any time. Continued use of Insanjo means you accept the updated terms.
            </p>
        ),
    },
];

const privacySections = [
    {
        id: 'data-collection',
        title: '2.1 Information We Collect',
        icon: Eye,
        content: (
            <ul className="space-y-2">
                {[
                    'Personal data (name, email, phone number)',
                    'Business data (products, transactions)',
                    'Technical data (IP address, device, usage data)',
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        id: 'data-usage',
        title: '2.2 How We Use Data',
        icon: BookOpen,
        content: (
            <ul className="space-y-2">
                {[
                    'Provide and operate the platform',
                    'Process transactions',
                    'Improve services and user experience',
                    'Send notifications, updates, and optional marketing communications',
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        id: 'legal-basis',
        title: '2.3 Legal Basis & Compliance',
        icon: Scale,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                We process personal data in accordance with applicable data protection laws, including the Nigeria Data Protection Act (NDPA). Where applicable, we align with international standards such as GDPR.
            </p>
        ),
    },
    {
        id: 'data-sharing',
        title: '2.4 Data Sharing',
        icon: Handshake,
        content: (
            <>
                <p className="text-sm leading-relaxed text-muted">
                    We do not sell user data.
                </p>
                <ul className="mt-3 space-y-2">
                    {[
                        'Data may be shared with vendors for order fulfillment',
                        'Data may be shared with service providers (e.g., payments, analytics)',
                        'Data may be disclosed if required by law',
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            </span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        id: 'data-retention',
        title: '2.5 Data Retention',
        icon: Server,
        content: (
            <ul className="space-y-2">
                {[
                    'Data is retained while your account is active',
                    'Some data may be retained for legal or operational purposes',
                    'Data is deleted or anonymized upon request or account deletion',
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        id: 'your-rights',
        title: '2.6 Your Rights',
        icon: Shield,
        content: (
            <ul className="space-y-2">
                {[
                    'Access your personal data',
                    'Correct or update your information',
                    'Request deletion of your data',
                    'Opt out of marketing communications',
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        id: 'cookies',
        title: '2.7 Cookies & Tracking',
        icon: Cookie,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                Insanjo may use cookies and similar technologies to improve user experience and analyze platform usage.
            </p>
        ),
    },
    {
        id: 'security',
        title: '2.8 Security',
        icon: Shield,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                We implement technical and organizational measures to protect your data from unauthorized access, loss, or misuse.
            </p>
        ),
    },
    {
        id: 'sessions',
        title: '2.9 Account Security & Sessions',
        icon: Lock,
        content: (
            <>
                <p className="text-sm leading-relaxed text-muted">
                    Insanjo may maintain multiple active sessions for your account across supported devices. To help protect your account, we may recognize devices, require additional verification for new or unrecognized devices, and send security notifications when new sign-ins occur.
                </p>
                <ul className="mt-3 space-y-2">
                    {[
                        'We may recognize and track trusted devices used to access your account',
                        'Additional verification may be required for new or unrecognized devices',
                        'You may receive security notifications when new sign-ins occur',
                        'You can review and revoke active sessions through your account security settings',
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            </span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        id: 'international',
        title: '2.10 International Users',
        icon: Globe,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                If you access Insanjo from outside Nigeria, you agree that your data may be processed in accordance with applicable laws in our operating regions.
            </p>
        ),
    },
    {
        id: 'policy-updates',
        title: '2.11 Policy Updates',
        icon: RefreshCw,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                We may update this policy from time to time. Continued use of the platform means you accept the updates.
            </p>
        ),
    },
    {
        id: 'contact-privacy',
        title: '2.12 Contact',
        icon: Mail,
        content: (
            <p className="text-sm leading-relaxed text-muted">
                For questions regarding these terms or your data:{' '}
                <a
                    href="mailto:hello@insanjo.com"
                    className="font-medium text-accent underline-offset-2 hover:underline"
                >
                    hello@insanjo.com
                </a>
            </p>
        ),
    },
];

export default function TermsAndPrivacy() {
    return (
        <>
            <SEO
                title="Terms of Service & Privacy Policy | Insanjo"
                description="Understand your rights, responsibilities, and how your data is handled on Insanjo. Read our Terms of Service and Privacy Policy."
                url="https://insanjo.com/legal/terms-and-privacy"
            />

            <div className="min-h-screen bg-canvas">
                <Navbar />

                {/* Hero banner */}
                <div className="relative overflow-hidden bg-linear-to-br from-accent-soft via-surface to-canvas pt-28 pb-16 sm:pt-36 sm:pb-20">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/5" />
                    <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent/5" />

                    <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
                        <Link
                            to="/"
                            className="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
                        >
                            <ArrowLeft
                                size={16}
                                className="transition-transform duration-200 group-hover:-translate-x-0.5"
                            />
                            Back to home
                        </Link>

                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent shadow-sm">
                                <Scale size={26} className="text-white" />
                            </div>
                            <div>
                                <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
                                    Terms of Service & Privacy Policy
                                </h1>
                                <p className="mt-1.5 text-sm text-muted">
                                    Last updated: <strong>April 2026</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
                    {/* Highlight box */}
                    <div className="mb-12 rounded-2xl border border-accent/20 bg-accent-soft/50 p-6 backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                            <Info size={18} className="mt-0.5 shrink-0 text-accent" />
                            <p className="text-sm leading-relaxed text-muted">
                                By creating an account or using Insanjo, you agree to these Terms of Service and Privacy Policy. These terms define your rights, responsibilities, and how your data is handled on the platform.
                            </p>
                        </div>
                    </div>

                    {/* ── Terms of Service ── */}
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft">
                                <FileText size={18} className="text-accent" />
                            </div>
                            <h2 className="font-serif text-2xl font-semibold text-ink">
                                Terms of Service
                            </h2>
                        </div>

                        <div className="space-y-10">
                            {termsSections.map((section) => (
                                <section key={section.id} id={section.id} className="scroll-mt-24">
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft">
                                            <section.icon size={15} className="text-accent" />
                                        </div>
                                        <h3 className="font-serif text-base font-semibold text-ink">
                                            {section.title}
                                        </h3>
                                    </div>
                                    {section.content}
                                </section>
                            ))}
                        </div>
                    </div>

                    {/* ── Divider ── */}
                    <div className="relative mb-16">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-line" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-canvas px-4 text-xs font-semibold uppercase tracking-wider text-faint">
                                Privacy Policy
                            </span>
                        </div>
                    </div>

                    {/* ── Privacy Policy ── */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft">
                                <Shield size={18} className="text-accent" />
                            </div>
                            <h2 className="font-serif text-2xl font-semibold text-ink">
                                Privacy Policy
                            </h2>
                        </div>

                        <div className="space-y-10">
                            {privacySections.map((section) => (
                                <section key={section.id} id={section.id} className="scroll-mt-24">
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft">
                                            <section.icon size={15} className="text-accent" />
                                        </div>
                                        <h3 className="font-serif text-base font-semibold text-ink">
                                            {section.title}
                                        </h3>
                                    </div>
                                    {section.content}
                                </section>
                            ))}
                        </div>
                    </div>

                    {/* Contact card */}
                    <div className="mt-16 rounded-2xl border border-line bg-surface p-6 shadow-sm">
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft">
                                    <Mail size={18} className="text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-ink">Have questions?</p>
                                    <p className="text-xs text-muted">
                                        Reach out to our support team
                                    </p>
                                </div>
                            </div>
                            <a
                                href="mailto:hello@insanjo.com"
                                className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-canvas transition-all hover:bg-accent active:scale-95"
                            >
                                <Mail size={15} />
                                hello@insanjo.com
                            </a>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}