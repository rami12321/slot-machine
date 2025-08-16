export function saveBalance(n) {
  try { localStorage.setItem('slot_balance_v1', String(n)) } catch(e) {}
}
export function loadBalance() {
  try {
    const v = localStorage.getItem('slot_balance_v1')
    if (!v) return null
    return Number(v)
  } catch(e) { return null }
}
