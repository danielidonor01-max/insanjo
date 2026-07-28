import { Link } from 'react-router-dom';
import { Store, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicStore() {
  return (
    <>
      <SEO
        title="Store | Insanjo"
        description="Browse products from Insanjo vendors."
        url="https://insanjo.com/store"
      />

      <Navbar />

      <main className="min-h-screen bg-canvas pt-24">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          {/* Breadcrumb style back */}
          <Link
            to="/"
            className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to home
          </Link>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface py-24 shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
              <Store className="text-accent" size={28} />
            </div>
            <h1 className="font-serif text-2xl font-semibold text-ink">
              Vendor Store
            </h1>
            <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-muted">
              The public storefront is coming soon. Vendors will be able to
              showcase their products here for customers to browse and purchase.
            </p>
            <span className="mt-6 inline-block rounded-full border border-line bg-canvas px-4 py-1.5 text-xs font-medium text-faint">
              Coming Soon
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}