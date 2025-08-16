
import React from 'react';

export default function HistoryModal({ open, onClose, history = [] }) {
    if (!open) return null;
    const recent = [...history].reverse();
    return (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-2 border-amber-400 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-auto z-10 shadow-lg">
                <div className="sticky top-0 bg-indigo-900/90 p-4 border-b border-amber-300/30 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-amber-50">Spin History</h3>
                    <button onClick={onClose} className="text-amber-50 text-xl">&times;</button>
                </div>

                <div className="p-4 space-y-3">
                    {recent.length === 0 && <div className="text-amber-100">No history yet.</div>}
                    {recent.map((r, i) => (
                        <div key={i} className="p-3 bg-indigo-950/30 rounded-lg border border-amber-300/10 flex justify-between items-center">
                            <div>
                                <div className="text-amber-200 font-semibold">${r.winAmount} — Bet ${r.bet}</div>
                                <div className="text-sm text-amber-100">At {new Date(r.time).toLocaleString()}</div>
                            </div>
                            <div className="text-right text-amber-100">
                                <div>Before: ${r.balanceBefore}</div>
                                <div>After: ${r.balanceAfter}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
