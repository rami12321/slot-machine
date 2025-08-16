import React from 'react';
import SlotMachine from './components/SlotMachine';
import './App.css';

function App() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 flex items-center justify-center p-4 overflow-hidden">
      { }
      <div className="absolute inset-0 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-r from-blue-500/5 via-pink-500/5 to-amber-400/10"></div>

      { }
      <div className="relative z-10">
        <SlotMachine />
      </div>
    </div>
  );
}

export default App;
