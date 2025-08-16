
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { gsap } from 'gsap'

const Lever = forwardRef(({ onPull, spinning }, ref) => {
    const armRef = useRef(null)
    const knobRef = useRef(null)
    const tlRef = useRef(null)


    const animateOnly = () => {
        if (!armRef.current || !knobRef.current) return
        if (tlRef.current) tlRef.current.kill()
        const tl = gsap.timeline()
        tl.to(armRef.current, { y: 20, duration: 0.18, ease: 'power2.out' })
            .to(armRef.current, { y: 0, duration: 0.3, ease: 'elastic.out(1,0.6)' })
        tl.to(knobRef.current, { rotation: 360, duration: 0.5 }, 0)
        tlRef.current = tl
    }


    const animateAndTrigger = () => {
        if (!armRef.current || !knobRef.current) return
        if (spinning) return
        if (tlRef.current) tlRef.current.kill()
        const tl = gsap.timeline({
            onComplete: () => {
                try { onPull && onPull() } catch (e) { }
            }
        })

        tl.to(armRef.current, { y: 36, duration: 0.18, ease: 'power2.out' })
            .to(armRef.current, { y: 0, duration: 0.42, ease: 'elastic.out(1,0.6)' })
        tl.to(knobRef.current, { rotation: 540, duration: 0.6, ease: 'power1.out' }, 0)
        tlRef.current = tl
    }

    useImperativeHandle(ref, () => ({ animateOnly, animatePull: animateAndTrigger }), [onPull, spinning])

    return (
        <div className="relative h-64 w-32 flex flex-col items-center" aria-hidden>
            { }
            <div className="absolute bottom-0 w-24 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-md shadow-lg"></div>

            { }
            <div className="absolute bottom-4 w-8 h-48 bg-gradient-to-r from-gray-300 to-gray-500 rounded-t-lg"></div>

            { }
            <div className="absolute bottom-16 w-16 h-16 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-gradient-to-r from-gray-300 to-gray-500"></div>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute w-4 h-2 bg-gradient-to-r from-gray-200 to-gray-400 rounded-sm" style={{ transform: `rotate(${i * 60}deg) translateX(22px)` }} />
                ))}
            </div>

            { }
            <div
                ref={armRef}
                role="button"
                tabIndex={0}
                onClick={() => animateAndTrigger()}
                onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !spinning) { e.preventDefault(); animateAndTrigger() } }}
                className="absolute bottom-12 w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg border-4 border-yellow-600 z-10 transition-transform"
                aria-label="Pull lever"
            >
                <div ref={knobRef} className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-700 rounded-full flex items-center justify-center shadow-inner">
                    <div className="w-4 h-4 rounded-full bg-yellow-300"></div>
                </div>
            </div>
        </div>
    )
})

export default Lever
