import React from 'react';
import { Crown, Shield, Sparkles } from 'lucide-react';
import { User, UserRole } from './types';

export interface RoleDisplayConfig {
  id: UserRole;
  label: string;
  icon: React.ReactNode;
  colors: {
    bg: string;
    text: string;
    border: string;
    hoverBorder: string;
    shadow: string;
    badgeText: string;
  };
  getDisplayName: (user: User) => string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleDisplayConfig> = {
  admin: {
    id: 'admin',
    label: 'Administrador',
    icon: <Crown size={12} strokeWidth={3} />,
    colors: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-500',
      border: 'border-yellow-500',
      hoverBorder: 'hover:border-yellow-500/50',
      shadow: 'shadow-yellow-500/20',
      badgeText: 'text-dark-900'
    },
    getDisplayName: () => 'Admin'
  },
  coordinator: {
    id: 'coordinator',
    label: 'RP Coordenador',
    icon: <Shield size={12} strokeWidth={3} />,
    colors: {
      bg: 'bg-blue-500',
      text: 'text-blue-500',
      border: 'border-blue-500',
      hoverBorder: 'hover:border-blue-500/50',
      shadow: 'shadow-blue-500/20',
      badgeText: 'text-dark-900'
    },
    getDisplayName: () => 'Liderança'
  },
  promoter: {
    id: 'promoter',
    label: 'RP',
    icon: <Sparkles size={12} strokeWidth={3} />,
    colors: {
      bg: 'bg-tiffany-green',
      text: 'text-tiffany-green',
      border: 'border-tiffany-green',
      hoverBorder: 'hover:border-tiffany-green/50',
      shadow: 'shadow-tiffany-green/20',
      badgeText: 'text-dark-900'
    },
    getDisplayName: (user) => `Nível: ${user.level}`
  }
};

export const getUserConfig = (user: User | null): RoleDisplayConfig => {
  if (!user || !user.role) return ROLE_CONFIGS.promoter;
  return ROLE_CONFIGS[user.role] || ROLE_CONFIGS.promoter;
};