'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Sidebar, Card } from '../components'
import {
  fillTable, initializeDeck, checkSet,
  removeSetAndRefillTable, resetTable, hasAnySet,
} from '../utils/setLogic'

type CardData = {
  amount: 1 | 2 | 3
  symbol: 'oval' | 'diamond' | 'squiggle'
  fill: 'solid' | 'striped' | 'open'
  color: 'red' | 'green' | 'purple'
}

interface TestCase {
  label: string
  description: string
  expect: string
  run: () => void
}

export default function TestContent() {
  const [deck, setDeck] = useState<CardData[]>([])
  const [tableCards, setTableCards] = useState<(CardData | null)[]>([])
  const [selectedCards, setSelectedCards] = useState<boolean[]>(Array(12).fill(false))
  const [completedSets, setCompletedSets] = useState<number>(0)
  const [amountShuffled, setAmountShuffled] = useState<number>(0)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [finalTime, setFinalTime] = useState<number>(0)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)
  const [showShuffleNotice, setShowShuffleNotice] = useState<boolean>(false)
  const startTimeRef = useRef<number>(Date.now())
  const shuffleNoticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  // Initialization
  useEffect(() => {
    const d = initializeDeck()
    const t = fillTable(d, [])
    setDeck([...d])
    setTableCards([...t])
    startTimeRef.current = Date.now()
  }, [])

  // Live timer
  useEffect(() => {
    if (gameOver) return
    const id = setInterval(
      () => setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000)),
      1000,
    )
    return () => clearInterval(id)
  }, [gameOver])

  // Auto-shuffle / game-over check
  useEffect(() => {
    if (tableCards.length === 0 || gameOver) return
    if (!hasAnySet(tableCards)) {
      if (deck.length === 0) {
        setFinalTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
        setGameOver(true)
      } else {
        const n = resetTable(deck, tableCards)
        setDeck([...n.deck])
        setTableCards([...n.table])
        setAmountShuffled(p => p + 1)
        setShowShuffleNotice(true)
        if (shuffleNoticeTimer.current) clearTimeout(shuffleNoticeTimer.current)
        shuffleNoticeTimer.current = setTimeout(() => setShowShuffleNotice(false), 2000)
      }
    }
  }, [tableCards]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRestart = () => {
    const d = initializeDeck()
    const t = fillTable(d, [])
    setDeck([...d])
    setTableCards([...t])
    setSelectedCards(Array(12).fill(false))
    setCompletedSets(0)
    setAmountShuffled(0)
    setElapsedSeconds(0)
    setGameOver(false)
    startTimeRef.current = Date.now()
  }

  const handleToggleCard = (index: number) => {
    const next = [...selectedCards]
    next[index] = !next[index]
    if (next.filter(Boolean).length >= 3) {
      if (checkSet(tableCards.filter((_: CardData | null, i: number) => next[i]) as CardData[])) {
        const newTable = removeSetAndRefillTable(
          tableCards, deck,
          tableCards.filter((_: CardData | null, i: number) => next[i]) as CardData[],
        )
        setTableCards([...newTable])
        setDeck([...deck])
        setCompletedSets((p: number) => p + 1)
      }
      next.fill(false)
    }
    setSelectedCards(next)
  }

  const reShuffleTable = () => {
    const n = resetTable(deck, tableCards)
    setDeck([...n.deck])
    setTableCards([...n.table])
    setAmountShuffled(p => p + 1)
  }

  // ── Test scenarios ────────────────────────────────────────────────────────

  const triggerAutoShuffle = () => {
    // Pool current table cards back into the deck before reshuffling,
    // exactly as the real auto-shuffle effect does.
    const n = resetTable(deck, tableCards)
    setDeck([...n.deck])
    setTableCards([...n.table])
    setAmountShuffled(p => p + 1)
    setShowShuffleNotice(true)
    if (shuffleNoticeTimer.current) clearTimeout(shuffleNoticeTimer.current)
    shuffleNoticeTimer.current = setTimeout(() => setShowShuffleNotice(false), 2000)
  }

  const triggerGameOver = () => {
    // Empty the deck first so the auto-shuffle effect takes the game-over branch.
    setDeck([])
    // Keep current table cards so resetTable has nothing left to return — mirroring
    // the real end-of-game state where all cards have been played out.
    setTableCards(prev => [...prev])
  }

  const testCases: TestCase[] = [
    {
      label: 'Trigger Auto-Shuffle',
      description: 'Pools table cards back into the deck and reshuffles.',
      expect: 'Toast appears at the bottom, table reshuffles, shuffle count increments.',
      run: triggerAutoShuffle,
    },
    {
      label: 'Trigger Game Over',
      description: 'Empties the deck so the next auto-shuffle check hits the game-over branch.',
      expect: 'Game Over overlay appears with set count and elapsed time.',
      run: triggerGameOver,
    },
  ]

  return (
    <div className="flex flex-row min-h-screen">

      {/* ── Test control bar ─────────────────────────────────────────────── */}
      <div className="fixed top-0 inset-x-0 z-50 bg-yellow-400 text-black px-6 py-2 flex items-center gap-6 shadow-lg border-b-2 border-yellow-600">
        <span className="font-black text-xs uppercase tracking-widest shrink-0">
          DEV / TEST — {process.env.NODE_ENV}
        </span>
        <span className="text-yellow-700 text-xs">Deck: {deck.length} cards</span>
        {testCases.map(tc => (
          <div key={tc.label} className="flex items-center gap-2">
            <button
              onClick={tc.run}
              className="px-3 py-1 bg-gray-900 text-yellow-300 text-xs font-bold rounded cursor-pointer hover:bg-black transition-colors"
            >
              {tc.label}
            </button>
            <span className="text-xs text-yellow-800 hidden lg:block">{tc.expect}</span>
          </div>
        ))}
      </div>

      {/* ── Game (padded below test bar) ──────────────────────────────────── */}
      <div className="flex flex-row items-center justify-center min-h-screen w-full pt-10">

        {/* Game Over overlay */}
        {gameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 text-white rounded-2xl p-10 max-w-sm w-[90vw] text-center shadow-2xl border border-gray-700">
              <h2 className="text-4xl font-bold mb-2">Game Over</h2>
              <p className="text-gray-400 mb-4">No more sets possible.</p>
              <p className="text-lg text-gray-300 mb-2">
                You completed{' '}
                <span className="text-green-400 font-bold text-2xl">{completedSets}</span> sets!
              </p>
              <p className="text-gray-400 mb-8">
                Time: <span className="text-white font-semibold">{formatTime(finalTime)}</span>
              </p>
              <button
                onClick={handleRestart}
                className="px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl cursor-pointer transition-colors text-lg"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Auto-shuffle toast */}
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 px-6 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-full shadow-lg border border-gray-600 transition-opacity duration-500 pointer-events-none ${showShuffleNotice ? 'opacity-100' : 'opacity-0'}`}
        >
          No sets found — auto-shuffling...
        </div>

        {/* Board */}
        <div className="grid grid-cols-4 grid-rows-3 flex-grow bg-slate-100 gap-4 h-screen px-32 py-56">
          {tableCards.map((card, index) =>
            card ? (
              <Card
                key={index}
                index={index}
                amount={card.amount}
                symbol={card.symbol}
                fill={card.fill}
                color={card.color}
                selected={selectedCards[index]}
                handleToggleCard={handleToggleCard}
              />
            ) : (
              <div key={index} className="bg-white rounded-lg h-full w-full" />
            ),
          )}
        </div>

        <Sidebar
          completedSets={completedSets}
          cardsInDeck={deck.length}
          reShuffleTable={reShuffleTable}
          amountShuffled={amountShuffled}
          elapsedSeconds={elapsedSeconds}
        />
      </div>
    </div>
  )
}
