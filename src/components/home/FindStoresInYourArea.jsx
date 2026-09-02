import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LocateIcon, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import MapPreviewVisual from "./MapPreviewVisual";

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
                        <MapPreviewVisual className="h-32 lg:h-40" />

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
