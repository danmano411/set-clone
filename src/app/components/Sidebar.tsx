import React from 'react'

interface SidebarProps {
  cardsInDeck: number
  completedSets: number
  amountShuffled: number
  reShuffleTable: () => void
}

const Sidebar:React.FC<SidebarProps> = ({
  cardsInDeck,
  completedSets,
  amountShuffled,
  reShuffleTable
}) => {
  return (
    <div className='flex flex-col w-1/5 h-screen bg-gray-800 text-white justify-center'>
      <div className='flex flex-col w-full h-1/2 items-center p-4 gap-2'>
        <h1 className='text-2xl font-bold mb-4'>Sidebar</h1>

        <h2 className='text-xl font-bold'>Cards Remaining: {cardsInDeck}</h2>
        <h2 className='text-xl font-bold'>Completed Sets: {completedSets}</h2>
        <h2 className='text-xl font-bold'>Amount Shuffled: {amountShuffled}</h2>
        <button onClick={() => reShuffleTable()} className='w-1/2 h-10 p-2 bg-green-400 rounded-lg flex flex-col items-center justify-center text-black border-2 border-white cursor-pointer'>Shuffle Table</button>
      </div>
    </div>
  )
}

export default Sidebar