import React, { useMemo } from 'react'
import { FaPlay, FaInfoCircle, FaHistory, FaSync } from 'react-icons/fa'
import { FiMinus, FiPlus } from 'react-icons/fi'

export default function Controls({
  bet, changeBet, onMax, onSpin, spinning, onReset,
  devForceWin, setDevForceWin, onInfo, onShowHistory, balance
}) {
  const canSpin = useMemo(() => !spinning && bet > 0 && bet <= balance, [spinning, bet, balance])

  return (
    <div className="flex flex-col gap-4 w-full bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl p-4 border-2 border-amber-400/40 shadow-lg">

      { }
      <div className="bg-gradient-to-b from-gray-900/60 to-gray-900/80 rounded-xl p-4 border border-amber-300/30">
        <div className="text-amber-300 font-semibold mb-2">BET AMOUNT</div>
        <div className="flex gap-2 items-center">
          <button
            className="btn btn-coal"
            onClick={() => changeBet(-10)}
            aria-label="decrease bet"
          >
            <FiMinus className="mr-2" />
            <span>−10</span>
          </button>

          <input
            type="number"
            min={1}
            max={balance}
            value={bet}
            onChange={e => {
              const next = Number(e.target.value) || 0
              changeBet(next - bet)
            }}
            className="flex-1 py-2 px-3 rounded-lg bg-gray-900/80 text-white font-bold text-center border border-amber-300/30 shadow-inner"
          />

          <button
            className="btn btn-coal"
            onClick={() => changeBet(10)}
            aria-label="increase bet"
          >
            <FiPlus className="mr-2" />
            <span>+10</span>
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            className="btn btn-gold flex-1 font-bold"
            onClick={onMax}
          >
            MAX
          </button>

          <button
            className="btn btn-coal flex-1"
            onClick={onReset}
          >
            <FaSync className="mr-2" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      { }
      <div className="flex gap-2">
        <button
          className="btn btn-coal flex-1"
          onClick={onInfo}
        >
          <FaInfoCircle className="mr-2" />
          <span>Paytable</span>
        </button>

        <button
          className="btn btn-coal flex-1"
          onClick={onShowHistory}
        >
          <FaHistory className="mr-2" />
          <span>History</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-amber-300">
          <input
            type="checkbox"
            checked={devForceWin}
            onChange={e => setDevForceWin(e.target.checked)}
            className="w-4 h-4 accent-yellow-500"
          />
          <span>Force Win (Dev)</span>
        </label>

        <button
          disabled={!canSpin}
          onClick={onSpin}
          className={`btn ${canSpin ? 'btn-gold gold-ring' : 'btn-coal'} w-36`}
          aria-disabled={!canSpin}
          title="Spin"
        >
          <FaPlay className="mr-2" />
          SPIN
        </button>
      </div>
    </div>
  )
}
