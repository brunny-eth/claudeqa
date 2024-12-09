import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import FormatSelector from './components/FormatSelector'; 

const GolfApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedFormat, setSelectedFormat] = useState(null);

  const HomeScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-800 mb-12">Phi Ryder Cup 2024</h1>
      <div className="grid gap-6 w-full max-w-md px-4">
        <button
          onClick={() => setCurrentScreen('format-select')} 
          className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <span className="text-xl">📖</span>
          <span className="text-lg">Rules Assistant</span>
        </button>
        <button
          onClick={() => setCurrentScreen('tournament')}
          className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <span className="text-xl">🏆</span>
          <span className="text-lg">Tournament Standings</span>
        </button>
      </div>
    </div>
  );

  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
    setCurrentScreen('rules');
  };

  return (
    <div className="h-screen bg-gray-50">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'format-select' && (
        <FormatSelector onSelect={handleFormatSelect} />
      )}
      {currentScreen === 'rules' && (
        <ChatInterface format={selectedFormat} />
      )}
      {currentScreen === 'tournament' && (
        <div className="p-4">Tournament standings component coming soon...</div>
      )}
      
      {currentScreen !== 'home' && (
        <button
          onClick={() => setCurrentScreen('home')}
          className="fixed top-4 left-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
        >
          ←
        </button>
      )}
    </div>
  );
};

export default GolfApp;