'use client';

import React, { useEffect, useState } from "react";
import { Sidebar, Card } from "./components";
import { fillTable, initializeDeck, checkSet, removeSetAndRefillTable, resetTable} from "./utils/setLogic";

type Card = {
  amount: 1 | 2 | 3;
  symbol: "oval" | "diamond" | "squiggle";
  fill: "solid" | "striped" | "open";
  color: "red" | "green" | "purple";
};

export default function Home() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [tableCards, setTableCards] = useState<(Card | null)[]>([]);
  const [selectedCards, setSelectedCards] = useState<boolean[]>(Array(12).fill(false));
  const [completedSets, setCompletedSets] = useState<number>(0);
  const [amountShuffled, setAmountShuffled] = useState<number>(0);

  useEffect(() => {
    const initializedDeck = initializeDeck();
    setDeck(initializedDeck);
    setTableCards(fillTable(initializedDeck, [])); // Fill table immediately
  }, []);

  const handleToggleCard = (index: number) => {
    setSelectedCards(prev => {
      const newSelectedCards = [...prev];
      newSelectedCards[index] = !newSelectedCards[index];

      // If 3 cards are selected, reset the selection
      if (newSelectedCards.filter(Boolean).length >= 3) {
          if (checkSet(tableCards.filter((_, i) => newSelectedCards[i]) as Card[])) {
            // If a valid set is found, reset the selection
            removeSetAndRefillTable(tableCards, deck, tableCards.filter((_, i) => newSelectedCards[i]) as Card[]);
            setCompletedSets(prev => prev + 1);
          }
        newSelectedCards.fill(false);
      }

      return newSelectedCards;
    });
  };

  const reShuffleTable = () => {
    let newCards = resetTable(deck, tableCards);
    setDeck(newCards.deck);
    setTableCards(newCards.table);
    setAmountShuffled(prev => prev + 1);
  }

  return (
    <div className="flex flex-row items-center justify-center min-h-screen">
      <div className="grid grid-cols-4 grid-rows-3 flex-grow bg-slate-100 gap-4 h-screen px-32 py-56">
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
      <Sidebar completedSets={completedSets} cardsInDeck={deck.length} reShuffleTable={reShuffleTable} amountShuffled={amountShuffled}/>
    </div>
  );
}
