
import React, { useEffect, useRef, useState } from 'react';
import Reel from './Reel';
import Controls from './Controls';
import Lever from './Lever';
import Celebration from './Celebration';
import InfoModal from './InfoModal';
import HistoryModal from './HistoryModal';
import PaylineOverlay from './PaylineOverlay';
import useSound from '../hooks/useSound';
import { SYMBOLS } from '../lib/symbols';
import { saveBalance, loadBalance } from '../utils/storage';
import { weightedPick } from '../lib/rng';

export default function SlotMachine() {
    const [balance, setBalance] = useState(() => loadBalance() ?? 1000);
    const [bet, setBet] = useState(10);
    const [lastWin, setLastWin] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [stopTargets, setStopTargets] = useState([null, null, null]);
    const [devForceWin, setDevForceWin] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [history, setHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('slot_history_v1') || '[]') } catch (e) { return [] } });
    const [lastTargets, setLastTargets] = useState(null);
    const [stoppedCount, setStoppedCount] = useState(0);
    const [celebrationOpen, setCelebrationOpen] = useState(false);
    const [celebrationType, setCelebrationType] = useState('none');
    const [celebrationAmount, setCelebrationAmount] = useState(0);
    const [winningLines, setWinningLines] = useState([]);
    const [reelsStopped, setReelsStopped] = useState([false, false, false]);

    const sound = useSound();
    const spinLoopRef = useRef(null);
    const evaluatedRef = useRef(false);
    const leverRef = useRef(null);
    const timeouts = useRef([]);
    const machineRef = useRef(null);


    useEffect(() => { saveBalance(balance) }, [balance]);
    useEffect(() => { localStorage.setItem('slot_history_v1', JSON.stringify(history)) }, [history]);
    useEffect(() => { return () => timeouts.current.forEach(clearTimeout) }, []);

    const changeBet = (delta) => setBet(b => Math.max(1, Math.min(b + delta, balance)));
    const maxBet = () => setBet(Math.max(1, Math.min(balance, 500)));
    const resetGame = () => { setBalance(1000); setBet(10); setLastWin(0); setHistory([]); setWinningLines([]) };

    const computeMachineOrigin = () => {
        try {
            const el = machineRef.current; if (!el) return null;
            const rect = el.getBoundingClientRect();
            return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2.8) };
        } catch { return null; }
    };

    const computeTargetsForWinCase = (caseName, idx) => {
        const mod = n => ((n % SYMBOLS.length) + SYMBOLS.length) % SYMBOLS.length;
        switch (caseName) {
            case 'middle': return [idx, idx, idx];
            case 'diag1': return [mod(idx + 1), mod(idx), mod(idx - 1)];
            case 'diag2': return [mod(idx - 1), mod(idx), mod(idx + 1)];
            default: return Array.from({ length: 3 }, () => Math.floor(Math.random() * SYMBOLS.length));
        }
    };


    const STOP_DELAYS = [1000, 1600, 2200];

    const startSpin = () => {
        if (spinning) return;
        if (balance < bet) {
            sound.playEmpty?.();
            setCelebrationType('none'); setCelebrationOpen(true);
            timeouts.current.push(setTimeout(() => setCelebrationOpen(false), 900));
            return;
        }

        setSpinning(true);
        setStoppedCount(0);
        setStopTargets([null, null, null]);
        evaluatedRef.current = false;
        setWinningLines([]);
        setCelebrationOpen(false); setCelebrationAmount(0); setCelebrationType('none');

        try { leverRef.current?.animatePull?.() } catch { }


        try { spinLoopRef.current = sound.playSpinLoop() } catch { spinLoopRef.current = null }


        let targets;
        if (devForceWin) {
            const cases = ['middle', 'diag1', 'diag2'];
            const chosen = cases[Math.floor(Math.random() * cases.length)];
            const s = weightedPick();
            const idx = SYMBOLS.findIndex(x => x.id === s.id);
            targets = computeTargetsForWinCase(chosen, idx);
            setLastTargets({ targets, forcedCase: chosen, balanceBefore: balance });
        } else {
            targets = Array.from({ length: 3 }, () => {
                const s = weightedPick(); return SYMBOLS.findIndex(x => x.id === s.id);
            });
            setLastTargets({ targets, forcedCase: null, balanceBefore: balance });
        }


        setBalance(b => b - bet);


        computeMachineOrigin();


        for (let i = 0; i < 3; i++) {
            const delay = STOP_DELAYS[i] + Math.floor(Math.random() * 80);
            const t = setTimeout(() => setStopTargets(prev => {
                const copy = [...prev]; copy[i] = targets[i]; return copy;
            }), delay);
            timeouts.current.push(t);
        }
    };

    const handleReelStop = (idx) => {
        sound.playStop?.();
        setStoppedCount(c => {
            const next = c + 1;
            if (next >= 3 && !evaluatedRef.current) {
                evaluatedRef.current = true;

                setTimeout(() => {
                    try { sound.stopSpinLoop?.(spinLoopRef.current) } catch { }
                    if (lastTargets?.targets) {
                        const res = evaluateResult(lastTargets.targets);
                        setWinningLines(res.lines);
                        const after = balance + (res.totalWin || 0);
                        const record = {
                            time: Date.now(), bet,
                            winAmount: res.totalWin || 0,
                            balanceBefore: lastTargets.balanceBefore ?? (balance + bet),
                            balanceAfter: after,
                            targets: lastTargets.targets
                        };
                        setHistory(h => [...h, record]);

                        if (res.winType === 'big') {
                            setCelebrationType('big');
                            setCelebrationAmount(res.totalWin);
                            setCelebrationOpen(true);
                            sound.playWinBig?.();
                        } else if (res.winType === 'small') {
                            setCelebrationType('small');
                            setCelebrationAmount(res.totalWin);
                            setCelebrationOpen(true);
                            sound.playWinSmall?.();
                        } else {
                            setCelebrationType('none');
                            setCelebrationAmount(0);
                            setCelebrationOpen(true);
                        }

                        timeouts.current.push(setTimeout(() => setCelebrationOpen(false), res.winType === 'none' ? 900 : 3200));
                        if (res.totalWin > 0) {
                            setLastWin(res.totalWin);
                            setBalance(b => b + res.totalWin);
                        }
                    }
                    setSpinning(false);
                }, 90);
            }
            return next;
        });
    };

    function evaluateResult(finalTargets) {
        const mod = n => ((n % SYMBOLS.length) + SYMBOLS.length) % SYMBOLS.length;
        const vis = finalTargets.map(center => ({
            top: SYMBOLS[mod(center - 1)],
            middle: SYMBOLS[mod(center)],
            bottom: SYMBOLS[mod(center + 1)],
        }));
        const lines = {
            middle: [{ r: 0, row: 'middle' }, { r: 1, row: 'middle' }, { r: 2, row: 'middle' }],
            diag1: [{ r: 0, row: 'top' }, { r: 1, row: 'middle' }, { r: 2, row: 'bottom' }],
            diag2: [{ r: 0, row: 'bottom' }, { r: 1, row: 'middle' }, { r: 2, row: 'top' }],
        };
        const mult = { middle: 1.0, diag1: 0.5, diag2: 0.5 };
        let totalWin = 0;
        let detected = 'none';
        const hitLines = [];
        for (const [name, pattern] of Object.entries(lines)) {
            const s0 = vis[pattern[0].r][pattern[0].row].id;
            const s1 = vis[pattern[1].r][pattern[1].row].id;
            const s2 = vis[pattern[2].r][pattern[2].row].id;
            if (s0 === s1 && s1 === s2) {
                const sym = vis[pattern[1].r][pattern[1].row];
                const base = sym.multiplier || 1;
                totalWin += Math.max(1, Math.floor(bet * base * mult[name]));
                hitLines.push(name);
                if (name === 'middle') detected = 'big';
                else if (detected !== 'big') detected = 'small';
            }
        }
        return { totalWin, winType: detected, lines: hitLines };
    }

    return (
        <div
            ref={machineRef}
            className="w-full max-w-3xl bg-gradient-to-br from-indigo-900 via-purple-800 to-amber-600 rounded-3xl shadow-2xl p-6 border-4 border-amber-400 relative overflow-hidden gold-ring"
        >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-12 pointer-events-none"></div>

            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-400 to-pink-400 px-8 py-2 rounded-b-lg shadow-lg z-30">
                <h1 className="text-3xl font-bold text-white tracking-wider neon-text">CYBER SLOTS</h1>
            </div>

            <div className="relative z-30 pointer-events-auto flex flex-col gap-6 mt-6">
                { }
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-indigo-950/20 backdrop-blur-sm rounded-xl p-4 border-2 border-amber-300/30 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-950/40 px-4 py-2 rounded-lg border border-amber-300/40 shadow-lg">
                            <div className="text-xs text-blue-200 uppercase tracking-wider">Balance</div>
                            <div className="text-xl font-bold text-amber-50">${balance}</div>
                        </div>
                        <div className="bg-indigo-950/40 px-4 py-2 rounded-lg border border-amber-300/40 shadow-lg">
                            <div className="text-xs text-pink-300 uppercase tracking-wider">Last Win</div>
                            <div className="text-xl font-bold text-amber-50">${lastWin}</div>
                        </div>
                    </div>
                    <div className="bg-indigo-950/40 px-4 py-2 rounded-lg border border-amber-300/40 shadow-lg">
                        <div className="text-xs text-green-200 uppercase tracking-wider">Current Bet</div>
                        <div className="text-xl font-bold text-amber-50">${bet}</div>
                    </div>
                </div>

                { }
                <div className="flex flex-col md:flex-row gap-6 items-stretch">
                    <div className="flex-1 bg-gradient-to-b from-indigo-900/30 to-purple-900/30 rounded-2xl p-4 border-4 border-amber-300 shadow-2xl">
                        { }
                        <div className="bg-gradient-to-b from-indigo-900/40 to-purple-900/40 rounded-lg p-3 h-[240px] sm:h-[260px] md:h-[280px] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/08 pointer-events-none"></div>

                            <div className="flex h-full gap-1 md:gap-2">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="flex-1 rounded-md overflow-hidden border border-amber-300/12 shadow-inner">
                                        <Reel
                                            symbols={SYMBOLS}
                                            spinning={spinning}
                                            stopAt={stopTargets[i]}
                                            reelIndex={i}
                                            onStop={handleReelStop}
                                        />
                                    </div>
                                ))}
                            </div>

                            <PaylineOverlay showFor={winningLines} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-between w-full md:w-44">
                        <div className="z-40"><Lever ref={leverRef} onPull={startSpin} spinning={spinning} /></div>

                        <button
                            disabled={spinning || bet > balance || bet <= 0}
                            onClick={startSpin}
                            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold shadow-2xl transition-all mt-4 z-40 ${!spinning && bet <= balance && bet > 0 ? 'bg-gradient-to-br from-amber-300 to-amber-400 transform hover:scale-105 active:scale-95 cursor-pointer shadow-amber-300/60' :
                                    'bg-gradient-to-br from-gray-400 to-gray-500 opacity-60 cursor-not-allowed'
                                }`}
                        >
                            <span className="text-amber-800 text-4xl animate-pulse">▶</span>
                            <span className="text-amber-800 text-sm mt-1">SPIN</span>
                        </button>
                    </div>
                </div>

                <div className="w-full z-40">
                    <Controls
                        bet={bet}
                        changeBet={changeBet}
                        onMax={maxBet}
                        onSpin={startSpin}
                        spinning={spinning}
                        onReset={resetGame}
                        devForceWin={devForceWin}
                        setDevForceWin={setDevForceWin}
                        onInfo={() => setInfoOpen(true)}
                        onShowHistory={() => setHistoryOpen(true)}
                        balance={balance}
                    />
                </div>
            </div>

            <Celebration open={celebrationOpen} type={celebrationType} amount={celebrationAmount} origin={computeMachineOrigin()} onDone={() => { }} />
            <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
            <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} history={history} />
        </div>
    );
}
