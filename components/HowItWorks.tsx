import React from 'react';
import { Section } from './Section';

const steps = [
  {
    number: "01",
    title: "Você entra para a Afrovia",
    desc: "Acesso imediato à nossa comunidade e ferramentas."
  },
  {
    number: "02",
    title: "Aprende abordagem e relacionamento",
    desc: "Técnicas validadas de comunicação persuasiva."
  },
  {
    number: "03",
    title: "Constrói sua base de clientes",
    desc: "Ferramentas para gerir e fidelizar seu público."
  },
  {
    number: "04",
    title: "Aumenta vendas e comissões",
    desc: "Resultados financeiros crescentes e recorrentes."
  },
  {
    number: "05",
    title: "Evolui dentro do mercado",
    desc: "Oportunidades de coordenação e novos negócios."
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <Section id="how-it-works" className="bg-dark-800 relative overflow-hidden">
       {/* Background line decoration */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-tiffany-green/20 to-transparent hidden lg:block"></div>

      <div className="text-center mb-20 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Como <span className="text-tiffany-blue">Funciona</span></h2>
        <p className="text-gray-400">O caminho claro para o seu sucesso.</p>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center gap-6 md:gap-12 group">
            <div className="w-16 h-16 rounded-full bg-dark-900 border border-tiffany-green/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(129,216,208,0.1)] group-hover:border-tiffany-green transition-colors">
              <span className="text-2xl font-bold text-tiffany-green font-mono">{step.number}</span>
            </div>
            <div className="flex-1 text-center md:text-left glass-card p-6 rounded-xl w-full md:w-auto hover:bg-white/5 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};