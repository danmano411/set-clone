type Card = {
    amount: 1 | 2 | 3;
    symbol: "oval" | "diamond" | "squiggle";
    fill: "solid" | "striped" | "open";
    color: "red" | "green" | "purple";
};

export function initializeDeck(): Card[] {
    const colors: Card['color'][] = ['red', 'green', 'purple'];
    const fills: Card['fill'][] = ['solid', 'striped', 'open'];
    const symbols: Card['symbol'][] = ['oval', 'squiggle', 'diamond'];
    const amounts: Card['amount'][] = [1, 2, 3];

    const deck: Card[] = [];

    for (const color of colors) {
        for (const fill of fills) {
            for (const symbol of symbols) {
                for (const amount of amounts) {
                    deck.push({ color, fill, symbol, amount });
                }
            }
        }
    }

    return shuffleDeck(deck);
}

function shuffleDeck(deck: Card[]): Card[] {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

export function fillTable(deck: Card[], table: (Card | null)[]): (Card | null)[] {
    while (table.length < 12 && deck.length > 0) {
        table.push(deck.pop() || null);
    }

    for (let i = 0; i < table.length; i++) {
        if (table[i] === null && deck.length > 0) {
            table[i] = deck.pop() || null;
        }
    }

    return table;
}

export function checkSet(cards: Card[]): boolean {
    if (cards.length !== 3) return false;

    const attributes = ['amount', 'symbol', 'fill', 'color'] as const;

    for (const attribute of attributes) {
        const values = cards.map(card => card[attribute]);
        const uniqueValues = new Set(values);

        if (uniqueValues.size === 2) {
            return false; // Two cards have the same value for this attribute
        }
    }

    return true;
}

export function removeSetAndRefillTable(
    table: (Card | null)[],
    deck: Card[],
    setCards: Card[]
): (Card | null)[] {
    // Remove the set cards from the table
    for (const card of setCards) {
        const index = table.findIndex(tableCard => 
            tableCard && 
            tableCard.amount === card.amount &&
            tableCard.symbol === card.symbol &&
            tableCard.fill === card.fill &&
            tableCard.color === card.color
        );
        if (index !== -1) {
            table[index] = null;
        }
    }

    // Refill the table from the deck
    return fillTable(deck, table);
}

export function resetTable(deck: Card[], table: (Card | null)[]): { deck: Card[]; table: (Card | null)[] } {
    // Put all table cards back into the deck
    for (const card of table) {
        if (card !== null) {
            deck.push(card);
        }
    }

    // Clear the table
    table.length = 0;

    // Reshuffle the deck
    const reshuffledDeck = shuffleDeck(deck);

    // Draw 12 new cards for the table
    const newTable = fillTable(reshuffledDeck, []);

    return { deck: reshuffledDeck, table: newTable };
}