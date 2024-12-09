import React from 'react';

const FormatSelector = ({ onSelect }) => {
  const formats = [
    {
      id: 'friday-fourball',
      name: 'Friday Four-Ball',
      icon: '🏌️',
      description: 'Two-person teams, each player plays their own ball'
    },
    {
      id: 'saturday-fourball',
      name: 'Saturday Four-Ball',
      icon: '🏌️',
      description: 'Two-person teams, each player plays their own ball'
    },
    {
      id: 'saturday-alternate',
      name: 'Saturday Alternate Shot',
      icon: '🔄',
      description: 'Two-person teams, partners alternate shots'
    },
    {
      id: 'sunday-singles',
      name: 'Sunday Singles',
      icon: '🏆',
      description: 'Individual match play. For all the marbles.'
    }
  ];

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Select Playing Format
        </h2>
        <div className="grid gap-4">
          {formats.map((format) => (
            <div 
              key={format.id}
              onClick={() => onSelect(format.id)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-4 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{format.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{format.name}</h3>
                  <p className="text-gray-600">{format.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormatSelector;