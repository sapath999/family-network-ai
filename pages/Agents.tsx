import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AGENTS } from '../constants';
import { Agent, ConnectionState } from '../types';
import AgentCard from '../components/AgentCard';
import Visualizer from '../components/Visualizer';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { X, Mic, MicOff, AlertCircle } from 'lucide-react';
import NextSection from '../components/NextSection';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface AgentsProps {
  onNavigate: (view: string) => void;
  nextLabel: string;
  nextPage: string;
}

const Agents: React.FC<AgentsProps> = ({ onNavigate, nextLabel, nextPage }) => {
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const { connect, disconnect, connectionState, volume, error } = useGeminiLive(activeAgent);
  const [isMicMuted, setIsMicMuted] = useState(false);

  // Handle Agent Selection
  const handleSelectAgent = (agent: Agent) => {
    setActiveAgent(agent);
  };

  // Handle Close Session
  const handleClose = () => {
    disconnect();
    if (modalRef.current) {
        gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        onComplete: () => setActiveAgent(null)
        });
    } else {
        setActiveAgent(null);
    }
  };

  // Auto-connect when modal opens
  useEffect(() => {
    if (activeAgent) {
      connect();
      if (modalRef.current) {
        gsap.fromTo(modalRef.current, 
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
      }
    }
  }, [activeAgent, connect]);

  // Animations
  useGSAP(() => {
    // Header
    gsap.from("#header-text", { 
        y: -30, 
        opacity: 0, 
        duration: 0.8, 
        ease: 'power3.out' 
    });

    // Cards with scroll trigger
    const cards = gsap.utils.toArray<HTMLElement>(".agent-card-wrapper");
    gsap.from(cards, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: ".grid-container",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen pt-32 pb-12 px-4 max-w-7xl mx-auto flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <header className="text-center mb-12">
          <h1 id="header-text" className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Choose Your Companion
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Select a family member to start a real-time voice conversation. They are ready to listen.
          </p>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 grid-container">
          {AGENTS.map((agent, index) => (
            <div key={agent.id} className="agent-card-wrapper">
              <AgentCard 
                  agent={agent} 
                  onSelect={handleSelectAgent} 
                  index={index} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Active Call Modal Overlay */}
      {activeAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div 
            ref={modalRef}
            className="w-full max-w-2xl bg-[#1e293b] border border-gray-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
          >
            {/* Modal Header */}
            <div className={`p-6 ${activeAgent.color} bg-opacity-10 border-b border-gray-700 flex justify-between items-center`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${activeAgent.color} flex items-center justify-center text-white shadow-lg`}>
                   <span className="font-bold text-lg">{activeAgent.role[0]}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{activeAgent.role}</h2>
                  <p className="text-indigo-200">{activeAgent.name} • {connectionState}</p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body / Visualizer */}
            <div className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-b from-[#1e293b] to-[#0f172a]">
              
              {error ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
                    <AlertCircle size={32} />
                  </div>
                  <p className="text-red-300 font-medium">{error}</p>
                  <button 
                    onClick={() => connect()}
                    className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold transition-colors"
                  >
                    Retry Connection
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative mb-8">
                     <Visualizer 
                        isPlaying={connectionState === ConnectionState.CONNECTED}
                        volume={volume}
                        color={activeAgent.color}
                     />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-gray-400 text-sm tracking-widest uppercase font-semibold">
                      {connectionState === ConnectionState.CONNECTING ? 'Establishing Secure Link...' : 'Live Voice Channel Active'}
                    </p>
                    <p className="text-white font-medium text-lg animate-pulse">
                      {connectionState === ConnectionState.CONNECTED ? "Listening..." : "..."}
                    </p>
                  </div>
                </>
              )}

            </div>

            {/* Modal Footer / Controls */}
            <div className="p-6 bg-[#0f172a] border-t border-gray-800 flex justify-center gap-6">
               <button 
                 onClick={() => setIsMicMuted(!isMicMuted)}
                 className={`p-4 rounded-full transition-all duration-300 ${isMicMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                 title={isMicMuted ? "Unmute" : "Mute"}
               >
                 {isMicMuted ? <MicOff size={24} /> : <Mic size={24} />}
               </button>

               <button 
                 onClick={handleClose}
                 className="px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold tracking-wide shadow-lg shadow-red-900/20 transition-all hover:scale-105"
               >
                 End Call
               </button>
            </div>
          </div>
        </div>
      )}

      <NextSection label={nextLabel} onNavigate={() => onNavigate(nextPage)} />
    </div>
  );
};

export default Agents;