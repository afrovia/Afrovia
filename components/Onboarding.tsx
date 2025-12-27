import React, { useState } from 'react';
import { User } from '../types';
import { supabase } from '../supabaseClient';
import { Button } from './Button';
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Target, 
  HeartHandshake, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  MessageCircle, 
  Shield, 
  Crown 
} from 'lucide-react';

interface OnboardingProps {
  user: User;
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalSteps = 7;

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('users_profile')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
      
      if (error) throw error;
      
      onComplete(); // Update local state in Dashboard
    } catch (err: any) {
      console.error("Error saving onboarding status:", err.message || err);
      // Even if API fails, we close it locally for UX
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  // Content Components for each step
  const renderContent = () => {
    switch(step) {
      case 1: // Welcome
        return (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-tiffany-dim rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Sparkles size={40} className="text-tiffany-green" />
              <div className="absolute inset-0 bg-tiffany-green/20 rounded-full animate-ping opacity-20"></div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Bem-vindo à <span className="text-tiffany-green">Afrovia</span></h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto mb-8">
              Aqui você não apenas vende ingressos. Você constrói relacionamento, cria uma base sólida de clientes e conquista crescimento real no mercado de festas.
            </p>
          </div>
        );

      case 2: // How It Works
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Como Funciona</h3>
            <div className="space-y-4">
              <div className="bg-dark-800 p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0"><Shield size={20} /></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Profissionalismo</h4>
                  <p className="text-xs text-gray-400">A Afrovia desenvolve Rps profissionais, não amadores.</p>
                </div>
              </div>
              <div className="bg-dark-800 p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-tiffany-dim flex items-center justify-center text-tiffany-green shrink-0"><HeartHandshake size={20} /></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Relacionamento</h4>
                  <p className="text-xs text-gray-400">O foco é criar laços reais com o cliente, não apenas dar VIPs.</p>
                </div>
              </div>
              <div className="bg-dark-800 p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0"><TrendingUp size={20} /></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Consistência</h4>
                  <p className="text-xs text-gray-400">Seu crescimento vem da constância nas vendas e entregas.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Role
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Seu Papel como RP</h3>
            <p className="text-gray-400 text-sm mb-8">Você é o rosto do evento para o seu cliente.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4 rounded-xl border-t-2 border-t-tiffany-green">
                <Crown size={24} className="text-white mx-auto mb-3" />
                <h4 className="text-sm font-bold text-tiffany-green mb-2">Representar</h4>
                <p className="text-[10px] text-gray-400">Você é embaixador de marcas e eventos.</p>
              </div>
              <div className="glass-card p-4 rounded-xl border-t-2 border-t-tiffany-blue">
                <Users size={24} className="text-white mx-auto mb-3" />
                <h4 className="text-sm font-bold text-tiffany-blue mb-2">Cuidar</h4>
                <p className="text-[10px] text-gray-400">Acompanhar o cliente da compra até o pós-festa.</p>
              </div>
              <div className="glass-card p-4 rounded-xl border-t-2 border-t-white">
                <Target size={24} className="text-white mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-2">Construir</h4>
                <p className="text-[10px] text-gray-400">Criar sua própria carteira ativa e recorrente.</p>
              </div>
            </div>
          </div>
        );

      case 4: // Checklist
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Primeiros Passos</h3>
            <div className="bg-dark-800 rounded-2xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-3 opacity-50">
                <CheckCircle2 className="text-tiffany-green" size={20} />
                <span className="text-gray-300 text-sm line-through">Criar conta na plataforma</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                <span className="text-white text-sm font-medium">Completar seu perfil com foto</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                <span className="text-white text-sm font-medium">Cadastrar seus 5 primeiros clientes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                <span className="text-white text-sm font-medium">Verificar eventos ativos no Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                <span className="text-white text-sm font-medium">Realizar a primeira venda</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4 italic">Você poderá fazer tudo isso assim que acabar este guia.</p>
          </div>
        );

      case 5: // Approach
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <h3 className="text-2xl font-bold text-white mb-6 text-center">Dicas de Abordagem</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                  <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2 text-sm"><CheckCircle2 size={14}/> O que fazer</h4>
                  <ul className="text-xs text-gray-300 space-y-2 list-disc pl-4">
                    <li>Seja claro e objetivo.</li>
                    <li>Foque no relacionamento.</li>
                    <li>Aborde com respeito e educação.</li>
                  </ul>
                </div>
                <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2 text-sm"><MessageCircle size={14}/> Evite</h4>
                  <ul className="text-xs text-gray-300 space-y-2 list-disc pl-4">
                    <li>Não force a venda.</li>
                    <li>Não prometa o que não pode cumprir.</li>
                    <li>Não seja invasivo no WhatsApp.</li>
                  </ul>
                </div>
             </div>
          </div>
        );

      case 6: // Lifecycle
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Ciclo da Venda</h3>
            <div className="relative border-l-2 border-dark-700 ml-4 space-y-8">
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-dark-900 border-2 border-tiffany-green rounded-full"></div>
                <h4 className="text-tiffany-green font-bold text-sm uppercase">Pré-Festa</h4>
                <p className="text-xs text-gray-400 mt-1">Envie o convite, tire dúvidas e confirme a presença do cliente.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-dark-900 border-2 border-white rounded-full"></div>
                <h4 className="text-white font-bold text-sm uppercase">Durante o Evento</h4>
                <p className="text-xs text-gray-400 mt-1">Garanta que o check-in foi tranquilo. Se estiver lá, cumprimente.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-dark-900 border-2 border-tiffany-blue rounded-full"></div>
                <h4 className="text-tiffany-blue font-bold text-sm uppercase">Pós-Festa</h4>
                <p className="text-xs text-gray-400 mt-1">Peça feedback no dia seguinte. É aqui que a fidelização acontece.</p>
              </div>
            </div>
          </div>
        );

      case 7: // Evolution
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Sua Evolução</h3>
            <p className="text-gray-400 text-sm mb-8">Cresça de nível baseando-se em consistência e resultado.</p>
            
            <div className="flex justify-between items-end h-32 px-4 mb-4 relative">
               <div className="w-full absolute bottom-4 left-0 h-1 bg-dark-700 rounded-full z-0"></div>
               
               <div className="relative z-10 flex flex-col items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-dark-800 border-2 border-gray-600 flex items-center justify-center text-gray-400 text-xs font-bold">1</div>
                 <span className="text-[10px] uppercase font-bold text-gray-500">Iniciante</span>
               </div>
               
               <div className="relative z-10 flex flex-col items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-dark-800 border-2 border-tiffany-green flex items-center justify-center text-tiffany-green text-xs font-bold">2</div>
                 <span className="text-[10px] uppercase font-bold text-tiffany-green">Intermed.</span>
               </div>

               <div className="relative z-10 flex flex-col items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-dark-800 border-2 border-tiffany-blue flex items-center justify-center text-tiffany-blue text-xs font-bold">3</div>
                 <span className="text-[10px] uppercase font-bold text-tiffany-blue">Avançado</span>
               </div>

               <div className="relative z-10 flex flex-col items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-dark-800 border-2 border-yellow-500 flex items-center justify-center text-yellow-500 text-xs font-bold">4</div>
                 <span className="text-[10px] uppercase font-bold text-yellow-500">Líder</span>
               </div>
            </div>
            
            <p className="text-xs text-gray-500 italic">O céu é o limite para quem trabalha sério.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-dark-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col relative overflow-hidden h-[600px] md:h-auto md:min-h-[500px]">
        
        {/* Progress Bar */}
        <div className="h-1 bg-dark-800 w-full">
          <div 
            className="h-full bg-gradient-to-r from-tiffany-blue to-tiffany-green transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Header Steps */}
        <div className="p-6 pb-0 flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
          <span>Onboarding</span>
          <span>{step} / {totalSteps}</span>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
          {renderContent()}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-white/5 flex justify-between items-center bg-dark-800/50">
          {step > 1 ? (
             <button 
               onClick={handlePrev}
               className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-wider px-4 py-2"
             >
               Voltar
             </button>
          ) : (
            <div></div> // Spacer
          )}

          {step < totalSteps ? (
            <Button onClick={handleNext} className="flex items-center gap-2 px-6">
              Próximo <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={loading} className="flex items-center gap-2 px-8 shadow-tiffany-green/20">
              {loading ? 'Finalizando...' : 'Começar minha jornada'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};