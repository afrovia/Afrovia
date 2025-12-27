import React from 'react';
import { Button } from './Button';

interface FooterCTAProps {
  onApply: () => void;
}

export const FooterCTA: React.FC<FooterCTAProps> = ({ onApply }) => {
  return (
    <div className="relative py-32 px-6 text-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/vip/1920/1080" 
          alt="Lifestyle" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-dark-900"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
          Pronto para crescer de verdade no mercado de festas?
        </h2>
        <div className="flex justify-center">
          <Button onClick={onApply} className="text-lg px-12 py-5 shadow-2xl shadow-tiffany-green/20">
            Aplicar para Afrovia
          </Button>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 p-8 border-t border-white/5 text-center text-gray-600 text-sm z-10">
        <p>&copy; {new Date().getFullYear()} Afrovia. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};