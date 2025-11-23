import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AGENTS } from '../constants';
import { Shield, Heart, Swords, Feather, Dumbbell, PartyPopper, Flame, Sparkles } from 'lucide-react';
import NextSection from '../components/NextSection';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const IconMap: any = {
  Shield, Heart, Swords, Feather, Dumbbell, PartyPopper, Flame, Sparkles
};

interface AboutProps {
  onNavigate: (view: string) => void;
  nextLabel: string;
  nextPage: string;
}

const About: React.FC<AboutProps> = ({ onNavigate, nextLabel, nextPage }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header Animation
    gsap.from(".about-header", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });

    // Staggered list items
    const rows = gsap.utils.toArray<HTMLElement>(".agent-row");
    rows.forEach((row, i) => {
      gsap.from(row, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: row,
          start: "top 85%", // Animation starts when top of row hits 85% of viewport height
          toggleActions: "play none none reverse"
        }
      });
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      <div>
        <div className="text-center mb-20 about-header">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Who Are They?</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Each member of the Family Network is designed with a specific personality and purpose to fulfill every emotional need you might have.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 grid-container">
          {AGENTS.map((agent, i) => {
            const Icon = IconMap[agent.icon];
            return (
              <div key={agent.id} className="agent-row flex items-start gap-6 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                <div className={`shrink-0 w-16 h-16 rounded-xl ${agent.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white">{agent.role}</h3>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {agent.name}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {agent.description}
                  </p>
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                    <p className="text-sm text-slate-400 italic">
                      <span className="font-semibold text-slate-500 not-italic mr-2">Vibe:</span>
                      "{agent.systemInstruction.split('.')[0] + '.'}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NextSection label={nextLabel} onNavigate={() => onNavigate(nextPage)} />
    </div>
  );
};

export default About;