'use client'

import React from 'react'
import Symbol from './Symbol'

interface CardProps {
    index: number
    
    amount: 1 | 2 | 3
    symbol: "oval" | "diamond" | "squiggle"
    fill: "solid" | "striped" | "open"
    color: "red" | "green" | "purple"

    selected: boolean
    handleToggleCard: (index: number) => void
}

const Card:React.FC<CardProps> = ({
    selected,
    amount,
    symbol,
    fill,
    color,
    handleToggleCard,
    index
}) => {
    return (
        <div onClick={() => handleToggleCard(index)} className={`w-full h-full bg-white shadow-lg rounded-lg transition duration-150 ease-in-out transform cursor-pointer 
        items-center justify-center flex flex-row overflow-hidden ${selected && 'border-2 border-neutral-400 inset-shadow inset-shadow-black'} `}>
            {Array.from({ length: amount }).map((_, index) => (
                <Symbol key={index} symbol={symbol} fill={fill} color={color} />
            ))}
        </div>
    )
}

export default Card