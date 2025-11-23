import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Shield, Heart, Swords, Feather, Dumbbell, PartyPopper, Flame, Sparkles, Phone } from 'lucide-react';
import { Agent } from '../types';

gsap.registerPlugin(useGSAP);

interface AgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
  index: number;
}

const IconMap: any = {
  Shield, Heart, Swords, Feather, Dumbbell, PartyPopper, Flame, Sparkles
};

const AgentCard: React.FC<AgentCardProps> = ({ agent, onSelect, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = IconMap[agent.icon] || Shield;

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      delay: index * 0.1,
      ease: 'power3.out',
    });
  }, { scope: cardRef });

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { y: -10, scale: 1.02, duration: 0.3, ease: 'power2.out', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out', boxShadow: 'none' });
  };

  return (
    <div
      ref={cardRef}
      className={`relative group p-6 rounded-2xl bg-[#1e293b] border border-gray-700 hover:border-${agent.color.split('-')[1]}-400 transition-colors cursor-pointer overflow-hidden`}
      onClick={() => onSelect(agent)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Gradient Splash */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${agent.color}`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className={`w-14 h-14 rounded-xl ${agent.color} flex items-center justify-center mb-4 shadow-lg text-white`}>
          <Icon size={28} />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-1">{agent.role}</h3>
        <p className="text-sm text-gray-400 font-medium mb-3">{agent.name}</p>
        
        <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
          {agent.description}
        </p>

        <button className="w-full mt-auto py-3 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium flex items-center justify-center gap-2 transition-colors border border-gray-700 group-hover:border-gray-500">
          <Phone size={18} />
          <span>Call Now</span>
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
