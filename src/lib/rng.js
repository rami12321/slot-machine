
import { SYMBOLS } from './symbols'


const WEIGHTS = [6, 5, 5, 7, 8, 9]

export function weightedPick() {
    const total = WEIGHTS.reduce((a, b) => a + b, 0)
    let r = Math.random() * total
    for (let i = 0; i < WEIGHTS.length; i++) {
        r -= WEIGHTS[i]
        if (r <= 0) return SYMBOLS[i]
    }

    return SYMBOLS[SYMBOLS.length - 1]
}
