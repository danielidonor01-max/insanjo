import { AnimatePresence, motion } from 'framer-motion'
import { SearchIcon, XIcon, StoreIcon } from 'lucide-react'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FindStoresInYourArea() {
    const [open, setOpen] = useState(true)
    const router = useNavigate()

    const handleExploreClick = () => {
        // Route to stores page
        router('/stores')
    }

    return (
        <div className='fixed bottom-5 right-5 z-50'>
            <AnimatePresence mode="wait">
                {open ? (
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 bg-white rounded-full shadow-lg p-2 pr-3"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setOpen(false)}
                            className='bg-linear-60 text-white hover:scale-110 transition-transform shadow-md from-blue-500 to-cyan-500 p-3 rounded-full'
                            aria-label="Close"
                        >
                            <XIcon size={20} />
                        </button>

                        {/* Message and CTA */}
                        <div className="flex items-center gap-2">
                            <StoreIcon size={16} className="text-blue-600" />
                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Stores in your area!
                            </span>
                            <button
                                onClick={handleExploreClick}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors px-2 py-1 rounded-full hover:bg-blue-50"
                            >
                                Explore
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        key="collapsed"
                        initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setOpen(true)}
                        className='bg-linear-60 text-white hover:scale-110 transition-transform shadow-lg from-blue-500 to-cyan-500 p-3 rounded-full'
                        aria-label="Find stores"
                    >
                        <SearchIcon size={20} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}