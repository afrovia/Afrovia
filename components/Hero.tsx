import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  onRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegister }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/nightlife/1920/1080" 
          alt="Event Atmosphere" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900/90 to-dark-900"></div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tiffany-blue opacity-10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tiffany-green opacity-10 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-tiffany-green/20">
          <span className="w-2 h-2 rounded-full bg-tiffany-green animate-pulse"></span>
          <span className="text-xs font-semibold tracking-widest uppercase text-tiffany-green">Exclusivo para Rps</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
          Construa sua base de <br/>
          <span className="gradient-text">clientes sólida</span> no mercado<br/>
          de festas
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed">
          Gestão e desenvolvimento de Rps no mercado de eventos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button onClick={onRegister}>
            Quero crescer como Rp
            <ArrowRight className="inline-block ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};