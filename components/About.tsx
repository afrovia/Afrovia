import React from 'react';
import { Section } from './Section';

export const About: React.FC = () => {
  return (
    <Section className="border-t border-white/5 bg-dark-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-tiffany-blue to-tiffany-green opacity-20 blur-xl rounded-2xl"></div>
          <div className="relative rounded-2xl overflow-hidden glass-card p-1">
            <img 
              src="https://picsum.photos/seed/event crowd/800/800" 
              alt="About Afrovia" 
              className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-sm font-bold tracking-[0.2em] text-tiffany-green uppercase mb-4">Sobre a Afrovia</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            Mais que vendas, <br/>
            construímos <span className="text-tiffany-green">carreiras</span>.
          </h3>
          <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
            <p>
              A Afrovia é uma agência focada no desenvolvimento profissional de Rps.
            </p>
            <p>
              Aqui, o objetivo não é apenas vender ingressos, mas construir relacionamento, criar uma base fiel de clientes e crescer de forma estruturada no mercado de festas.
            </p>
            <p className="border-l-2 border-tiffany-blue pl-6 italic text-gray-400">
              "Transformamos contatos em relacionamentos duradouros e oportunidades em resultados consistentes."
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};