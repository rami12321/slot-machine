
import React, { useEffect, useRef } from 'react'

export default function ConfettiCanvas({ trigger = false, origin = null, duration = 3200, intensity = 1.0 }) {
    const ref = useRef(null)
    const raf = useRef(null)

    useEffect(() => {
        const canvas = ref.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        let running = false
        const resize = () => {
            const dpr = Math.max(1, window.devicePixelRatio || 1)
            const w = canvas.offsetWidth, h = canvas.offsetHeight
            canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
        resize()
        const ro = new ResizeObserver(resize); ro.observe(canvas)

        if (!trigger) { ctx.clearRect(0, 0, canvas.width, canvas.height); ro.disconnect(); return () => ro.disconnect() }

        running = true
        const W = canvas.offsetWidth, H = canvas.offsetHeight
        const ox = origin?.x ?? W * 0.5
        const oy = origin?.y ?? H * 0.28

        const colors = ['#ffd65a', '#ff5cf3', '#36d6ff', '#9b5cff', '#ffd6a8']
        const count = Math.floor(120 * intensity)
        const pieces = new Array(count).fill(null).map(() => {
            const t = Math.random()
            return {
                x: ox + (Math.random() - 0.5) * 220,
                y: oy - 20 + (Math.random() - 0.5) * 40,
                vx: -3 + Math.random() * 6,
                vy: 2 + Math.random() * 4,
                r: 3 + Math.random() * 8,
                rot: Math.random() * Math.PI * 2,
                spin: (-0.12 + Math.random() * 0.24),
                type: t < 0.5 ? 'chip' : (t < 0.85 ? 'ribbon' : 'coin'),
                color: colors[Math.floor(Math.random() * colors.length)]
            }
        })

        const start = performance.now()
        function step(now) {
            const elapsed = now - start
            ctx.clearRect(0, 0, W, H)
            for (const p of pieces) {
                p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.vx *= 0.998; p.rot += p.spin
                ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot)
                if (p.type === 'chip') {
                    ctx.fillStyle = p.color; ctx.fillRect(-p.r * 1.6, -p.r, p.r * 3.2, p.r * 2)
                    ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(-1, -p.r + 1, 2, p.r * 2 - 2)
                } else if (p.type === 'ribbon') {
                    ctx.fillStyle = p.color; ctx.fillRect(-p.r * 2.5, -p.r * 0.45, p.r * 5, p.r * 0.9)
                } else {
                    ctx.beginPath(); ctx.fillStyle = p.color; ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill()
                    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(-p.r * 0.35, -p.r * 0.35, p.r * 0.44, 0, Math.PI * 2); ctx.fill()
                }
                ctx.restore()
            }
            if (elapsed < duration && running) raf.current = requestAnimationFrame(step)
            else ctx.clearRect(0, 0, W, H)
        }
        raf.current = requestAnimationFrame(step)

        return () => { running = false; raf.current && cancelAnimationFrame(raf.current); ro.disconnect() }
    }, [trigger, origin, duration, intensity])

    return <canvas ref={ref} className="confetti-canvas" style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }} />
}
