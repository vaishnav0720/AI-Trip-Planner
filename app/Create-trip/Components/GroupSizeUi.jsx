import React from 'react'
export const SelectTravelersList = [
    {
        id: 1,
        title: "Just Me",
        icon: "✈️",
        people: "1"
    },
    {
        id: 2,
        title: "A Couple",
        icon: "👫",
        people: "2 People"
    },
    {
        id: 3,
        title: "Family",
        icon: "🏡",
        people: "3 to 5 People"
    },
    {
        id: 4,
        title: "Friends",
        icon: "👯 👬",
        people: "5 to 10 People"
    }
];

export const SelectBudgetOptions = [
    {
        id: 1,
        title: "Cheap",
        desc: "Stay conscious of costs",
        icon: "💸"
    },
    {
        id: 2,
        title: "Moderate",
        desc: "Keep cost on the average side",
        icon: "💰"
    },
    {
        id: 3,
        title: "Luxury",
        desc: "Don’t worry about cost",
        icon: "💎"
    }
];





function GroupSizeUi({ onSelect }) {
    const handleClick = (item) => {
        if (onSelect) {
            onSelect(item);
        }
    };

    return (
        <div className='grid grid-cols-2 gap-4 mt-5'>
            {SelectTravelersList.map((item, index) => (
                <div
                    key={index}
                    onClick={() => handleClick(item)}
                    className='p-4 border rounded-lg hover:shadow-lg hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition-all'
                >
                    <div className='text-3xl mb-2'>{item.icon}</div>
                    <h3 className='font-bold text-lg'>{item.title}</h3>
                    <p className='text-sm text-gray-500'>{item.people}</p>
                </div>
            ))}
        </div>
    )
}

export default GroupSizeUi
