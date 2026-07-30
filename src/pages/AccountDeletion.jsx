import { ArrowLeft, Shield, AlertTriangle, Info, Mail, FileText, Lock, UserX, Users, Building2, RefreshCw, Scale, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sections = [
  {
    id: 'deactivation',
    title: '1. Account Deactivation (Temporary)',
    icon: UserX,
    content: (
      <>
        <p className="text-sm leading-relaxed text-muted">
          When a user chooses to deactivate their account:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            "The user's vendor account is disabled",
            'All businesses owned by the user are deactivated',
            'The user can no longer act as a vendor',
            'The user <strong>may still log in</strong> if they are a staff member of another business',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Deactivation is reversible and does not remove personal data.
        </p>
      </>
    ),
  },
  {
    id: 'permanent-deletion',
    title: '2. Permanent Account Deletion (Irreversible)',
    icon: AlertTriangle,
    content: (
      <>
        <p className="text-sm leading-relaxed text-muted">
          When you choose to permanently delete your account, Insanjo performs an <strong>identity deletion process</strong> rather than a simple database removal. This ensures your personal data is erased while maintaining the integrity of business records.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This approach ensures:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Compliance with data protection laws',
            'Preservation of business records and audit history',
            'Protection of other businesses that relied on the user’s participation',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 dark:bg-emerald-950/20">
                <CheckCircle2 size={12} className="text-emerald-500" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
    subsections: [
      {
        title: '2.1 Login Access Revoked',
        icon: Lock,
        items: [
          'Login permanently disabled',
          'Authentication credentials removed',
        ],
      },
      {
        title: '2.2 Personal Data Erasure',
        icon: UserX,
        items: [
          'Email address',
          'Google email',
          'Password',
          'Profile information (name, image, username)',
          'Contact details and personal identifiers',
        ],
        note: 'Once removed, this data cannot be recovered.',
      },
      {
        title: '2.3 Staff Memberships',
        icon: Users,
        items: [
          'All Staff roles marked inactive',
          'Departure timestamp recorded',
          'Business history and audit trails remain intact',
        ],
        note: 'This ensures businesses retain accurate operational records.',
      },
      {
        title: '2.4 Business Ownership',
        icon: Building2,
        items: [
          'Owned businesses are locked',
          'Ownership history preserved',
        ],
      },
      {
        title: '2.5 Email Reuse',
        icon: RefreshCw,
        items: [
          'Email is released after deletion',
          'User may register again as a new account',
          'No link to previous account remains',
        ],
        note: 'The new account will be treated as a brand-new user, with no link to the previous account.',
      },
    ],
  },
  {
    id: 'retained-data',
    title: '3. Data That May Be Retained',
    icon: Shield,
    content: (
      <>
        <p className="text-sm leading-relaxed text-muted">
          For legal, security, and operational reasons, Insanjo may retain:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Transactional records required for compliance',
            'Anonymized business logs',
            'Aggregated analytics data',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          These records cannot be used to identify the deleted user.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: '4. Your Rights',
    icon: Scale,
    content: (
      <>
        <p className="text-sm leading-relaxed text-muted">
          You have the right to:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Request deactivation of your account',
            'Request permanent deletion of your account',
            'Re-register on Insanjo after deletion',
            'Contact support for questions about your data',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm font-medium text-red-500">
          Permanent deletion requests are irreversible.
        </p>
      </>
    ),
  },
  {
    id: 'irreversibility',
    title: '5. Irreversibility',
    icon: AlertTriangle,
    content: (
      <>
        <p className="text-sm leading-relaxed text-muted">
          Account deletion is permanent and cannot be undone.
        </p>
        <p className="mt-3 text-sm font-medium text-red-500">
          Once completed:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'The account cannot be restored',
            'Previous data (Personal Data) cannot be recovered',
            'All access rights are permanently lost',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-50 dark:bg-red-950/20">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              </span>
              <span className="text-red-600 dark:text-red-400">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Users are encouraged to carefully review this decision before proceeding.
        </p>
      </>
    ),
  },
  {
    id: 'legal-basis',
    title: '6. Legal Basis',
    icon: Scale,
    content: (
      <>
        <p className="text-sm leading-relaxed text-muted">
          Insanjo processes account deletion in accordance with applicable data protection laws, including, where applicable:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Right to erasure ("right to be forgotten")',
            'Data minimization',
            'Purpose limitation',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Where full deletion would compromise business or legal integrity, data is anonymized instead.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: '7. Security & Compliance',
    icon: Shield,
    content: (
      <>
        <p className="text-sm leading-relaxed text-muted">
          This approach ensures:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'Compliance with data protection laws',
            'Preservation of business records and audit history',
            'Protection of other businesses that relied on the user’s participation',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 dark:bg-emerald-950/20">
                <CheckCircle2 size={12} className="text-emerald-500" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'changes',
    title: '8. Changes to This Policy',
    icon: FileText,
    content: (
      <p className="text-sm leading-relaxed text-muted">
        Insanjo may update this policy to reflect product changes, legal requirements, or improvements in data protection practices. Updated versions will be communicated through the app or website.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '9. Contact',
    icon: Mail,
    content: (
      <p className="text-sm leading-relaxed text-muted">
        For questions regarding account deletion or privacy, contact:{' '}
        <a
          href="mailto:info@insanjo.com"
          className="font-medium text-accent underline-offset-2 hover:underline"
        >
          info@insanjo.com
        </a>
      </p>
    ),
  },
];

export default function AccountDeletion() {
  return (
    <>
      <SEO
        title="Account Deletion & Data Privacy Policy | Insanjo"
        description="Learn how Insanjo handles account deactivation, permanent deletion, and data protection. Understand your privacy rights and what data is retained."
        url="https://insanjo.com/legal/account-deletion"
      />

      <div className="min-h-screen bg-canvas">
        <Navbar />

        {/* Hero banner */}
        <div className="relative overflow-hidden bg-linear-to-br from-accent-soft via-surface to-canvas pt-28 pb-16 sm:pt-36 sm:pb-20">
          {/* Decorative elements */}
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
                <Shield size={26} className="text-white" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
                  Account Deletion & Data Privacy
                </h1>
                <p className="mt-1.5 text-sm text-muted">
                  Last updated: <strong>February 2026</strong>
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
              <div className="space-y-2 text-sm leading-relaxed text-muted">
                <p>
                  Insanjo respects your privacy and your right to control your personal data. This page explains how account deactivation and permanent deletion work, what data is removed, what data is retained, and why certain information may be preserved for legal, security, and operational reasons.
                </p>
                <p className="font-medium text-ink">
                  Insanjo supports two different actions:
                </p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span><strong>Account Deactivation</strong> (temporary)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span><strong>Permanent Account Deletion</strong> (irreversible)</span>
                  </li>
                </ul>
                <p>
                  Each option has different effects on your access, roles, and stored data.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft">
                    <section.icon size={18} className="text-accent" />
                  </div>
                  <h2 className="font-serif text-xl font-semibold text-ink">
                    {section.title}
                  </h2>
                </div>

                {section.content}

                {/* Subsections */}
                {section.subsections?.map((sub) => (
                  <div key={sub.title} className="mt-8 ml-6 border-l-2 border-line pl-5">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft">
                        <sub.icon size={15} className="text-accent" />
                      </div>
                      <h3 className="font-serif text-base font-semibold text-ink">
                        {sub.title}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {sub.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {sub.note && (
                      <p className="mt-3 text-sm italic text-muted">
                        {sub.note}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            ))}
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
                href="mailto:info@insanjo.com"
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-canvas transition-all hover:bg-accent active:scale-95"
              >
                <Mail size={15} />
                info@insanjo.com
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}