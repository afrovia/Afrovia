import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  onRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegister }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/nightlife/1920/1080" 
          alt="Event Atmosphere" 
          className="w-full h-full object-cover opacity-30 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900/80 to-dark-900"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 via-transparent to-dark-900/90"></div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tiffany-blue opacity-20 blur-[150px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tiffany-green opacity-20 blur-[150px] rounded-full"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center pt-20">
        <div className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card border-tiffany-green/20 hover:border-tiffany-green/40 transition-colors cursor-default">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tiffany-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-tiffany-green"></span>
          </span>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-tiffany-green shadow-glow">Exclusivo para Rps</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 drop-shadow-2xl">
          Construa sua base de <br/>
          <span className="gradient-text relative inline-block">
            clientes sólida
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-tiffany-green opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
               <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span> no mercado<br/>
          de festas
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed">
          Gestão completa, ferramentas de venda e desenvolvimento de carreira para Rps que desejam sair do amadorismo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 justify-center">
          <Button onClick={onRegister} className="shadow-[0_0_30px_rgba(129,216,208,0.25)] hover:shadow-[0_0_40px_rgba(129,216,208,0.4)]">
            Quero crescer como Rp
            <ArrowRight className="inline-block ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 animate-bounce cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
        <ChevronDown size={24} />
      </div>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};