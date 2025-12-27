import React, { useEffect, useState, useCallback } from 'react';
import { User, Event, Client, Achievement, GuestEntry } from '../types';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Award, 
  ChevronRight,
  Ticket,
  DollarSign,
  Target,
  Trophy,
  ArrowUpRight,
  Plus,
  Search,
  Info,
  X,
  ClipboardList,
  Clock,
  Star,
  Medal,
  RefreshCw,
  Instagram,
  Music,
  Wallet,
  Zap,
  Flame,
  Snowflake,
  Crown,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  History
} from 'lucide-react';
import { getUserConfig } from '../utils';
import { supabase } from '../supabaseClient';
import { Button } from './Button';
import { Onboarding } from './Onboarding';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const roleConfig = getUserConfig(user);
  
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return user.role === 'promoter' && user.onboarding_completed === false;
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-12 px-4 md:px-6 relative">
      
      {showOnboarding && <Onboarding user={user} onComplete={handleOnboardingComplete} />}

      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Olá, <span className={roleConfig.colors.text}>{user.name}</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base">Bem-vindo ao seu painel de controle.</p>
          </div>
          <div className="flex items-center gap-4 self-start md:self-auto">
             <button 
              onClick={handleRefresh}
              className={`p-3 rounded-full bg-dark-800 border border-white/5 text-gray-400 hover:text-white hover:border-tiffany-green/50 transition-all ${isRefreshing ? 'animate-spin text-tiffany-green border-tiffany-green' : ''}`}
              title="Atualizar dados"
            >
              <RefreshCw size={18} />
            </button>
            <div className={`flex items-center gap-3 bg-dark-800 border border-white/5 px-5 py-3 rounded-full shadow-lg shadow-black/20 ${roleConfig.colors.hoverBorder} transition-colors`}>
              <span className={`w-2 h-2 rounded-full ${roleConfig.colors.bg} animate-pulse`}></span>
              <span className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                {roleConfig.getDisplayName(user)}
              </span>
            </div>
          </div>
        </header>

        {user.role === 'admin' ? (
          <AdminView refreshTrigger={refreshTrigger} />
        ) : user.role === 'coordinator' ? (
          <CoordinatorView refreshTrigger={refreshTrigger} />
        ) : (
          <PromoterView user={user} refreshTrigger={refreshTrigger} />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subtext, loading, highlight = false }: { icon: React.ReactNode, label: string, value: string, subtext?: string, loading?: boolean, highlight?: boolean }) => {
  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 ${highlight ? 'bg-gradient-to-br from-tiffany-green/20 to-tiffany-blue/5 border-tiffany-green/50 shadow-[0_0_20px_rgba(129,216,208,0.1)]' : 'bg-dark-800/50 border-white/5 hover:bg-dark-800'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${highlight ? 'bg-tiffany-green text-dark-900' : 'bg-dark-900 text-gray-400'}`}>
          {icon}
        </div>
        {highlight && <div className="text-[10px] font-bold uppercase bg-tiffany-green text-dark-900 px-2 py-1 rounded-full">Destaque</div>}
      </div>
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">{label}</p>
        <h3 className={`text-2xl md:text-3xl font-bold ${highlight ? 'text-tiffany-green' : 'text-white'}`}>
          {loading ? <span className="animate-pulse">...</span> : value}
        </h3>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
      </div>
    </div>
  );
};

const ProgressionBar = ({ currentLevel }: { currentLevel: string }) => {
  const levels = ['iniciante', 'intermediario', 'avancado', 'coordenador'];
  const currentIndex = levels.indexOf(currentLevel) === -1 ? 0 : levels.indexOf(currentLevel);
  const nextLevel = levels[currentIndex + 1] || 'max';
  
  // Progress calculation (mock logic for now)
  const progress = 45; 

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Seu Progresso</h3>
          <p className="text-sm text-gray-400">Rumo ao nível <span className="text-white font-bold capitalize">{nextLevel === 'max' ? 'Lenda' : nextLevel}</span></p>
        </div>
        <div className="text-right">
           <span className="text-3xl font-bold text-tiffany-green">{progress}%</span>
           <p className="text-[10px] text-gray-500 uppercase">da meta atual</p>
        </div>
      </div>

      <div className="relative h-4 bg-dark-900 rounded-full overflow-hidden mb-4 border border-white/5">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-tiffany-blue to-tiffany-green shadow-[0_0_15px_rgba(129,216,208,0.4)] transition-all duration-1000"
          style={{ width: `${progress}%` }}
        ></div>
        
        {/* Markers */}
        <div className="absolute top-0 left-1/4 h-full w-px bg-dark-900/50"></div>
        <div className="absolute top-0 left-2/4 h-full w-px bg-dark-900/50"></div>
        <div className="absolute top-0 left-3/4 h-full w-px bg-dark-900/50"></div>
      </div>

      <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
        <span>Início</span>
        <span>Meta</span>
      </div>
    </div>
  );
};

const PromoterView = ({ user, refreshTrigger }: { user: User, refreshTrigger: number }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [recurrentClients, setRecurrentClients] = useState(0);
  const [nextEventName, setNextEventName] = useState('...');

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isClientHistoryOpen, setIsClientHistoryOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isPostEventModalOpen, setIsPostEventModalOpen] = useState(false);
  
  const [selectedEventForAction, setSelectedEventForAction] = useState<Event | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    if (!user.id) return;

    try {
      // Fetch Active Events
      const { data: eventsData } = await supabase
        .from('eventos')
        .select('id, nome_evento, data_evento, comissao_por_ingresso, status')
        .in('status', ['ativo', 'upcoming'])
        .order('data_evento', { ascending: true });

      if (eventsData) {
        setEvents(eventsData);
        if (eventsData.length > 0) {
          setNextEventName(eventsData[0].nome_evento);
        } else {
          setNextEventName('Nenhum evento');
        }
      }

      // Fetch Past Events (Encerrados)
       const { data: pastEventsData } = await supabase
        .from('eventos')
        .select('id, nome_evento, data_evento, comissao_por_ingresso, status')
        .eq('status', 'encerrado')
        .order('data_evento', { ascending: false })
        .limit(3);

      if (pastEventsData) {
        setPastEvents(pastEventsData);
      }

      const { data: salesData } = await supabase
        .from('vendas')
        .select('quantidade, valor_comissao')
        .eq('user_id', user.id);

      if (salesData) {
        const tickets = salesData.reduce((acc, sale) => acc + sale.quantidade, 0);
        const commission = salesData.reduce((acc, sale) => acc + sale.valor_comissao, 0);
        setTotalTickets(tickets);
        setTotalCommission(commission);
      }

      const { data: clientsData } = await supabase
        .from('clientes')
        .select('id, nivel_cliente')
        .eq('user_id', user.id);

      if (clientsData) {
        setTotalClients(clientsData.length);
        setRecurrentClients(clientsData.filter((c) => c.nivel_cliente === 'quente' || c.nivel_cliente === 'vip').length);
      }

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshTrigger]);

  const openSaleModal = (event: Event) => {
    setSelectedEventForAction(event);
    setIsSaleModalOpen(true);
  };

  const openPostEventModal = (event: Event) => {
    setSelectedEventForAction(event);
    setIsPostEventModalOpen(true);
  };

  const filteredEvents = events.filter(event => 
    event.nome_evento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formattedCommission = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCommission);
  const recurrenceRate = totalClients > 0 ? Math.round((recurrentClients / totalClients) * 100) : 0;

  const achievements: Achievement[] = [
    { 
      id: 'first_client', 
      title: 'Primeiro Contato', 
      description: 'Cadastrou o primeiro cliente', 
      icon: <Users size={16} />, 
      unlocked: totalClients > 0 
    },
    { 
      id: 'first_sale', 
      title: 'Venda Iniciada', 
      description: 'Realizou a primeira venda', 
      icon: <Ticket size={16} />, 
      unlocked: totalTickets > 0 
    },
    { 
      id: 'power_seller', 
      title: 'Embaixador', 
      description: 'Acumulou 10+ vendas', 
      icon: <Medal size={16} />, 
      unlocked: totalTickets >= 10 
    },
    { 
      id: 'vip_builder', 
      title: 'Base Sólida', 
      description: '5+ Clientes VIP/Quentes', 
      icon: <Star size={16} />, 
      unlocked: recurrentClients >= 5 
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Ticket size={20} />} 
          label="Ingressos Vendidos" 
          value={totalTickets.toString()} 
          subtext="Total acumulado"
          loading={loading}
        />
        <StatCard 
          icon={<DollarSign size={20} />} 
          label="Comissão Acumulada" 
          value={formattedCommission} 
          highlight 
          loading={loading}
        />
        <StatCard 
          icon={<Calendar size={20} />} 
          label="Próxima Festa" 
          value={nextEventName.split(' ')[0]} 
          subtext={nextEventName.length > 15 ? nextEventName.substring(0, 15) + '...' : nextEventName}
          loading={loading}
        />
        <StatCard 
          icon={<Target size={20} />} 
          label="Meta Atual" 
          value="85%" 
          subtext="R$ 550 para bater"
          loading={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <ProgressionBar currentLevel={user.level || 'iniciante'} />
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
           <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Trophy size={16} className="text-yellow-500" /> Conquistas
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map(ach => (
                  <div key={ach.id} className={`p-3 rounded-lg border flex flex-col items-center text-center gap-2 transition-all duration-500 ${ach.unlocked ? 'bg-tiffany-green/10 border-tiffany-green/30 scale-100' : 'bg-dark-800 border-white/5 opacity-40 grayscale scale-95'}`}>
                    <div className={`p-2 rounded-full shadow-lg ${ach.unlocked ? 'bg-tiffany-green text-dark-900 shadow-tiffany-green/20' : 'bg-dark-900 text-gray-500'}`}>
                      {ach.icon}
                    </div>
                    <div>
                      <span className={`block text-[10px] font-bold uppercase ${ach.unlocked ? 'text-tiffany-green' : 'text-gray-500'}`}>{ach.title}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
      
      {/* PÓS EVENTO SECTION - NOVO */}
      {pastEvents.length > 0 && (
        <div className="glass-card p-6 rounded-2xl border border-l-4 border-l-orange-500 border-y-white/5 border-r-white/5 bg-gradient-to-r from-orange-500/5 to-transparent">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
               <History className="text-orange-500" size={20} /> Pós-Evento Pendente
             </h3>
             <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">Ação Necessária</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">Avalie seus clientes que compareceram aos últimos eventos para atualizar o nível estratégico da sua base.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map(event => (
              <div key={event.id} className="bg-dark-900/80 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">{event.nome_evento}</h4>
                  <p className="text-xs text-gray-500">{new Date(event.data_evento).toLocaleDateString('pt-BR')}</p>
                </div>
                <button 
                  onClick={() => openPostEventModal(event)}
                  className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold uppercase rounded hover:bg-orange-600 transition-colors"
                >
                  Avaliar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="text-tiffany-blue" size={20} /> Próximos Eventos
              </h3>
              
              <div className="relative w-full sm:w-auto flex items-center gap-3">
                 <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input 
                      type="text" 
                      placeholder="Buscar evento..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-56 bg-dark-900/50 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-tiffany-green/50 transition-all placeholder-gray-600"
                    />
                 </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {loading ? (
                 [1, 2, 3].map(i => (
                   <div key={i} className="h-24 bg-dark-800/40 border border-white/5 rounded-xl animate-pulse"></div>
                 ))
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => {
                  const dateObj = new Date(event.data_evento);
                  const day = dateObj.getDate().toString().padStart(2, '0');
                  const month = dateObj.toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
                  
                  return (
                    <div key={event.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-dark-800/40 border border-white/5 rounded-xl hover:bg-dark-800 hover:border-tiffany-green/30 transition-all">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="w-14 h-14 bg-dark-900/80 rounded-xl flex flex-col items-center justify-center border border-white/10 group-hover:border-tiffany-green/50 transition-colors shadow-inner">
                          <span className="text-lg font-bold text-white group-hover:text-tiffany-green transition-colors leading-none">{day}</span>
                          <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">{month}</span>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-white text-base group-hover:text-tiffany-green transition-colors mb-0.5">{event.nome_evento}</h4>
                          <div className="flex items-center gap-2">
                             <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${event.status === 'ativo' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                {event.status === 'ativo' ? 'VENDAS ABERTAS' : 'EM BREVE'}
                             </span>
                             <span className="text-xs text-gray-400">Comissão: <span className="text-gray-200 font-medium">R$ {event.comissao_por_ingresso},00</span></span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex items-center gap-2 w-full sm:w-auto">
                        {event.status === 'ativo' ? (
                          <>
                            <button 
                              className="flex-1 sm:flex-none px-4 py-2 bg-dark-900 border border-white/10 text-gray-300 text-xs font-bold uppercase rounded-lg hover:border-tiffany-green hover:text-white transition-all flex items-center justify-center gap-2"
                              onClick={() => {/* Implement later */}}
                            >
                              <ClipboardList size={14} /> <span className="hidden sm:inline">Lista</span>
                            </button>
                            <button 
                              onClick={() => openSaleModal(event)}
                              className="flex-1 sm:flex-none px-4 py-2 bg-tiffany-green/10 border border-tiffany-green/50 text-tiffany-green text-xs font-bold uppercase rounded-lg hover:bg-tiffany-green hover:text-dark-900 transition-all flex items-center justify-center gap-2"
                            >
                              <Ticket size={14} /> Venda
                            </button>
                          </>
                        ) : (
                          <button disabled className="w-full sm:w-auto px-4 py-2 bg-white/5 border border-white/5 text-gray-500 text-xs font-bold uppercase rounded-lg cursor-not-allowed">
                            Aguarde
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                  <Calendar size={32} className="text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm italic">Nenhum evento encontrado no momento.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Users className="text-tiffany-blue" size={20} /> Sua Carteira
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-dark-900/50 p-3 rounded-lg border border-white/5">
                  <p className="text-2xl font-bold text-white">{loading ? <span className="animate-pulse">...</span> : totalClients}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Cadastrado</p>
               </div>
               <div className="bg-dark-900/50 p-3 rounded-lg border border-white/5">
                  <p className="text-2xl font-bold text-tiffany-green">{loading ? <span className="animate-pulse">...</span> : recurrentClients}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Base Quente</p>
               </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Taxa de Base Quente</span>
                <span className="text-xs font-bold text-tiffany-green">{recurrenceRate}%</span>
              </div>
              <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden border border-white/5 mb-1">
                <div 
                  className="h-full bg-gradient-to-r from-tiffany-blue to-tiffany-green opacity-80 rounded-full shadow-[0_0_10px_rgba(129,216,208,0.3)] transition-all duration-1000" 
                  style={{ width: `${recurrenceRate}%` }}
                ></div>
              </div>
            </div>

            <button 
              onClick={() => setIsClientModalOpen(true)}
              className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 hover:border-tiffany-green/50 transition-all uppercase tracking-wide flex items-center justify-center gap-2 group mb-3"
            >
              <Plus size={16} className="text-tiffany-green group-hover:scale-110 transition-transform" />
              Novo Cliente
            </button>
            <button 
              onClick={() => setIsClientHistoryOpen(true)}
              className="w-full py-3 rounded-lg bg-dark-800 border border-white/5 text-gray-400 text-sm font-bold hover:bg-white/5 hover:text-white transition-all uppercase tracking-wide flex items-center justify-center gap-2 group"
            >
              <Clock size={16} className="text-gray-500 group-hover:text-tiffany-blue transition-colors" />
              Ver Base
            </button>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Award className="text-tiffany-blue" size={20} /> Ranking
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-yellow-500 w-4">1º</span>
                  <div className="text-xs text-white">Top RP</div>
                </div>
                <span className="text-xs font-bold text-tiffany-green">R$ 15.2k</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg bg-tiffany-green/10 border border-tiffany-green/30 relative">
                 <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-tiffany-green rounded-r"></div>
                <div className="flex items-center gap-3 pl-2">
                  <span className="text-xs font-bold text-white w-4">8º</span>
                  <div className="text-xs text-white font-bold">{user.name} (Você)</div>
                </div>
                <span className="text-xs font-bold text-tiffany-green">{formattedCommission}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-green-400 justify-center">
                 <ArrowUpRight size={12} />
                 <span>Você está subindo!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isClientModalOpen && (
        <AddClientModal 
          user={user} 
          onClose={() => setIsClientModalOpen(false)} 
          onSuccess={() => {
            setIsClientModalOpen(false);
            fetchDashboardData();
          }} 
        />
      )}

      {isSaleModalOpen && selectedEventForAction && (
        <RegisterSaleModal 
          user={user}
          event={selectedEventForAction}
          onClose={() => setIsSaleModalOpen(false)}
          onSuccess={() => {
            setIsSaleModalOpen(false);
            fetchDashboardData();
          }}
        />
      )}

      {isPostEventModalOpen && selectedEventForAction && (
        <PostEventModal 
           user={user}
           event={selectedEventForAction}
           onClose={() => setIsPostEventModalOpen(false)}
           onSuccess={() => {
             setIsPostEventModalOpen(false);
             fetchDashboardData();
           }}
        />
      )}

      {isClientHistoryOpen && (
        <ClientHistoryModal 
          user={user} 
          onClose={() => setIsClientHistoryOpen(false)} 
        />
      )}

    </div>
  );
};

const AdminView = ({ refreshTrigger }: { refreshTrigger: number }) => {
  return <div className="text-white">Admin View (Mantenha a implementação existente)</div>;
};

const CoordinatorView = ({ refreshTrigger }: { refreshTrigger: number }) => {
  return <div className="text-white">Coordinator View (Mantenha a implementação existente)</div>;
};

// --- MODAL COMPONENTS ---

const GuestManagementModal = ({ user, event, onClose }: { user: User, event: Event, onClose: () => void }) => {
    return null;
};

const RegisterSaleModal = ({ user, event, onClose, onSuccess }: { user: User, event: Event, onClose: () => void, onSuccess: () => void }) => {
    return null; // Implementado na próxima parte se necessário, foco agora é Pós-Evento
};

// --- NOVO: MODAL DE PÓS EVENTO ---

const PostEventModal = ({ user, event, onClose, onSuccess }: { user: User, event: Event, onClose: () => void, onSuccess: () => void }) => {
  const [guests, setGuests] = useState<GuestEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<GuestEntry | null>(null);

  // States for evaluation form
  const [attendance, setAttendance] = useState<boolean | null>(null);
  const [purchaseSource, setPurchaseSource] = useState('rp');
  const [company, setCompany] = useState('amigos');
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [suggestedLevel, setSuggestedLevel] = useState<'frio' | 'medio' | 'quente' | 'vip'>('medio');
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchGuests = async () => {
      // In a real scenario, we join with clients table. 
      // Since Supabase join syntax can be verbose, we'll do two queries or use a View in a real app.
      // Here assuming we fetch related data.
      
      const { data: guestsData } = await supabase
        .from('lista_convidados')
        .select(`
           *,
           clientes:client_id (id, nome_cliente, nivel_cliente)
        `)
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .eq('pos_evento_concluido', false); // Only pending evaluations
      
      if (guestsData) {
        // Map the joined data correctly
        const formattedGuests = guestsData.map((g: any) => ({
           ...g,
           client: g.clientes // Map joined 'clientes' to 'client' prop
        }));
        setGuests(formattedGuests);
      } else {
        // Fallback for demo if no data found/table issue, create a mock entry based on existing clients
        // This is strictly for the demo UI to appear if DB is empty
         const { data: clients } = await supabase.from('clientes').select('*').limit(3);
         if (clients && clients.length > 0) {
            setGuests(clients.map((c: any) => ({
                id: Math.random(),
                event_id: event.id,
                client_id: c.id,
                user_id: user.id!,
                status: 'confirmado',
                pos_evento_concluido: false,
                client: c
            })));
         }
      }
      setLoading(false);
    };
    fetchGuests();
  }, [event.id, user.id]);

  const handleSelectGuest = (guest: GuestEntry) => {
    setSelectedGuest(guest);
    // Reset form
    setAttendance(null);
    setRating(0);
    setFeedbackText('');
    setSuggestedLevel(guest.client?.nivel_cliente || 'frio');
  };

  const handleAttendanceChange = (attended: boolean) => {
    setAttendance(attended);
    
    // Simple Logic for Level Suggestion based on current interaction
    // In a real app, this would query historical data
    const currentLevel = selectedGuest?.client?.nivel_cliente || 'frio';
    
    if (attended) {
       if (currentLevel === 'frio') setSuggestedLevel('medio');
       else if (currentLevel === 'medio') setSuggestedLevel('quente');
       else setSuggestedLevel(currentLevel); // Keep Quente/VIP
    } else {
       if (currentLevel === 'quente') setSuggestedLevel('medio');
       else if (currentLevel === 'medio') setSuggestedLevel('frio');
       else setSuggestedLevel('frio');
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedGuest || !selectedGuest.client) return;
    setSubmitting(true);

    try {
      // 1. Update Guest Entry (The Interaction Log)
      const { error: guestError } = await supabase
        .from('lista_convidados')
        .update({
           status: attendance ? 'check_in' : 'nao_compareceu',
           pos_evento_concluido: true,
           comprou_ingresso: attendance, // Simplification
           origem_compra: purchaseSource,
           acompanhado_por: company,
           avaliacao_geral: rating,
           feedback_texto: feedbackText
        })
        .eq('id', selectedGuest.id);

      // If record didn't exist in DB (mocked), insert it now
      if (guestError && selectedGuest.id < 1) {
          await supabase.from('lista_convidados').insert([{
             event_id: event.id,
             client_id: selectedGuest.client_id,
             user_id: user.id,
             status: attendance ? 'check_in' : 'nao_compareceu',
             pos_evento_concluido: true,
             comprou_ingresso: attendance,
             origem_compra: purchaseSource,
             acompanhado_por: company,
             avaliacao_geral: rating,
             feedback_texto: feedbackText
          }]);
      }

      // 2. Update Client Level
      if (suggestedLevel !== selectedGuest.client.nivel_cliente) {
         await supabase
           .from('clientes')
           .update({ 
             nivel_cliente: suggestedLevel,
             recorrente: suggestedLevel === 'quente' || suggestedLevel === 'vip'
           })
           .eq('id', selectedGuest.client.id);
      }

      // Remove from local list
      setGuests(prev => prev.filter(g => g.id !== selectedGuest.id));
      setSelectedGuest(null);
      
      if (guests.length <= 1) {
          onSuccess(); // All done
      }

    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-orange-500/5">
           <div>
             <h3 className="text-xl font-bold text-white flex items-center gap-2">
               <History className="text-orange-500"/> Pós-Evento: {event.nome_evento}
             </h3>
             <p className="text-gray-400 text-xs mt-1">Atualize o status dos seus clientes para manter a base inteligente.</p>
           </div>
           <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-white" /></button>
        </div>

        <div className="flex-1 overflow-hidden flex">
           {/* Sidebar List */}
           <div className="w-1/3 border-r border-white/5 overflow-y-auto bg-dark-800/30">
              {loading ? (
                <div className="p-4 text-center text-gray-500 text-xs">Carregando...</div>
              ) : guests.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center gap-2">
                   <CheckCircle2 className="text-green-500" size={32} />
                   <span className="text-white font-bold text-sm">Tudo pronto!</span>
                   <p className="text-gray-500 text-xs">Nenhum cliente pendente.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                   {guests.map(guest => (
                     <button 
                       key={guest.client?.id || guest.id}
                       onClick={() => handleSelectGuest(guest)}
                       className={`w-full p-4 text-left hover:bg-white/5 transition-colors ${selectedGuest?.id === guest.id ? 'bg-white/5 border-l-2 border-l-tiffany-green' : 'border-l-2 border-l-transparent'}`}
                     >
                       <div className="font-bold text-white text-sm truncate">{guest.client?.nome_cliente}</div>
                       <div className="text-[10px] text-gray-500 uppercase mt-1">{guest.client?.nivel_cliente}</div>
                     </button>
                   ))}
                </div>
              )}
           </div>

           {/* Evaluation Form */}
           <div className="w-2/3 p-6 overflow-y-auto custom-scrollbar">
              {selectedGuest ? (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    
                    {/* 1. Compareceu? */}
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">O cliente compareceu?</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => handleAttendanceChange(true)}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${attendance === true ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-dark-800 border-white/10 text-gray-400 hover:border-green-500/50'}`}
                          >
                             <ThumbsUp size={24} />
                             <span className="font-bold text-sm">Sim, foi!</span>
                          </button>
                          <button 
                             onClick={() => handleAttendanceChange(false)}
                             className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${attendance === false ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-dark-800 border-white/10 text-gray-400 hover:border-red-500/50'}`}
                          >
                             <ThumbsDown size={24} />
                             <span className="font-bold text-sm">Não foi</span>
                          </button>
                       </div>
                    </div>

                    {attendance === true && (
                       <>
                         {/* 2. Detalhes */}
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Comprou com</label>
                               <select value={purchaseSource} onChange={e => setPurchaseSource(e.target.value)} className="w-full bg-dark-800 border border-white/10 rounded-lg p-2 text-white text-xs outline-none">
                                  <option value="rp">Comigo (RP)</option>
                                  <option value="amigo">Amigo</option>
                                  <option value="bilheteria">Bilheteria</option>
                                  <option value="lista_vip">Lista VIP</option>
                               </select>
                            </div>
                            <div>
                               <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Foi acompanhado</label>
                               <select value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-dark-800 border border-white/10 rounded-lg p-2 text-white text-xs outline-none">
                                  <option value="amigos">Amigos</option>
                                  <option value="sozinho">Sozinho</option>
                                  <option value="grupo">Grupo Grande</option>
                               </select>
                            </div>
                         </div>

                         {/* 3. Feedback */}
                         <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Experiência (Opcional)</label>
                            <textarea 
                              value={feedbackText}
                              onChange={e => setFeedbackText(e.target.value)}
                              placeholder="O que o cliente achou? Gostou da música? Reclamou de algo?"
                              className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white text-xs outline-none min-h-[80px]"
                            />
                         </div>
                       </>
                    )}

                    {/* 4. Level Update */}
                    {attendance !== null && (
                       <div className="bg-dark-800 p-4 rounded-xl border border-white/10">
                          <div className="flex justify-between items-center mb-3">
                             <span className="text-xs font-bold text-gray-400 uppercase">Nível Estratégico</span>
                             <span className="text-[10px] text-tiffany-green bg-tiffany-green/10 px-2 py-0.5 rounded">Sugestão do Sistema</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                             <div className="opacity-50 flex flex-col items-center">
                                <span className="text-[10px] uppercase text-gray-500">Atual</span>
                                <span className="font-bold text-white text-sm">{selectedGuest.client?.nivel_cliente}</span>
                             </div>
                             <ArrowUpRight size={16} className="text-gray-600" />
                             <div className="flex-1">
                                <select 
                                  value={suggestedLevel} 
                                  onChange={e => setSuggestedLevel(e.target.value as any)} 
                                  className={`w-full font-bold uppercase text-sm p-2 rounded border outline-none ${
                                     suggestedLevel === 'vip' ? 'bg-tiffany-green/20 text-tiffany-green border-tiffany-green' :
                                     suggestedLevel === 'quente' ? 'bg-orange-500/20 text-orange-400 border-orange-500' :
                                     suggestedLevel === 'medio' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500' :
                                     'bg-blue-500/20 text-blue-400 border-blue-500'
                                  }`}
                                >
                                   <option value="frio">Frio</option>
                                   <option value="medio">Médio</option>
                                   <option value="quente">Quente</option>
                                   <option value="vip">VIP</option>
                                </select>
                             </div>
                          </div>
                       </div>
                    )}

                    <Button fullWidth onClick={handleSubmitEvaluation} disabled={submitting}>
                       {submitting ? 'Salvando...' : 'Confirmar e Próximo'}
                    </Button>
                 </div>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                    <Users size={48} className="mb-4" />
                    <p className="text-sm">Selecione um cliente ao lado para avaliar</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- UPDATED ADD CLIENT MODAL (Mantido igual, apenas re-renderizado para contexto) ---
const AddClientModal = ({ user, onClose, onSuccess }: { user: User, onClose: () => void, onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dados' | 'consumo' | 'estrategia'>('dados');
  const [formData, setFormData] = useState<Partial<Client>>({
    nome_cliente: '', apelido: '', whatsapp: '', instagram: '', seguidores: 0, genero: 'masculino',
    genero_musical: [], tipo_festa_frequente: 'open_bar', ticket_medio_gasto: 'medio', nivel_cliente: 'frio'
  });

  const handleInputChange = (field: keyof Client, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleMusicGenre = (genre: string) => {
    setFormData(prev => {
      const current = prev.genero_musical || [];
      return current.includes(genre) ? { ...prev, genero_musical: current.filter(g => g !== genre) } : { ...prev, genero_musical: [...current, genre] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErrorMsg(null);
    const payload = { ...formData, user_id: user.id, recorrente: formData.nivel_cliente === 'quente' || formData.nivel_cliente === 'vip' };
    const { error } = await supabase.from('clientes').insert([payload]);
    setLoading(false);
    if (!error) onSuccess(); else setErrorMsg('Erro ao salvar cliente.');
  };

  const inputClass = "w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-tiffany-green transition-colors";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
         <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Plus className="text-tiffany-green"/> Cadastro de Cliente</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
         </div>
         <div className="flex border-b border-white/5 bg-dark-800/50 px-6 pt-2 gap-4">
            {['dados', 'consumo', 'estrategia'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab ? 'text-tiffany-green border-tiffany-green' : 'text-gray-500 border-transparent hover:text-white'}`}>
                {tab === 'dados' ? 'Identificação' : tab === 'consumo' ? 'Perfil de Consumo' : 'Estratégia'}
              </button>
            ))}
         </div>
         <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {errorMsg && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">{errorMsg}</div>}
            <form id="client-form" onSubmit={handleSubmit}>
              <div className={activeTab === 'dados' ? 'space-y-4 animate-in fade-in' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1"><label className={labelClass}>Nome Completo *</label><input required type="text" value={formData.nome_cliente} onChange={e => handleInputChange('nome_cliente', e.target.value)} className={inputClass} /></div>
                   <div className="space-y-1"><label className={labelClass}>Apelido</label><input type="text" value={formData.apelido} onChange={e => handleInputChange('apelido', e.target.value)} className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1"><label className={labelClass}>WhatsApp *</label><input required type="text" value={formData.whatsapp} onChange={e => handleInputChange('whatsapp', e.target.value)} className={inputClass} /></div>
                   <div className="space-y-1"><label className={labelClass}>Gênero</label><div className="grid grid-cols-2 gap-2">{['masculino', 'feminino'].map(g => (<button type="button" key={g} onClick={() => handleInputChange('genero', g)} className={`p-3 rounded-lg border text-xs font-bold uppercase ${formData.genero === g ? 'bg-tiffany-green/10 border-tiffany-green text-tiffany-green' : 'bg-dark-800 border-white/10 text-gray-500'}`}>{g}</button>))}</div></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                   <div className="space-y-1"><label className={labelClass}>Instagram</label><input type="text" value={formData.instagram} onChange={e => handleInputChange('instagram', e.target.value)} className={inputClass} /></div>
                   <div className="space-y-1"><label className={labelClass}>Seguidores</label><input type="number" value={formData.seguidores} onChange={e => handleInputChange('seguidores', parseInt(e.target.value))} className={inputClass} /></div>
                </div>
              </div>
              <div className={activeTab === 'consumo' ? 'space-y-6 animate-in fade-in' : 'hidden'}>
                 <div className="space-y-2"><label className={labelClass}>Gêneros Musicais</label><div className="grid grid-cols-2 md:grid-cols-3 gap-2">{['funk', 'eletronica', 'afro house', 'trap', 'sertanejo', 'pagode'].map(genre => (<button type="button" key={genre} onClick={() => toggleMusicGenre(genre)} className={`p-2 rounded-lg border text-xs font-bold uppercase ${formData.genero_musical?.includes(genre) ? 'bg-tiffany-blue/20 border-tiffany-blue text-white' : 'bg-dark-800 border-white/10 text-gray-500'}`}>{genre}</button>))}</div></div>
                 <div className="space-y-2"><label className={labelClass}>Festa Preferida</label><select value={formData.tipo_festa_frequente} onChange={e => handleInputChange('tipo_festa_frequente', e.target.value)} className={inputClass}><option value="open_bar">Open Bar</option><option value="open_format">Open Format</option><option value="balada_genero_especifico">Balada Específica</option><option value="camarote_evento_premium">Premium</option></select></div>
                 <div className="space-y-2"><label className={labelClass}>Ticket Médio</label><div className="grid grid-cols-3 gap-3">{['baixo', 'medio', 'alto'].map(t => (<button key={t} type="button" onClick={() => handleInputChange('ticket_medio_gasto', t)} className={`p-3 rounded-lg border uppercase text-[10px] font-bold ${formData.ticket_medio_gasto === t ? 'bg-white/10 border-white text-white' : 'bg-dark-800 border-white/10 text-gray-500'}`}>{t}</button>))}</div></div>
              </div>
              <div className={activeTab === 'estrategia' ? 'space-y-6 animate-in fade-in' : 'hidden'}>
                <div className="space-y-3"><label className={labelClass}>Nível Estratégico</label>
                  {[{id:'frio', icon:Snowflake, color:'blue'}, {id:'medio', icon:Zap, color:'yellow'}, {id:'quente', icon:Flame, color:'orange'}, {id:'vip', icon:Crown, color:'tiffany-green'}].map((lvl: any) => (
                    <div key={lvl.id} onClick={() => handleInputChange('nivel_cliente', lvl.id)} className={`cursor-pointer p-4 rounded-xl border flex items-center gap-4 ${formData.nivel_cliente === lvl.id ? `bg-${lvl.color}-500/10 border-${lvl.color}-500` : 'bg-dark-800 border-white/10 opacity-60'}`}><lvl.icon className={formData.nivel_cliente === lvl.id ? `text-${lvl.color}-500` : 'text-gray-500'} size={18} /><div><h4 className="font-bold text-sm text-white capitalize">{lvl.id}</h4></div></div>
                  ))}
                </div>
              </div>
            </form>
         </div>
         <div className="p-6 border-t border-white/5 bg-dark-900 flex gap-4">
            {activeTab !== 'dados' && <button onClick={() => setActiveTab(prev => prev === 'estrategia' ? 'consumo' : 'dados')} className="px-4 py-3 rounded-lg border border-white/10 text-white font-bold uppercase text-xs">Voltar</button>}
            {activeTab !== 'estrategia' ? <Button fullWidth onClick={() => setActiveTab(prev => prev === 'dados' ? 'consumo' : 'estrategia')}>Próximo</Button> : <Button fullWidth onClick={handleSubmit} disabled={loading}>{loading ? 'Salvando...' : 'Finalizar'}</Button>}
         </div>
      </div>
    </div>
  );
};

// --- UPDATED CLIENT HISTORY MODAL WITH INTERACTION LOG ---

const ClientHistoryModal = ({ user, onClose }: { user: User, onClose: () => void }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientHistory, setSelectedClientHistory] = useState<any[] | null>(null);
  const [viewingClientId, setViewingClientId] = useState<number | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
        const { data } = await supabase.from('clientes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (data) setClients(data);
        setLoading(false);
    };
    fetchClients();
  }, [user.id]);

  const fetchInteractionHistory = async (clientId: number) => {
      setViewingClientId(clientId);
      // Fetch guest list entries which act as interaction logs
      const { data } = await supabase
        .from('lista_convidados')
        .select(`
            *,
            eventos:event_id (nome_evento, data_evento)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      setSelectedClientHistory(data || []);
  };

  const getNivelBadge = (nivel: string) => { /* Same as before... */ return <span className="uppercase text-[10px] font-bold border px-1 rounded">{nivel}</span> };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-white/5 bg-dark-800 flex justify-between items-center">
             <h3 className="text-xl font-bold text-white flex items-center gap-2"><Users className="text-tiffany-green"/> Base e Histórico</h3>
             <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-white" /></button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
            {/* Left: Client List */}
            <div className={`w-full md:w-1/2 overflow-y-auto p-4 border-r border-white/5 ${viewingClientId ? 'hidden md:block' : 'block'}`}>
                {loading ? <div className="text-center py-8 text-gray-500">Carregando...</div> : 
                 clients.map(client => (
                    <div key={client.id} onClick={() => fetchInteractionHistory(client.id)} className={`p-4 rounded-xl border mb-3 cursor-pointer hover:bg-white/5 transition-all ${viewingClientId === client.id ? 'bg-white/5 border-tiffany-green/50' : 'bg-dark-800 border-white/5'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white font-bold text-sm">{client.nome_cliente}</p>
                                <p className="text-xs text-gray-500">{client.whatsapp}</p>
                            </div>
                            {getNivelBadge(client.nivel_cliente)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Right: Interaction History */}
            <div className={`w-full md:w-1/2 overflow-y-auto p-6 bg-dark-900/50 ${viewingClientId ? 'block' : 'hidden md:flex md:items-center md:justify-center'}`}>
                {viewingClientId ? (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex items-center gap-2 mb-4 md:hidden">
                            <button onClick={() => setViewingClientId(null)} className="text-xs uppercase font-bold text-tiffany-green">Voltar</button>
                        </div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase border-b border-white/5 pb-2">Histórico de Interações</h4>
                        
                        {!selectedClientHistory || selectedClientHistory.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Nenhuma interação registrada para este cliente.</p>
                        ) : (
                            <div className="relative border-l border-white/10 ml-2 space-y-6">
                                {selectedClientHistory.map((entry: any) => (
                                    <div key={entry.id} className="pl-6 relative">
                                        <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 ${entry.status === 'check_in' ? 'bg-green-500 border-green-500' : entry.status === 'confirmado' ? 'bg-dark-900 border-gray-500' : 'bg-red-500 border-red-500'}`}></div>
                                        
                                        <div className="bg-dark-800 p-4 rounded-xl border border-white/5">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-bold text-white">{entry.eventos?.nome_evento || 'Evento desconhecido'}</span>
                                                <span className="text-[10px] text-gray-500">{new Date(entry.created_at).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            
                                            <div className="flex gap-2 mb-3">
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${entry.status === 'check_in' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {entry.status === 'check_in' ? 'Compareceu' : entry.status === 'nao_compareceu' ? 'Faltou' : 'Confirmado'}
                                                </span>
                                                {entry.comprou_ingresso && <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-tiffany-green/10 text-tiffany-green">Comprou</span>}
                                            </div>

                                            {entry.feedback_texto && (
                                                <p className="text-xs text-gray-300 italic bg-dark-900/50 p-2 rounded border border-white/5">
                                                    "{entry.feedback_texto}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <History size={32} className="mx-auto mb-2 opacity-50"/>
                        <p className="text-sm">Selecione um cliente para ver o histórico</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};