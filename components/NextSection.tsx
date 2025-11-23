import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface NextSectionProps {
  label: string;
  onNavigate: () => void;
}

const NextSection: React.FC<NextSectionProps> = ({ label, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Arrow bounce animation
    gsap.to(arrowRef.current, {
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // Reveal animation when scrolling into view
    gsap.from(containerRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 95%",
        toggleActions: "play none none reverse"
      }
    });
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      onClick={onNavigate}
      className="w-full py-20 flex flex-col items-center justify-center cursor-pointer group mt-20"
    >
      <div className="text-slate-500 text-sm font-semibold tracking-widest uppercase mb-4 group-hover:text-blue-400 transition-colors">
        Up Next
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 group-hover:scale-105 transition-transform duration-500">
        {label}
      </h2>
      <div 
        ref={arrowRef}
        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors"
      >
        <ArrowDown size={24} />
      </div>
    </div>
  );
};

export default NextSection;