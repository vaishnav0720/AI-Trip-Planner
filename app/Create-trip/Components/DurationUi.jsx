import React from 'react'

export const DurationOptions = [
  { id: 1, title: '1 Days', days: 1 },
  { id: 2, title: '3 Days', days: 3 },
  { id: 3, title: '5 Days', days: 5},
  { id: 4, title: '7 Days', days: 7 },
]

function DurationUi({ onSelect }) {
  const handleClick = (item) => {
    if (onSelect) onSelect(item)
  }

  return (
    <div className='grid grid-cols-2 gap-4 mt-5'>
      {DurationOptions.map((item) => (
        <div
          key={item.id}
          onClick={() => handleClick(item)}
          className='p-4 border rounded-lg hover:shadow-lg hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition-all'
        >
          <div className='text-xl mb-2'>🗓️</div>
          <h3 className='font-bold text-lg'>{item.title}</h3>
        </div>
      ))}
    </div>
  )
}

export default DurationUi

