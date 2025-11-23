import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import NextSection from '../components/NextSection';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HomeProps {
  onNavigate: (view: string) => void;
  nextLabel: string;
  nextPage: string;
}

const Home: React.FC<HomeProps> = ({ onNavigate, nextLabel, nextPage }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".hero-title span", {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power4.out"
    })
    .from(".hero-sub", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5")
    .from(".hero-btn", {
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3");

    // Ambient floating animation for background elements
    gsap.to(".float-shape", {
      y: "20px",
      rotation: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 1
    });

    // Parallax effect on scroll
    gsap.to(".hero-content", {
      yPercent: 50,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-[120vh] relative overflow-hidden">
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 relative">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] float-shape" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] float-shape" />

        <div className="hero-content relative z-10 text-center max-w-4xl px-6">
          <h1 className="hero-title text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Welcome</span> <br />
            <span className="inline-block text-white">to the Family.</span>
          </h1>
          
          <p className="hero-sub text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            A place where you're never alone. Connect with 8 unique AI personalities designed to care, support, challenge, and entertain you.
          </p>

          <button 
            onClick={() => onNavigate('agents')}
            className="hero-btn group relative px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg tracking-wide hover:bg-slate-200 transition-colors flex items-center gap-3 mx-auto"
          >
            <span>Meet Your Family</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            <div className="absolute -inset-1 rounded-full bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Decorative Bottom Text */}
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <p className="text-slate-600 text-sm uppercase tracking-[0.2em]">Powered by Gemini Live</p>
        </div>
      </div>

      <NextSection label={nextLabel} onNavigate={() => onNavigate(nextPage)} />
    </div>
  );
};

export default Home;