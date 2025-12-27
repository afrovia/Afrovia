import React from 'react';

export interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export interface FeatureItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export type UserRole = 'promoter' | 'coordinator' | 'admin';

// Matches 'users_profile' table
export interface User {
  id?: string; // UUID from auth
  name: string;
  email: string;
  role: UserRole;
  level: 'iniciante' | 'intermediario' | 'avancado' | 'coordenador';
  whatsapp?: string;
  instagram?: string;
  city?: string;
  active?: boolean; // New field for Admin control
  onboarding_completed?: boolean; // Track if user finished introduction
}

// Matches 'eventos' table
export interface Event {
  id: number;
  nome_evento: string;
  data_evento: string;
  comissao_por_ingresso: number;
  status: 'ativo' | 'encerrado' | 'upcoming';
  created_at?: string;
}

// Matches 'vendas' table
export interface Sale {
  id: number;
  user_id: string;
  evento_id: number;
  quantidade: number;
  valor_comissao: number;
  created_at?: string;
}

// Matches 'clientes' table - ATUALIZADO
export interface Client {
  id: number;
  user_id: string;
  nome_cliente: string; // nome_completo
  apelido?: string;
  whatsapp: string;
  instagram?: string;
  seguidores?: number;
  genero?: 'masculino' | 'feminino' | 'outro';
  
  // Consumption Profile
  genero_musical?: string[]; // Array of strings
  tipo_festa_frequente?: 'open_bar' | 'open_format' | 'balada_genero_especifico' | 'camarote_evento_premium' | 'outro';
  ticket_medio_gasto?: 'baixo' | 'medio' | 'alto';
  
  // Strategic Classification
  nivel_cliente: 'frio' | 'medio' | 'quente' | 'vip';
  
  recorrente: boolean;
  preferencias?: string; // Obs gerais
  created_at?: string;
}

// Matches 'lista_convidados' (Experience Module + Pós Evento)
export interface GuestEntry {
  id: number;
  event_id: number;
  client_id: number;
  user_id: string; // Promoter ID
  status: 'confirmado' | 'check_in' | 'nao_compareceu';
  
  // Post Event Fields
  pos_evento_concluido: boolean;
  comprou_ingresso?: boolean;
  origem_compra?: 'rp' | 'amigo' | 'bilheteria' | 'outro';
  acompanhado_por?: 'sozinho' | 'amigos' | 'grupo';
  feedback_texto?: string;
  avaliacao_geral?: number; // 1-5
  tags_feedback?: string[]; // JSON array in DB

  check_in_time?: string;
  client?: Client; // Join
  event?: Event; // Join
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

export type PageView = 'landing' | 'auth' | 'dashboard';