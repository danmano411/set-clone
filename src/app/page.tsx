'use client';

import React, { useEffect, useRef, useState } from "react";
import { Sidebar, Card } from "./components";
import { fillTable, initializeDeck, checkSet, removeSetAndRefillTable, resetTable, hasAnySet } from "./utils/setLogic";

type Card = {
  amount: 1 | 2 | 3;
  symbol: "oval" | "diamond" | "squiggle";
  fill: "solid" | "striped" | "open";
  color: "orange" | "green" | "purple";
};

export default function Home() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [tableCards, setTableCards] = useState<(Card | null)[]>([]);
  const [selectedCards, setSelectedCards] = useState<boolean[]>(Array(12).fill(false));
  const [completedSets, setCompletedSets] = useState<number>(0);
  const [amountShuffled, setAmountShuffled] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [finalTime, setFinalTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showShuffleNotice, setShowShuffleNotice] = useState<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());
  const shuffleNoticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  useEffect(() => {
    const initializedDeck = initializeDeck();
    const table = fillTable(initializedDeck, []);
    setDeck([...initializedDeck]);
    setTableCards([...table]);
    startTimeRef.current = Date.now();
  }, []);

  // Live timer — ticks every second while game is active
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Auto-shuffle when no sets are available; end game when deck is also empty
  useEffect(() => {
    if (tableCards.length === 0 || gameOver) return;
    if (!hasAnySet(tableCards)) {
      if (deck.length === 0) {
        setFinalTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
        setGameOver(true);
      } else {
        const newCards = resetTable(deck, tableCards);
        setDeck([...newCards.deck]);
        setTableCards([...newCards.table]);
        setAmountShuffled(prev => prev + 1);
        setShowShuffleNotice(true);
        if (shuffleNoticeTimer.current) clearTimeout(shuffleNoticeTimer.current);
        shuffleNoticeTimer.current = setTimeout(() => setShowShuffleNotice(false), 2000);
      }
    }
  }, [tableCards]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRestart = () => {
    const newDeck = initializeDeck();
    const newTable = fillTable(newDeck, []);
    setDeck([...newDeck]);
    setTableCards([...newTable]);
    setSelectedCards(Array(12).fill(false));
    setCompletedSets(0);
    setAmountShuffled(0);
    setElapsedSeconds(0);
    setGameOver(false);
    startTimeRef.current = Date.now();
  };

  const handleToggleCard = (index: number) => {
    const newSelectedCards = [...selectedCards];
    newSelectedCards[index] = !newSelectedCards[index];

    if (newSelectedCards.filter(Boolean).length >= 3) {
      if (checkSet(tableCards.filter((_: Card | null, i: number) => newSelectedCards[i]) as Card[])) {
        const newTable = removeSetAndRefillTable(tableCards, deck, tableCards.filter((_: Card | null, i: number) => newSelectedCards[i]) as Card[]);
        setTableCards([...newTable]);
        setDeck([...deck]);
        setCompletedSets((prev: number) => prev + 1);
      }
      newSelectedCards.fill(false);
    }

    setSelectedCards(newSelectedCards);
  };

  const reShuffleTable = () => {
    const newCards = resetTable(deck, tableCards);
    setDeck(newCards.deck);
    setTableCards(newCards.table);
    setAmountShuffled(prev => prev + 1);
  }

  const scrambleTable = () => {
    const shuffled = [...tableCards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setTableCards(shuffled);
  }

  return (
    <div className="flex flex-row items-center justify-center min-h-screen">
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 text-white rounded-2xl p-10 max-w-sm w-[90vw] text-center shadow-2xl border border-gray-700">
            <h2 className="text-4xl font-bold mb-2">Game Over</h2>
            <p className="text-gray-400 mb-4">No more sets possible.</p>
            <p className="text-lg text-gray-300 mb-2">
              You completed{' '}
              <span className="text-green-400 font-bold text-2xl">{completedSets}</span>{' '}
              sets!
            </p>
            <p className="text-gray-400 mb-2">
              Time: <span className="text-white font-semibold">{formatTime(finalTime)}</span>
            </p>
            <p className="text-gray-400 mb-8">
              New Deals: <span className="text-white font-semibold">{amountShuffled}</span>
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
      <div className="grid grid-cols-4 grid-rows-3 flex-grow bg-slate-100 gap-[clamp(0.25rem,1vw,1rem)] h-screen px-[clamp(2rem,6vw,6rem)] py-[clamp(2rem,6vh,8rem)]">
        {tableCards.map((card, index) => (
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
            <div key={index} className="bg-white rounded-lg h-full w-full"></div>
          )
        ))}
      </div>
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 px-6 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-full shadow-lg border border-gray-600 transition-opacity duration-500 pointer-events-none ${showShuffleNotice ? 'opacity-100' : 'opacity-0'}`}>
        No sets found — auto-shuffling...
      </div>
      <Sidebar completedSets={completedSets} cardsInDeck={deck.length} reShuffleTable={reShuffleTable} scrambleTable={scrambleTable} amountShuffled={amountShuffled} elapsedSeconds={elapsedSeconds} />
    </div>
  );
}
