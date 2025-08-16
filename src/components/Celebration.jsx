
import React, { useEffect, useState } from 'react'
import ConfettiCanvas from './ConfettiCanvas'
import { motion, AnimatePresence } from 'framer-motion'

export default function Celebration({ open = false, type = 'none', amount = 0, origin = null, onDone = () => { } }) {
    const [show, setShow] = useState(false)
    useEffect(() => {
        if (open) {
            setShow(true)
            const t = setTimeout(() => { setShow(false); onDone && onDone() }, type === 'big' ? 3400 : (type === 'small' ? 2200 : 900))
            return () => clearTimeout(t)
        } else setShow(false)
    }, [open, type, onDone])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
                    role="status"
                    aria-live="polite"
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

                    {(type === 'big' || type === 'small') && <ConfettiCanvas trigger={show} />}

                    <motion.div
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-900 to-purple-900 border-2 border-pink-500 rounded-xl p-8 shadow-[0_0_40px_rgba(192,132,252,0.5)] z-10 pointer-events-auto"
                    >
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-4 text-white neon-text-pink">
                                {type === 'big' ? 'JACKPOT!' :
                                    type === 'small' ? 'YOU WIN!' : 'NO WIN'}
                            </div>

                            {type !== 'none' && (
                                <div className="text-6xl font-bold text-yellow-300 mb-6 neon-text">
                                    ${amount}
                                </div>
                            )}

                            <button
                                onClick={() => setShow(false)}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
                            >
                                CONTINUE
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}