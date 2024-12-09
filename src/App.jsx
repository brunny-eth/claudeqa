import React from 'react';
import { useState } from 'react';
import { BookOpen, Trophy, Home } from 'lucide-react';

const GolfApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');

  const HomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-green-50">
      <h1 className="text-3xl font-bold text-green-800 mb-8">Phi Ryder Cup 2024</h1>
      <div className="grid gap-4 w-full max-w-md px-4">
        <button
          onClick={() => setCurrentScreen('rules')}
          className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <BookOpen className="text-green-600" />
          <span className="text-lg">Rules Assistant</span>
        </button>
        <button
          onClick={() => setCurrentScreen('tournament')}
          className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <Trophy className="text-green-600" />
          <span className="text-lg">Tournament Standings</span>
        </button>
      </div>
    </div>
  );

  const Navigation = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="flex justify-around p-4">
        <button
          onClick={() => setCurrentScreen('home')}
          className={`flex flex-col items-center ${
            currentScreen === 'home' ? 'text-green-600' : 'text-gray-600'
          }`}
        >
          <Home size={24} />
          <span className="text-sm">Home</span>
        </button>
        <button
          onClick={() => setCurrentScreen('rules')}
          className={`flex flex-col items-center ${
            currentScreen === 'rules' ? 'text-green-600' : 'text-gray-600'
          }`}
        >
          <BookOpen size={24} />
          <span className="text-sm">Rules</span>
        </button>
        <button
          onClick={() => setCurrentScreen('tournament')}
          className={`flex flex-col items-center ${
            currentScreen === 'tournament' ? 'text-green-600' : 'text-gray-600'
          }`}
        >
          <Trophy size={24} />
          <span className="text-sm">Tournament</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="h-screen bg-gray-50">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'rules' && <div className="pb-16"><ChatInterface /></div>}
      {currentScreen === 'tournament' && (
        <div className="pb-16">Your tournament standings component</div>
      )}
      {currentScreen !== 'home' && <Navigation />}
    </div>
  );
};

export default GolfApp;