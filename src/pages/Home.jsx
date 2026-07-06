
import { useScrollReveal } from '../hooks/useScrollReveal';

import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Audience from '../components/home/Audience';
import Pricing from '../components/home/Pricing';
import WaitlistCTA from '../components/home/WaitlistCTA';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Hero from '../components/home/Hero';

export default function App() {
  useScrollReveal();

  return (
    <>
      <a
        href="#features"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-canvas"
      >
        Skip to content
      </a>
      <Navbar />
      <main className = "bg-canvas">
        <Hero />
        <Features />
        <HowItWorks />
        <Audience />
        <Pricing />
        <WaitlistCTA />
      </main>
      <Footer />
    </>
  );
}
