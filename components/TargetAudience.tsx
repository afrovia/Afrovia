import React from 'react';
import { CheckCircle2, User, TrendingUp, Users, Crown } from 'lucide-react';
import { Section } from './Section';

const audiences = [
  {
    icon: <User className="w-6 h-6" />,
    text: "Pessoas que querem iniciar como Rp"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    text: "Rps que desejam vender com mais facilidade"
  },
  {
    icon: <Users className="w-6 h-6" />,
    text: "Quem quer criar uma carteira fixa de clientes"
  },
  {
    icon: <Crown className="w-6 h-6" />,
    text: "Quem busca evolução até coordenar equipes ou criar eventos"
  }
];

export const TargetAudience: React.FC = () => {
  return (
    <Section className="bg-dark-900">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Para quem é a <span className="text-tiffany-green">Afrovia?</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Nosso ecossistema foi desenhado para diferentes estágios de maturidade profissional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {audiences.map((item, index) => (
          <div 
            key={index}
            className="group glass-card p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-tiffany-green/30"
          >
            <div className="w-12 h-12 rounded-full bg-tiffany-dim flex items-center justify-center text-tiffany-green mb-6 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-tiffany-green shrink-0 mt-1" />
              <p className="text-lg font-medium text-gray-200">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};