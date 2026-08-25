import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Mail, ArrowUpRight, LocateIcon, MapPin, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

const PINS = [
    { left: '12%', top: '18%', size: 22, delay: 0 },
    { left: '74%', top: '16%', size: 26, delay: 0.35 },
    { left: '58%', top: '64%', size: 30, delay: 0.7 },
    { left: '20%', top: '72%', size: 20, delay: 1.05 },
    { left: '88%', top: '68%', size: 18, delay: 1.4 },
];

const FindStoreInYourArea = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-60 flex flex-col items-end gap-3">
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                        className="w-72 rounded-3xl border border-border bg-surface p-5 shadow-soft"
                    >
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-11 w-11 text-accent items-center justify-center rounded-full bg-accent-soft text-primary">
                                <LocateIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Locate Vendor Store</p>
                                <p className="text-xs text-muted">See Vendor stores around you</p>
                            </div>
                        </div>

                        {/* cool map design */}
                        <div
                            aria-hidden="true"
                            className="relative h-32 overflow-hidden rounded-3xl border border-line bg-linear-to-br from-accent-soft via-canvas to-surface lg:h-40"
                        >
                            {/* dotted grid */}
                            <div
                                className="absolute inset-0 opacity-60"
                                style={{
                                    backgroundImage:
                                        'radial-gradient(circle, var(--color-line-strong) 1px, transparent 1px)',
                                    backgroundSize: '24px 24px',
                                }}
                            />

                            {/* curved "roads" */}
                            <svg
                                className="absolute inset-0 h-full w-full text-accent/20"
                                viewBox="0 0 400 300"
                                fill="none"
                                preserveAspectRatio="none"
                            >
                                <path d="M40 250 C120 180 160 120 280 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                <path d="M20 90 C120 120 220 70 380 140" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M180 280 C220 220 260 200 360 220" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>

                            {/* animated pins */}
                            {PINS.map((pin, i) => (
                                <motion.span
                                    key={i}
                                    className="absolute flex items-center justify-center rounded-full border border-accent/30 bg-canvas text-accent shadow-[0_10px_24px_-8px_rgba(6,111,242,0.55)]"
                                    style={{ left: pin.left, top: pin.top, width: pin.size, height: pin.size }}
                                    initial={{ y: 0 }}
                                    animate={{ y: [-6, 6, -6] }}
                                    transition={{
                                        duration: 3.2,
                                        delay: pin.delay,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                >
                                    <MapPin size={pin.size - 10} strokeWidth={2.25} />
                                </motion.span>
                            ))}

                            {/* "you are here" pulse */}
                            <motion.span
                                className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gradient text-canvas shadow-[0_10px_24px_-8px_rgba(4,67,149,0.7)]"
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Navigation size={12} />
                            </motion.span>
                        </div>

                            {/*  button*/}
                        <Link  to="/stores">
                        <div className="bg-ink w-full flex items-center justify-center h-10 mt-3 rounded-full font-semibold text-sm text-line">
                                Explore Now! 
                        </div>
                            
                        </Link>

                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setOpen((v) => !v)}
                aria-label="Contact options"
                className="flex h-12 w-12 items-center animate-pulse justify-center rounded-full bg-brand-gradient text-white shadow-soft"
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.span
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="h-5 w-5" />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <MapPin className="h-5 w-5" />
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default FindStoreInYourArea;
