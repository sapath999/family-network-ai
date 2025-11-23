import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Agents from './pages/Agents';

// Register global plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [currentView, setCurrentView] = useState('home');

  // Loop Order
  const viewOrder = ['home', 'about', 'agents'];

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const getNextPage = () => {
    const currentIndex = viewOrder.indexOf(currentView);
    const nextIndex = (currentIndex + 1) % viewOrder.length;
    return viewOrder[nextIndex];
  };

  const getNextLabel = () => {
    const next = getNextPage();
    switch(next) {
      case 'home': return 'Back to Home';
      case 'about': return 'Meet the Family';
      case 'agents': return 'Start Talking';
      default: return 'Next';
    }
  };

  const renderView = () => {
    const nextLabel = getNextLabel();
    const nextPage = getNextPage();

    switch (currentView) {
      case 'home':
        return <Home onNavigate={handleNavigate} nextLabel={nextLabel} nextPage={nextPage} />;
      case 'about':
        return <About onNavigate={handleNavigate} nextLabel={nextLabel} nextPage={nextPage} />;
      case 'agents':
        return <Agents onNavigate={handleNavigate} nextLabel={nextLabel} nextPage={nextPage} />;
      default:
        return <Home onNavigate={handleNavigate} nextLabel={nextLabel} nextPage={nextPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Global Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-50" />
      </div>

      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <main className="relative z-10 transition-all duration-500 ease-in-out pb-10">
        {renderView()}
      </main>

    </div>
  );
}

export default App;