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

// Matches 'clientes' table
export interface Client {
  id: number;
  user_id: string;
  nome_cliente: string;
  whatsapp: string;
  preferencias?: string;
  recorrente: boolean;
  created_at?: string;
}

// Matches 'lista_convidados' (Experience Module)
export interface GuestEntry {
  id: number;
  event_id: number;
  client_id: number;
  user_id: string; // Promoter ID
  status: 'confirmado' | 'check_in' | 'nao_compareceu';
  check_in_time?: string;
  notes?: string; // Pre-party notes
  feedback?: string; // Post-party feedback
  classification?: 'alto_potencial' | 'recorrente' | 'ocasional';
  client?: Client; // Join
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

export type PageView = 'landing' | 'auth' | 'dashboard';