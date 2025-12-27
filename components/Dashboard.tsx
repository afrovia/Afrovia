import React, { useEffect, useState, useCallback } from 'react';
import { User, Event, Client, GuestEntry, Achievement } from '../types';
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
  CheckCircle2,
  ClipboardList,
  Clock,
  Star,
  Shield,
  Medal,
  RefreshCw,
  AlertCircle
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
  
  // Initialize state directly from user prop to avoid flash
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return user.role === 'promoter' && user.onboarding_completed === false;
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    // Add a minimum delay for visual feedback
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

const PromoterView = ({ user, refreshTrigger }: { user: User, refreshTrigger: number }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [recurrentClients, setRecurrentClients] = useState(0);
  const [nextEventName, setNextEventName] = useState('...');

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isClientHistoryOpen, setIsClientHistoryOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [selectedEventForAction, setSelectedEventForAction] = useState<Event | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    if (!user.id) return;

    try {
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
        .select('id, recorrente')
        .eq('user_id', user.id);

      if (clientsData) {
        setTotalClients(clientsData.length);
        setRecurrentClients(clientsData.filter((c) => c.recorrente).length);
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

  const openGuestModal = (event: Event) => {
    setSelectedEventForAction(event);
    setIsGuestModalOpen(true);
  }

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
      description: '5+ Clientes Recorrentes', 
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="text-tiffany-blue" size={20} /> Eventos Ativos
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
                 // Skeleton loading
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
                              onClick={() => openGuestModal(event)}
                              className="flex-1 sm:flex-none px-4 py-2 bg-dark-900 border border-white/10 text-gray-300 text-xs font-bold uppercase rounded-lg hover:border-tiffany-green hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                              <ClipboardList size={14} /> <span className="hidden sm:inline">Experiência</span>
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
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Recorrentes</p>
               </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Taxa de Recorrência</span>
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
              Ver Histórico
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

          <div className="flex flex-col gap-3">
             <ActionButton 
                icon={<Plus size={18} />} 
                label="Cadastrar Cliente" 
                onClick={() => setIsClientModalOpen(true)}
                highlight
             />
             <ActionButton icon={<Target size={18} />} label="Acompanhar Metas" />
             <ActionButton icon={<Calendar size={18} />} label="Agenda de Eventos" />
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

      {isGuestModalOpen && selectedEventForAction && (
        <GuestManagementModal 
          user={user}
          event={selectedEventForAction}
          onClose={() => setIsGuestModalOpen(false)}
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
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const { data: usersData } = await supabase
        .from('users_profile')
        .select('id, nome, email, role, nivel, cidade')
        .order('created_at', { ascending: false })
        .limit(50);

      if (usersData) {
        setUsers(usersData.map((u: any) => ({
          id: u.id,
          name: u.nome,
          email: u.email,
          role: u.role,
          level: u.nivel,
          city: u.cidade,
          active: true 
        })));
      }

      const { data: eventsData } = await supabase.from('eventos').select('*').order('data_evento', {ascending: false});
      if (eventsData) setEvents(eventsData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'promoter' ? 'coordinator' : 'promoter';
    await supabase.from('users_profile').update({ role: newRole }).eq('id', userId);
    fetchData();
  };

  const toggleEventStatus = async (eventId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ativo' ? 'encerrado' : 'ativo';
    await supabase.from('eventos').update({ status: newStatus }).eq('id', eventId);
    fetchData();
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-xl border border-white/5">
           <p className="text-gray-500 text-xs uppercase mb-1">Total de Usuários</p>
           <h3 className="text-2xl font-bold text-white">{users.length}</h3>
        </div>
        <div className="glass-card p-6 rounded-xl border border-white/5">
           <p className="text-gray-500 text-xs uppercase mb-1">Eventos Ativos</p>
           <h3 className="text-2xl font-bold text-tiffany-green">{events.filter(e => e.status === 'ativo').length}</h3>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-tiffany-green" /> Gestão de Eventos
          </h2>
          <button 
            onClick={() => setIsEventModalOpen(true)}
            className="px-4 py-2 bg-tiffany-green text-dark-900 font-bold rounded-lg text-sm hover:bg-white transition-colors flex items-center gap-2 shadow-lg shadow-tiffany-green/10"
          >
            <Plus size={16} /> Criar Evento
          </button>
        </div>
        <div className="glass-card overflow-hidden rounded-xl border border-white/5 overflow-x-auto shadow-2xl">
          <table className="w-full text-left min-w-[600px]">
             <thead className="bg-dark-800/80 text-xs uppercase text-gray-500 font-bold tracking-wider">
               <tr>
                 <th className="p-5">Evento</th>
                 <th className="p-5">Data</th>
                 <th className="p-5">Comissão</th>
                 <th className="p-5">Status</th>
                 <th className="p-5 text-right">Ação</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               {events.map(event => (
                 <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                   <td className="p-5 text-white font-medium group-hover:text-tiffany-green transition-colors">{event.nome_evento}</td>
                   <td className="p-5 text-gray-400 text-sm">{new Date(event.data_evento).toLocaleDateString()}</td>
                   <td className="p-5 text-gray-400 text-sm">R$ {event.comissao_por_ingresso}</td>
                   <td className="p-5">
                      <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold border ${event.status === 'ativo' ? 'bg-green-500/5 text-green-400 border-green-500/20' : 'bg-red-500/5 text-red-400 border-red-500/20'}`}>
                        {event.status}
                      </span>
                   </td>
                   <td className="p-5 text-right">
                      <button 
                        onClick={() => toggleEventStatus(event.id, event.status)}
                        className="text-xs font-bold underline decoration-transparent hover:decoration-white transition-all text-gray-400 hover:text-white"
                      >
                        {event.status === 'ativo' ? 'Encerrar' : 'Reativar'}
                      </button>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
          <Users className="text-blue-500" /> Gestão de Usuários
        </h2>
        <div className="glass-card overflow-hidden rounded-xl border border-white/5 overflow-x-auto shadow-2xl">
          <table className="w-full text-left min-w-[600px]">
             <thead className="bg-dark-800/80 text-xs uppercase text-gray-500 font-bold tracking-wider">
               <tr>
                 <th className="p-5">Nome</th>
                 <th className="p-5">Email</th>
                 <th className="p-5">Nível</th>
                 <th className="p-5">Função</th>
                 <th className="p-5 text-right">Ações</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               {users.map(u => (
                 <tr key={u.id} className="hover:bg-white/5 transition-colors">
                   <td className="p-5 text-white font-medium">{u.name}</td>
                   <td className="p-5 text-gray-400 text-sm">{u.email}</td>
                   <td className="p-5 text-sm">
                      <span className="px-3 py-1 border border-white/10 rounded-full text-xs text-gray-300 capitalize bg-white/5">{u.level}</span>
                   </td>
                   <td className="p-5">
                      <span className={`text-xs font-bold uppercase ${u.role === 'admin' ? 'text-yellow-500' : u.role === 'coordinator' ? 'text-blue-400' : 'text-tiffany-green'}`}>
                        {u.role === 'promoter' ? 'RP' : u.role === 'coordinator' ? 'Líder RP' : 'Admin'}
                      </span>
                   </td>
                   <td className="p-5 text-right">
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => toggleUserRole(u.id!, u.role)}
                          className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded transition-colors text-white whitespace-nowrap"
                        >
                          {u.role === 'promoter' ? 'Promover a Líder' : 'Rebaixar a RP'}
                        </button>
                      )}
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>

      {isEventModalOpen && (
        <CreateEventModal onClose={() => setIsEventModalOpen(false)} onSuccess={() => { setIsEventModalOpen(false); fetchData(); }} />
      )}
    </div>
  );
};

const CoordinatorView = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [team, setTeam] = useState<User[]>([]);
  
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await supabase.from('users_profile').select('*').eq('role', 'promoter');
        if (data) {
          setTeam(data.map((u: any) => ({
            id: u.id,
            name: u.nome,
            email: u.email,
            role: u.role,
            level: u.nivel,
            active: true
          })));
        }
      } catch (e) { console.error(e); }
    };
    fetchTeam();
  }, [refreshTrigger]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center">
           <Shield size={48} className="text-blue-500 mb-4 opacity-80" />
           <h2 className="text-2xl font-bold text-white">Painel de Liderança RP</h2>
           <p className="text-gray-400 mt-2 max-w-sm">Monitore o desempenho da sua equipe e garanta que as metas sejam batidas.</p>
        </div>
        <div className="glass-card p-8 rounded-2xl border border-white/5 flex flex-col justify-center">
           <h3 className="text-lg font-bold text-white mb-4">Resumo da Equipe</h3>
           <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total de RPs</span>
                <span className="text-white font-bold">{team.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Vendas da Semana</span>
                <span className="text-tiffany-green font-bold">R$ 12.450,00</span>
              </div>
           </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users className="text-tiffany-green" /> Sua Equipe
        </h3>
        <div className="glass-card overflow-hidden rounded-xl border border-white/5 shadow-2xl">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-dark-800 text-xs uppercase text-gray-500 font-bold tracking-wider">
              <tr>
                <th className="p-5">RP</th>
                <th className="p-5">Nível</th>
                <th className="p-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {team.map(member => (
                <tr key={member.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-5 font-medium text-white">{member.name}</td>
                  <td className="p-5 text-sm text-gray-300 capitalize">{member.level}</td>
                  <td className="p-5"><span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded font-bold uppercase">Ativo</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- MODAL COMPONENTS ---

const CreateEventModal = ({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [commission, setCommission] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const { error } = await supabase.from('eventos').insert([{
      nome_evento: name,
      data_evento: date,
      comissao_por_ingresso: parseFloat(commission),
      status: 'ativo'
    }]);

    setLoading(false);
    if (!error) onSuccess();
    else setErrorMsg('Erro ao criar evento. Verifique permissões.');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl shadow-2xl p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Calendar className="text-tiffany-green" /> Novo Evento</h3>
        
        {errorMsg && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">{errorMsg}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nome do Evento" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-tiffany-green" />
          <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-tiffany-green" />
          <input type="number" placeholder="Comissão (R$)" required value={commission} onChange={e => setCommission(e.target.value)} className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-tiffany-green" />
          <Button fullWidth type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar Evento'}</Button>
        </form>
      </div>
    </div>
  );
};

const GuestManagementModal = ({ user, event, onClose }: { user: User, event: Event, onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'pre' | 'checkin' | 'post'>('pre');
  const [guests, setGuests] = useState<GuestEntry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  
  const fetchData = useCallback(async () => {
    try {
      const { data: guestData } = await supabase.from('lista_convidados').select('*, client:clientes(*)').eq('event_id', event.id).eq('user_id', user.id);
      if (guestData) setGuests(guestData);
      const { data: clientData } = await supabase.from('clientes').select('*').eq('user_id', user.id);
      if (clientData) setClients(clientData);
    } catch(e) { console.error(e) }
  }, [event.id, user.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addGuest = async () => {
    if (!selectedClientId) return;
    const { error } = await supabase.from('lista_convidados').insert({ event_id: event.id, client_id: parseInt(selectedClientId), user_id: user.id, status: 'confirmado' });
    if (!error) { setSelectedClientId(''); fetchData(); }
  };

  const updateGuest = async (id: number, updates: Partial<GuestEntry>) => {
    await supabase.from('lista_convidados').update(updates).eq('id', id);
    fetchData();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/5 bg-dark-800 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><ClipboardList className="text-tiffany-green" size={20} /> Gestão de Experiência</h3>
            <p className="text-xs text-gray-500 mt-1">{event.nome_evento}</p>
          </div>
          <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-white" /></button>
        </div>
        <div className="flex border-b border-white/5 bg-dark-800/50">
          {['pre', 'checkin', 'post'].map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider ${activeTab === tab ? 'text-tiffany-green border-b-2 border-tiffany-green bg-white/5' : 'text-gray-500 hover:text-white'}`}>{tab === 'pre' ? 'Pré-Festa' : tab === 'checkin' ? 'Check-in' : 'Pós-Festa'}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-dark-900/50 custom-scrollbar">
          {activeTab === 'pre' && (
            <div className="space-y-4">
               <div className="flex gap-2">
                 <select className="flex-1 bg-dark-800 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-tiffany-green" value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
                   <option value="">Selecionar Cliente...</option>
                   {clients.map(c => <option key={c.id} value={c.id}>{c.nome_cliente}</option>)}
                 </select>
                 <button onClick={addGuest} className="px-6 py-2 bg-tiffany-green text-dark-900 font-bold rounded-lg uppercase text-xs hover:bg-tiffany-blue transition-colors">Adicionar</button>
               </div>
               <div className="space-y-3">
               {guests.map(g => (
                 <div key={g.id} className="bg-dark-800 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                   <div className="flex justify-between mb-2"><span className="text-white font-bold">{g.client?.nome_cliente}</span><span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded uppercase font-bold">Confirmado</span></div>
                   <textarea placeholder="Observações (ex: Aniversário, Bebida...)" className="w-full bg-dark-900 border border-white/5 rounded-lg p-2 text-xs text-white focus:border-tiffany-green/30 outline-none" onBlur={(e) => updateGuest(g.id, {notes: e.target.value})} defaultValue={g.notes || ''} />
                 </div>
               ))}
               {guests.length === 0 && <p className="text-center text-gray-500 text-sm py-4 italic">Nenhum convidado adicionado.</p>}
               </div>
            </div>
          )}
          {activeTab === 'checkin' && (
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-gray-500 uppercase font-bold mb-2"><span>Cliente</span><span>Status</span></div>
              {guests.length === 0 && <p className="text-center text-gray-500 text-sm py-4 italic">Adicione convidados na aba Pré-Festa.</p>}
              {guests.map(g => (
                <div key={g.id} className={`p-4 rounded-xl border flex justify-between items-center transition-all ${g.status === 'check_in' ? 'bg-tiffany-green/5 border-tiffany-green/30' : 'bg-dark-800 border-white/5'}`}>
                   <div><span className="text-white font-bold block">{g.client?.nome_cliente}</span><span className="text-xs text-gray-500">{g.notes}</span></div>
                   <button 
                    onClick={() => updateGuest(g.id, {
                        status: g.status === 'check_in' ? 'confirmado' : 'check_in', 
                        check_in_time: g.status === 'check_in' ? null : new Date().toISOString()
                    })} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-2 ${g.status === 'check_in' ? 'bg-tiffany-green text-dark-900' : 'bg-dark-900 border border-white/10 text-white hover:border-white'}`}
                   >
                     {g.status === 'check_in' ? <><CheckCircle2 size={12}/> Entrou</> : 'Dar Entrada'}
                   </button>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'post' && (
            <div className="space-y-3">
               {guests.filter(g => g.status === 'check_in').length === 0 && <p className="text-gray-500 text-center text-sm py-4">Nenhum check-in realizado.</p>}
               {guests.filter(g => g.status === 'check_in').map(g => (
                 <div key={g.id} className="bg-dark-800 p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">{g.client?.nome_cliente}</span>
                      <select className="bg-dark-900 border border-white/10 rounded px-2 py-1 text-[10px] text-white outline-none focus:border-tiffany-green" value={g.classification || ''} onChange={(e) => updateGuest(g.id, {classification: e.target.value as any})}><option value="">Classificar Potencial...</option><option value="alto_potencial">VIP (Alto Potencial)</option><option value="recorrente">Cliente Recorrente</option><option value="ocasional">Ocasional</option></select>
                    </div>
                    <textarea placeholder="Feedback do cliente..." className="w-full bg-dark-900 border border-white/5 rounded-lg p-3 text-xs text-white focus:border-tiffany-green/30 outline-none" rows={2} onBlur={(e) => updateGuest(g.id, {feedback: e.target.value})} defaultValue={g.feedback || ''} />
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AddClientModal = ({ user, onClose, onSuccess }: { user: User, onClose: () => void, onSuccess: () => void }) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const { error } = await supabase.from('clientes').insert([{ user_id: user.id, nome_cliente: name, whatsapp: whatsapp, recorrente: false }]);
    setLoading(false);
    if (!error) onSuccess();
    else setErrorMsg('Erro ao adicionar cliente. Tente novamente.');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl shadow-2xl p-6">
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Users className="text-tiffany-green"/> Novo Cliente</h3>
         
         {errorMsg && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">{errorMsg}</div>}

         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-tiffany-green" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp</label>
              <input type="text" required value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(00) 00000-0000" className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-tiffany-green" />
            </div>
            <Button fullWidth type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Cliente'}</Button>
         </form>
      </div>
    </div>
  );
};

const RegisterSaleModal = ({ user, event, onClose, onSuccess }: { user: User, event: Event, onClose: () => void, onSuccess: () => void }) => {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const { error } = await supabase.from('vendas').insert([{ user_id: user.id, evento_id: event.id, quantidade: qty, valor_comissao: qty * event.comissao_por_ingresso }]);
    setLoading(false);
    if (!error) onSuccess();
    else setErrorMsg('Erro ao registrar venda.');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
       <div className="relative w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl shadow-2xl p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><Ticket className="text-tiffany-green"/> Registrar Venda</h3>
          <p className="text-gray-500 text-sm mb-6">{event.nome_evento}</p>
          
          {errorMsg && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">{errorMsg}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="flex items-center gap-4 justify-between bg-dark-800 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQty(Math.max(1, qty-1))} className="w-10 h-10 bg-dark-900 border border-white/10 rounded-lg text-white hover:border-tiffany-green font-bold text-lg">-</button>
                  <span className="text-2xl font-bold text-white w-8 text-center">{qty}</span>
                  <button type="button" onClick={() => setQty(qty+1)} className="w-10 h-10 bg-dark-900 border border-white/10 rounded-lg text-white hover:border-tiffany-green font-bold text-lg">+</button>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-gray-500 uppercase font-bold">Comissão</span>
                  <span className="text-xl text-tiffany-green font-bold">R$ {qty * event.comissao_por_ingresso}</span>
                </div>
             </div>
             <Button fullWidth type="submit" disabled={loading} className="flex items-center justify-center gap-2">
                {loading ? 'Processando...' : <><CheckCircle2 size={18}/> Confirmar Venda</>}
             </Button>
          </form>
       </div>
    </div>
  );
};

const ClientHistoryModal = ({ user, onClose }: { user: User, onClose: () => void }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
        const { data } = await supabase
            .from('clientes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        if (data) setClients(data);
        setLoading(false);
    };
    fetchClients();
  }, [user.id]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-white/5 bg-dark-800 flex justify-between items-center">
             <h3 className="text-xl font-bold text-white flex items-center gap-2"><Users className="text-tiffany-green"/> Histórico de Clientes</h3>
             <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-white" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {loading ? (
                <div className="text-center py-8 text-gray-500 animate-pulse">Carregando dados...</div>
            ) : clients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhum cliente encontrado.</div>
            ) : (
                <div className="space-y-3">
                    {clients.map(client => (
                        <div key={client.id} className="bg-dark-800 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                            <div>
                                <p className="text-white font-bold">{client.nome_cliente}</p>
                                <p className="text-xs text-gray-500">{client.whatsapp}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${client.recorrente ? 'bg-tiffany-green/10 text-tiffany-green' : 'bg-white/5 text-gray-500'}`}>
                                    {client.recorrente ? 'Recorrente' : 'Novo'}
                                </span>
                                <p className="text-[10px] text-gray-600 mt-1">Cadastrado em {new Date(client.created_at || '').toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatCard = ({ icon, label, value, subtext, highlight = false, loading = false }: { icon: React.ReactNode, label: string, value: string, subtext?: string, highlight?: boolean, loading?: boolean }) => (
  <div className={`glass-card p-5 rounded-xl border transition-all hover:-translate-y-1 duration-300 ${highlight ? 'border-tiffany-green/30 bg-tiffany-dim' : 'border-white/5'}`}>
    <div className={`mb-3 ${highlight ? 'text-tiffany-green' : 'text-gray-400'}`}>
      {icon}
    </div>
    <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{label}</p>
    <div className="min-h-[32px]">
      {loading ? (
        <div className="h-8 w-24 bg-white/10 rounded animate-pulse"></div>
      ) : (
        <p className={`text-xl md:text-2xl font-bold ${highlight ? 'text-tiffany-green' : 'text-white'}`}>{value}</p>
      )}
    </div>
    {subtext && <p className="text-[10px] text-gray-500 mt-1">{subtext}</p>}
  </div>
);

const ActionButton = ({ icon, label, onClick, highlight = false }: { icon: React.ReactNode, label: string, onClick?: () => void, highlight?: boolean }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between p-4 rounded-xl border transition-all group w-full ${
      highlight 
        ? 'bg-tiffany-green/10 border-tiffany-green/50 hover:bg-tiffany-green/20 shadow-[0_0_15px_rgba(129,216,208,0.1)]' 
        : 'bg-dark-800 border-white/5 hover:bg-dark-700 hover:border-tiffany-green/30'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`${highlight ? 'text-tiffany-green' : 'text-gray-400 group-hover:text-tiffany-green'} transition-colors`}>{icon}</div>
      <span className={`font-bold text-sm ${highlight ? 'text-white' : 'text-gray-200'}`}>{label}</span>
    </div>
    <ChevronRight size={16} className={`${highlight ? 'text-tiffany-green' : 'text-gray-600 group-hover:text-white'}`} />
  </button>
);

const ProgressionBar = ({ currentLevel }: { currentLevel: string }) => {
  const levels = ['iniciante', 'intermediario', 'avancado', 'coordenador'];
  const currentIndex = levels.indexOf(currentLevel) >= 0 ? levels.indexOf(currentLevel) : 0;

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-tiffany-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
            <TrendingUp className="text-tiffany-green" />
            Evolução de Carreira
          </h3>
          <p className="text-gray-400 text-sm max-w-md">
            Desbloqueie níveis com <span className="text-gray-300 font-semibold">consistência, volume de vendas</span> e <span className="text-gray-300 font-semibold">crescimento da base</span>.
          </p>
        </div>
        <div className="text-right">
           <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Próximo Nível</span>
           <span className="text-tiffany-green font-bold text-lg uppercase flex items-center justify-end gap-2">
             {levels[currentIndex + 1] || 'Lenda'}
             <Info size={14} className="text-gray-600 cursor-help" />
           </span>
        </div>
      </div>

      <div className="relative mx-2">
        <div className="absolute top-1/2 left-0 w-full h-1.5 bg-dark-700 -translate-y-1/2 rounded-full"></div>
        
        <div 
          className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-tiffany-blue to-tiffany-green -translate-y-1/2 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(129,216,208,0.4)]"
          style={{ width: `${(currentIndex / (levels.length - 1)) * 100}%` }}
        ></div>

        <div className="relative flex justify-between w-full">
          {levels.map((level, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={level} className="flex flex-col items-center gap-3 group cursor-default">
                <div className={`w-5 h-5 rounded-full border-4 transition-all duration-500 z-10 flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-dark-900 border-tiffany-green shadow-[0_0_15px_rgba(129,216,208,0.6)] scale-110' 
                    : 'bg-dark-900 border-dark-600'
                }`}>
                  {isCompleted && <div className="w-1.5 h-1.5 bg-tiffany-green rounded-full"></div>}
                </div>
                <span className={`absolute -bottom-8 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  isCurrent ? 'text-tiffany-green' : isCompleted ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  {level}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-6"></div>
    </div>
  );
};