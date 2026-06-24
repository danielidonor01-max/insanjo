import {
  Receipt,
  Package,
  Users,
  MapPin,
  Bell,
  LineChart,
} from 'lucide-react';
import SectionHeading from './SectionHeading';

const FEATURES = [
  {
    icon: Receipt,
    title: 'Real-Time Sales Tracking',
    desc: 'Every transaction recorded instantly, with live revenue insights.',
  },
  {
    icon: Package,
    title: 'Smart Inventory Management',
    desc: 'Stock alerts and expiry notifications before it costs you.',
  },
  {
    icon: Users,
    title: 'Staff & Role Management',
    desc: 'Invite your team with the right permissions for each role.',
  },
  {
    icon: MapPin,
    title: 'Get Discovered Locally',
    desc: 'Marketplace visibility that puts you in front of nearby customers.',
  },
  {
    icon: Bell,
    title: 'Intelligent Notifications',
    desc: 'Customized alerts across every part of your operations.',
  },
  {
    icon: LineChart,
    title: 'Predictive Business Analytics',
    desc: 'Spot trends and forecast revenue before it happens.',
  },
];

export default function Features() {
  return (
    <section id="features" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="Features"
          title="Everything your business needs, nothing it doesn't"
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="reveal group bg-surface p-8 transition-colors duration-300 hover:bg-canvas"
            >
              <span className="inline-grid h-11 w-11 place-items-center rounded-xl border border-line bg-canvas text-ink transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-canvas">
                <Icon size={19} strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-base font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
