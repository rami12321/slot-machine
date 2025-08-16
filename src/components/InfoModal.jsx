
import React from 'react';
import { SYMBOLS } from '../lib/symbols';

export default function InfoModal({ open, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-2 border-amber-400 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto z-10 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                <div className="sticky top-0 bg-indigo-900/90 backdrop-blur-sm p-4 border-b border-amber-300/30 flex justify-between items-center z-20">
                    <h2 className="text-2xl font-bold text-amber-50">HOW TO PLAY & PAYOUTS</h2>
                    <button
                        onClick={onClose}
                        className="text-amber-50 text-2xl hover:text-amber-300 transition-colors"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-amber-200 mb-3">Game Rules</h3>
                        <ul className="space-y-2 text-amber-100">
                            <li>Place your bet using the control panel (or type any amount ≤ balance).</li>
                            <li>Pull the lever or press SPIN to start.</li>
                            <li>Match symbols on paylines to win (middle row pays highest).</li>
                            <li>Diagonals pay 50% of the middle-row payout.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-amber-200 mb-3">Symbol Payouts</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SYMBOLS.map((s, i) => (
                                <div key={i} className="bg-indigo-950/40 p-4 rounded-lg border border-amber-300/20">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-indigo-800 rounded-lg border border-amber-300/20">
                                            {s.svg ?
                                                <span dangerouslySetInnerHTML={{ __html: s.svg }} className="w-full h-full" /> :
                                                <span className="text-2xl text-amber-50">{s.label || s.id}</span>
                                            }
                                        </div>
                                        <div className="text-amber-100">
                                            <div className="font-bold text-amber-50">{s.id.toUpperCase()}</div>
                                            <div className="text-sm">Middle: {s.multiplier}x</div>
                                            <div className="text-sm">Diagonal: {s.multiplier * 0.5}x</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-indigo-950/30 rounded-lg border border-amber-300/20">
                        <div className="font-bold text-amber-200 mb-2">Example:</div>
                        <div className="text-amber-100">
                            Bet $50 with 7 on middle row → $50 × 15 = $750
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
