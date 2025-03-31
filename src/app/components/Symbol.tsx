import React from 'react'
import { TbOvalFilled } from "react-icons/tb";
import { TbOval } from "react-icons/tb";

import { RiPokerDiamondsFill } from "react-icons/ri";
import { RiPokerDiamondsLine } from "react-icons/ri";

import { TbRectangleVerticalFilled } from "react-icons/tb";
import { TbRectangleVertical } from "react-icons/tb";

interface SymbolProps {
    symbol: "oval" | "diamond" | "squiggle"
    fill: "solid" | "striped" | "open"
    color: "red" | "green" | "purple"
}

const Symbol: React.FC<SymbolProps> = ({
    symbol,
    fill,
    color
}) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null; // Prevent rendering on the server
    }

    return (
        <div className={`inline-flex text-9xl items-center justify-center overflow-hidden
        ${color === "red" ? 'text-red-500' : color === 'green' ? 'text-green-500' : 'text-purple-500'}
         `}>
            {
            symbol === "oval" ?
                fill === "solid" ? (
                <TbOvalFilled size={70} />
                ) : fill === "striped" ? (
                <div className="relative">
                    <TbOvalFilled opacity={0.45} size={70} />
                    <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div
                        key={index}
                        className='h-1 w-full bg-white my-0.5'
                        style={{
                            opacity: 0.6,
                        }}
                        ></div>
                    ))}
                    </div>
                </div>
                ) : (
                <TbOval size={70} />
                )
                : symbol === "diamond" ?
                fill === "solid" ? (
                    <RiPokerDiamondsFill size={70} />
                ) : fill === "striped" ? (
                    <div className="relative">
                    <RiPokerDiamondsFill opacity={0.45} size={70} />
                    <div className='absolute inset-0 flex flex-col items-center justify-center'>
                        {Array.from({ length: 7 }).map((_, index) => (
                        <div
                            key={index} 
                            className='h-1 w-full bg-white my-0.5'
                            style={{
                            opacity: 0.6,
                            }}
                        ></div>
                        ))}
                    </div>
                    </div>
                ) : (
                    <RiPokerDiamondsLine size={70} />
                )
                : symbol === "squiggle" ?
                    fill === "solid" ? (
                    <TbRectangleVerticalFilled size={70} />
                    ) : fill === "striped" ? (
                    <div className="relative">
                        <TbRectangleVerticalFilled opacity={0.45} size={70} />
                        <div className='absolute inset-0 flex flex-col items-center justify-center'>
                        {Array.from({ length: 7 }).map((_, index) => (
                            <div
                            key={index}
                            className='h-1 w-full bg-white my-0.5'
                            style={{
                                opacity: 0.6,
                            }}
                            ></div>
                        ))}
                        </div>
                    </div>
                    ) : (
                    <TbRectangleVertical size={70} />
                    )
                    : null
            }
        </div>
    )
}

export default Symbol