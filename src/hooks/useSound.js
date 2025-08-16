
import { useRef, useEffect } from 'react'

export default function useSound() {
    const audioCtxRef = useRef(null)
    const buffersRef = useRef({})
    const audioElRef = useRef({})
    const lastStopRef = useRef(0)
    const loadedRef = useRef(false)

    const ensureCtx = () => {
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
        return audioCtxRef.current
    }

    useEffect(() => {
        if (loadedRef.current) return
        loadedRef.current = true
        const ctx = ensureCtx()
        const names = ['reel_stop.mp3', 'small_win.mp3', 'win_fanfare.mp3', 'empty_balance.mp3']
        names.forEach(n => {
            fetch(`/sounds/${n}`).then(r => {
                if (!r.ok) throw new Error('no file')
                return r.arrayBuffer()
            }).then(ab => ctx.decodeAudioData(ab)).then(buf => {
                buffersRef.current[n] = buf
            }).catch(() => { })
        })
        try {
            const a = new Audio('/sounds/spin_loop.mp3')
            a.loop = true
            audioElRef.current.spin = a
        } catch (e) { }
    }, [])

    function playBuffer(name, vol = 1) {
        try {
            const ctx = ensureCtx()
            const buf = buffersRef.current[name]
            if (!buf) return false
            const s = ctx.createBufferSource()
            const g = ctx.createGain()
            g.gain.value = vol
            s.buffer = buf
            s.connect(g); g.connect(ctx.destination)
            s.start()
            return true
        } catch (e) { return false }
    }

    function playSpinLoop() {
        try { ensureCtx().resume().catch(() => { }) } catch (e) { }
        const a = audioElRef.current.spin
        if (a) { a.currentTime = 0; a.play().catch(() => { }); return a }
        return null
    }
    function stopSpinLoop(handle) { if (!handle) return; try { handle.pause(); handle.currentTime = 0 } catch (e) { } }

    function playStop() {
        const now = performance.now()
        if (now - (lastStopRef.current || 0) < 18) { lastStopRef.current = now } else lastStopRef.current = now
        if (!playBuffer('reel_stop.mp3', 0.95)) {
            try {
                const ctx = ensureCtx(); const o = ctx.createOscillator(); const g = ctx.createGain()
                o.type = 'square'; o.frequency.value = 720; g.gain.value = 0.06
                o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.06)
            } catch (e) { }
        }
    }
    function playWinBig() {
        if (!playBuffer('win_fanfare.mp3', 0.95)) {
            try { const ctx = ensureCtx();[880, 1100, 1320].forEach((f, i) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.value = 0.06; o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + i * 0.07); o.stop(ctx.currentTime + i * 0.07 + 0.12) }) } catch (e) { }
        }
    }
    function playWinSmall() { if (!playBuffer('small_win.mp3', 0.9)) { try { const ctx = ensureCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = 720; g.gain.value = 0.06; o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.08) } catch (e) { } } }
    function playEmpty() { if (!playBuffer('empty_balance.mp3', 0.9)) { try { const ctx = ensureCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = 140; g.gain.value = 0.08; o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.16) } catch (e) { } } }

    return { ensureCtx, playSpinLoop, stopSpinLoop, playStop, playWinBig, playWinSmall, playEmpty }
}
