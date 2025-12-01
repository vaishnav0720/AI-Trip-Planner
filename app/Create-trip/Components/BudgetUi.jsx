import React from 'react'
import { SelectBudgetOptions } from './GroupSizeUi'

function BudgetUi({ onSelect }) {
  const handleClick = (item) => {
    if (onSelect) onSelect(item)
  }

  return (
    <div className='grid grid-cols-1 gap-3'>
      {SelectBudgetOptions.map((option, idx) => (
        <div
          key={idx}
          onClick={() => handleClick(option)}
          className='p-3 border rounded-lg hover:shadow-md cursor-pointer transition-all hover:border-orange-500 hover:bg-orange-50'
        >
          <div className='flex items-center gap-3'>
            <div className='text-2xl'>{option.icon}</div>
            <div>
              <h4 className='font-bold'>{option.title}</h4>
              <p className='text-xs text-gray-500'>{option.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BudgetUi
