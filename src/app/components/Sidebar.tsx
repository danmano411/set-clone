'use client'

import React, { useState } from 'react'

interface SidebarProps {
  cardsInDeck: number
  completedSets: number
  amountShuffled: number
  elapsedSeconds: number
  reShuffleTable: () => void
  scrambleTable: () => void
}

type SymbolType = 'oval' | 'diamond' | 'squiggle'
type FillType = 'solid' | 'striped' | 'open'
type ColorType = 'orange' | 'green' | 'purple'

const colorHex: Record<ColorType, string> = {
  orange: '#f97316',
  green: '#22c55e',
  purple: '#a855f7',
}

const SymbolSVG = ({ symbol, fill, color }: { symbol: SymbolType; fill: FillType; color: ColorType }) => {
  const c = colorHex[color]
  const fillColor = fill === 'open' ? 'none' : c
  const fillOpacity = fill === 'striped' ? 0.35 : 1

  return (
    <svg width="13" height="20" viewBox="0 0 20 30">
      {symbol === 'oval' && (
        <ellipse cx="10" cy="15" rx="8" ry="13" fill={fillColor} fillOpacity={fillOpacity} stroke={c} strokeWidth="2.5" />
      )}
      {symbol === 'diamond' && (
        <polygon points="10,2 18,15 10,28 2,15" fill={fillColor} fillOpacity={fillOpacity} stroke={c} strokeWidth="2.5" />
      )}
      {symbol === 'squiggle' && (
        <rect x="3" y="3" width="14" height="24" rx="4" fill={fillColor} fillOpacity={fillOpacity} stroke={c} strokeWidth="2.5" />
      )}
    </svg>
  )
}

interface MiniCardProps {
  color: ColorType
  symbol: SymbolType
  fill: FillType
  count: 1 | 2 | 3
}

const MiniCard = ({ color, symbol, fill, count }: MiniCardProps) => (
  <div className="bg-white rounded border border-gray-200 flex items-center justify-center gap-0.5 px-1.5 py-1.5 shadow-sm" style={{ minWidth: 52 }}>
    {Array.from({ length: count }).map((_, i) => (
      <SymbolSVG key={i} symbol={symbol} fill={fill} color={color} />
    ))}
  </div>
)

interface ExampleRowProps {
  cards: MiniCardProps[]
  valid: boolean
  label: string
}

const ExampleRow = ({ cards, valid, label }: ExampleRowProps) => (
  <div className="flex items-center gap-2">
    <div className="flex gap-1">
      {cards.map((card, i) => <MiniCard key={i} {...card} />)}
    </div>
    <div className="flex flex-col">
      <span className={`text-xs font-bold leading-none ${valid ? 'text-green-400' : 'text-red-400'}`}>
        {valid ? '✓ SET' : '✗ NOT'}
      </span>
      <span className="text-gray-500 text-xs leading-tight mt-0.5">{label}</span>
    </div>
  </div>
)

const RulesModal = ({ onClose }: { onClose: () => void }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="bg-gray-900 text-white rounded-2xl p-6 max-w-lg w-[90vw] shadow-2xl border border-gray-700 overflow-y-auto max-h-[90vh]"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">How to Play SET</h2>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 text-2xl leading-none cursor-pointer transition-colors"
        >
          ×
        </button>
      </div>

      <p className="text-sm text-gray-300 mb-5">
        Select <span className="text-white font-semibold">3 cards</span> that form a valid SET.
        The game ends when all cards have been matched.
      </p>

      <div className="mb-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">The 4 Attributes</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-300">
          <div><span className="text-white font-medium">Number</span> — 1, 2, or 3</div>
          <div><span className="text-white font-medium">Symbol</span> — oval, diamond, square</div>
          <div><span className="text-white font-medium">Color</span> — orange, green, purple</div>
          <div><span className="text-white font-medium">Fill</span> — solid, striped, open</div>
        </div>
      </div>

      <div className="mb-5 bg-gray-800/60 rounded-xl p-3 border border-gray-700">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">The Rule</h3>
        <p className="text-sm text-gray-300 leading-snug">
          For <span className="text-white font-semibold">each attribute</span>, all 3 cards must be{' '}
          <span className="text-green-400 font-semibold">all the same</span> or{' '}
          <span className="text-green-400 font-semibold">all different</span>.
          If any attribute has exactly 2 matching values, it&apos;s not a SET.
        </p>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Examples</h3>
        <div className="flex flex-col gap-3">
          <ExampleRow
            valid={true}
            label="all different in every attribute"
            cards={[
              { color: 'orange', symbol: 'oval', fill: 'solid', count: 1 },
              { color: 'green', symbol: 'diamond', fill: 'striped', count: 2 },
              { color: 'purple', symbol: 'squiggle', fill: 'open', count: 3 },
            ]}
          />
          <ExampleRow
            valid={true}
            label="same color, all else different"
            cards={[
              { color: 'purple', symbol: 'oval', fill: 'solid', count: 1 },
              { color: 'purple', symbol: 'diamond', fill: 'striped', count: 2 },
              { color: 'purple', symbol: 'squiggle', fill: 'open', count: 3 },
            ]}
          />
          <ExampleRow
            valid={false}
            label="two share a color (2 ≠ all same/different)"
            cards={[
              { color: 'orange', symbol: 'oval', fill: 'solid', count: 1 },
              { color: 'orange', symbol: 'diamond', fill: 'striped', count: 2 },
              { color: 'purple', symbol: 'squiggle', fill: 'open', count: 3 },
            ]}
          />
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white rounded-xl text-sm font-medium cursor-pointer transition-colors"
      >
        Got it
      </button>
    </div>
  </div>
)

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const Sidebar: React.FC<SidebarProps> = ({
  cardsInDeck,
  completedSets,
  amountShuffled,
  elapsedSeconds,
  reShuffleTable,
  scrambleTable,
}) => {
  const [showRules, setShowRules] = useState(false)

  return (
    <>
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      <div className="flex flex-col w-1/5 h-screen bg-gray-800 text-white justify-center relative">
        <div className="flex flex-col w-full h-1/2 items-center p-4 gap-2">
          <h1 className="text-2xl font-bold mb-4">Sidebar</h1>
          <h2 className="text-xl font-bold">Cards Remaining: {cardsInDeck}</h2>
          <h2 className="text-xl font-bold">Completed Sets: {completedSets}</h2>
          <h2 className="text-xl font-bold">New Deals: {amountShuffled}</h2>
          <h2 className="text-xl font-bold">Time: {formatTime(elapsedSeconds)}</h2>
          <button
            onClick={() => reShuffleTable()}
            className="w-3/4 h-10 p-2 bg-green-400 rounded-lg flex flex-col items-center justify-center text-black border-2 border-white cursor-pointer text-sm font-semibold"
          >
            New Deal
          </button>
          <button
            onClick={() => scrambleTable()}
            className="w-3/4 h-10 p-2 bg-sky-400 rounded-lg flex flex-col items-center justify-center text-black border-2 border-white cursor-pointer text-sm font-semibold"
          >
            Scramble Table
          </button>
        </div>

        <button
          onClick={() => setShowRules(true)}
          title="Rules"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/50 hover:text-white/90 flex items-center justify-center text-lg font-bold cursor-pointer transition-all"
        >
          ?
        </button>
      </div>
    </>
  )
}

export default Sidebar