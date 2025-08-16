
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function Reel({ symbols = [], spinning = false, stopAt = null, reelIndex = 0, onStop = () => { } }) {
    const trackRef = useRef(null)
    const containerRef = useRef(null)
    const pos = useRef({ v: 0 })
    const tweenRef = useRef(null)
    const completedRef = useRef(false)

    const [symbolH, setSymbolH] = useState(80)
    const [baseCount, setBaseCount] = useState(Math.max(1, (symbols && symbols.length) || 1))


    useEffect(() => {
        function update() {
            const el = containerRef.current
            if (!el) return
            const h = Math.max(56, Math.floor(el.clientHeight / 3))
            setSymbolH(h)
        }
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    useEffect(() => {
        setBaseCount(Math.max(1, (symbols && symbols.length) || 1))
    }, [symbols])


    const repeats = 12
    const trackSymbols = []
    for (let r = 0; r < repeats; r++) {
        for (let i = 0; i < baseCount; i++) {
            trackSymbols.push(symbols[i % (symbols.length || 1)] || { id: '?', label: '❓' })
        }
    }

    const baseBlock = Math.max(1, baseCount * symbolH)
    const centerRepeat = Math.floor(repeats / 2)
    const centerBlockStart = baseBlock * centerRepeat


    function getCenterOffset() {
        const el = containerRef.current
        if (!el) return Math.round(symbolH / 2)

        return Math.round(el.clientHeight / 2 - symbolH / 2)
    }

    function applyTransform(v) {
        if (!trackRef.current) return

        const rem = ((v % baseBlock) + baseBlock) % baseBlock
        const centerOffset = getCenterOffset()

        const translateY = centerBlockStart + rem - centerOffset
        trackRef.current.style.transform = `translate3d(0, -${Math.round(translateY)}px, 0)`
    }

    function killTween() {
        try { tweenRef.current && tweenRef.current.kill() } catch { }
        tweenRef.current = null
    }

    function startSpin() {
        completedRef.current = false

        pos.current.v = centerBlockStart + Math.floor(Math.random() * baseCount) * symbolH
        killTween()

        applyTransform(pos.current.v)


        tweenRef.current = gsap.to(pos.current, {
            v: `+=${baseBlock * 300}`,
            duration: 2.0,
            ease: 'none',
            repeat: -1,
            onUpdate: () => applyTransform(pos.current.v),
            force3D: true
        })
    }

    function brakeTo(index) {
        completedRef.current = false
        if (!tweenRef.current) startSpin()


        let desired = centerBlockStart + index * symbolH
        const minAhead = baseBlock * 2
        while (desired <= pos.current.v + 1 + minAhead) desired += baseBlock

        const baseSpeed = 4200
        const distance = desired - pos.current.v
        const duration = Math.max(0.8, distance / baseSpeed) + 0.18

        killTween()

        tweenRef.current = gsap.to(pos.current, {
            v: desired,
            duration,
            ease: 'power4.out',
            onUpdate: () => applyTransform(pos.current.v),
            onComplete: () => {
                if (completedRef.current) return
                completedRef.current = true

                pos.current.v = desired
                applyTransform(pos.current.v)
                try { onStop(reelIndex) } catch (e) { }
            },
            force3D: true
        })
    }


    useEffect(() => {
        pos.current.v = centerBlockStart

        const centerOffset = getCenterOffset()
        if (trackRef.current) trackRef.current.style.transform = `translate3d(0, -${Math.round(centerBlockStart - centerOffset)}px, 0)`
        return () => { killTween() }

    }, [symbolH, baseCount])


    useEffect(() => {
        if (spinning && stopAt === null) startSpin()
        else if (stopAt !== null && typeof stopAt !== 'undefined') brakeTo(stopAt)

    }, [spinning, stopAt])

    return (
        <div ref={containerRef} className="h-full w-full flex items-center justify-center" style={{ padding: 0 }}>
            <div className="w-full h-full overflow-hidden flex items-center justify-center" style={{ padding: 0 }}>
                <div ref={trackRef} className="will-change-transform">
                    {trackSymbols.map((s, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-center"
                            style={{ height: `${symbolH}px`, width: '100%', boxSizing: 'border-box', padding: 0, margin: 0 }}
                        >
                            <div style={{
                                fontSize: Math.max(24, Math.floor(symbolH * 0.46)),
                                color: '#fff',
                                textShadow: '0 6px 18px rgba(0,0,0,0.6)',
                                fontWeight: 800,
                                lineHeight: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%'
                            }}>
                                <span style={{ display: 'inline-block', transform: 'translateY(0)' }}>{s ? (s.label || s.id || '❖') : '❓'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
