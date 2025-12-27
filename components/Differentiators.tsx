import React from 'react';
import { Star, Zap, HeartHandshake, Rocket } from 'lucide-react';
import { Section } from './Section';

const differentials = [
  {
    icon: <Rocket />,
    title: "Desenvolvimento real de Rps",
    desc: "Não te damos apenas uma lista de ingressos. Te damos uma carreira."
  },
  {
    icon: <Zap />,
    title: "Estratégia de pré e pós-festa",
    desc: "Aprenda a criar desejo antes do evento e fidelidade depois dele."
  },
  {
    icon: <HeartHandshake />,
    title: "Relacionamento com clientes",
    desc: "Metodologia exclusiva para lidar com o público de alto padrão."
  },
  {
    icon: <Star />,
    title: "Crescimento profissional contínuo",
    desc: "Plano de carreira claro dentro da agência e do mercado."
  }
];

export const Differentiators: React.FC = () => {
  return (
    <Section className="bg-dark-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Por que a <br/>
            <span className="text-tiffany-green">Afrovia</span> é diferente?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Enquanto o mercado foca em quantidade, nós focamos em qualidade e longevidade. Entregamos a estrutura que falta para você deixar de ser um vendedor de ingressos e se tornar uma autoridade em entretenimento.
          </p>
          <div className="hidden lg:block h-1 w-24 bg-tiffany-blue rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {differentials.map((item, index) => (
            <div key={index} className="glass-card p-6 rounded-xl hover:-translate-y-2 transition-transform duration-300 border-t border-white/10">
              <div className="text-tiffany-green mb-4 w-10 h-10">
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 32 })}
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};