import { useScrollReveal } from './hooks/useScrollReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Audience from './components/Audience';
import Pricing from './components/Pricing';
import WaitlistCTA from './components/WaitlistCTA';
import Footer from './components/Footer';

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
