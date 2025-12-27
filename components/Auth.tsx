import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { ArrowLeft, User as UserIcon, Lock, Mail, Instagram, MessageCircle, MapPin, AlertCircle, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
  initialMode?: 'login' | 'register';
}

type AuthMode = 'login' | 'register' | 'forgot_password';

export const Auth: React.FC<AuthProps> = ({ onLogin, onBack, initialMode = 'login' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [level, setLevel] = useState<'iniciante' | 'intermediario' | 'avancado' | 'coordenador'>('iniciante');

  // Safe error logging helper
  const logError = (context: string, err: any) => {
    try {
      console.error(context, JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    } catch (e) {
      console.error(context, err);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Fetch Profile Data
        const { data: profileData, error: profileError } = await supabase
          .from('users_profile')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        // Use metadata as fallback if profile table is empty/missing
        const metadata = authData.user.user_metadata || {};

        const loggedInUser: User = {
          id: authData.user.id,
          name: profileData?.nome || metadata.name || 'Usuário',
          email: authData.user.email || '',
          role: profileData?.role || metadata.role || 'promoter',
          level: profileData?.nivel || metadata.level || 'iniciante',
          whatsapp: profileData?.whatsapp || metadata.whatsapp,
          instagram: profileData?.instagram || metadata.instagram,
          city: profileData?.cidade || metadata.city,
          // For LOGIN: Use DB value. If null/undefined (legacy), assume TRUE (completed) to skip it.
          onboarding_completed: profileData?.onboarding_completed ?? true 
        };
        
        onLogin(loggedInUser);
      }
    } catch (err: any) {
      logError("Login error details:", err);
      // Ensure error message is a string
      const errorMessage = err?.message || (typeof err === 'string' ? err : 'Erro ao fazer login. Verifique suas credenciais.');
      setError(errorMessage === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create Auth User AND Store Metadata (Fail-safe)
      // Storing data in metadata ensures that even if the secondary table insert fails,
      // we have the user data stored in the Auth object.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            whatsapp,
            instagram,
            city,
            role: 'promoter',
            level,
            onboarding_completed: false
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Attempt Create Profile Record (Best Effort)
        // We wrap this in a separate try/catch so it doesn't block the user if the table is missing
        try {
            const { error: profileError } = await supabase
            .from('users_profile')
            .insert([
                {
                id: authData.user.id,
                nome: name,
                email: email,
                whatsapp: whatsapp,
                instagram: instagram,
                cidade: city,
                role: 'promoter',
                nivel: level,
                onboarding_completed: false
                }
            ]);

            if (profileError) {
                // Ignore duplicate key error which might happen if a Trigger already created the user
                if (profileError.code !== '23505') { 
                   console.warn("Could not create users_profile record (likely missing table or RLS). Using Auth Metadata instead.", profileError);
                }
            }
        } catch (dbError) {
            console.warn("Database error ignored to allow login:", dbError);
        }

        const newUser: User = {
          id: authData.user.id,
          name,
          email: authData.user.email || '',
          role: 'promoter',
          level,
          whatsapp,
          instagram,
          city,
          onboarding_completed: false
        };
        onLogin(newUser);
      }
    } catch (err: any) {
      logError("Registration error:", err);
      let msg = err?.message || err?.error_description || 'Erro ao criar conta.';
      if (typeof msg !== 'string') msg = 'Erro desconhecido ao criar conta.';
      
      if (msg.includes('already registered')) {
          msg = 'Este e-mail já está cadastrado. Tente fazer login.';
      } else if (msg.includes('Database error saving new user')) {
          // This specific error comes from a failing trigger in the database
          msg = 'Erro interno do servidor (Database Trigger). Por favor, execute o script db_setup.sql no painel do Supabase para corrigir a base de dados.';
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) throw error;
      setSuccessMsg("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (err: any) {
      logError("Forgot password error:", err);
      setError(err?.message || "Erro ao enviar e-mail de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-4 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-tiffany-green/50 focus:bg-dark-800 focus:shadow-[0_0_15px_rgba(129,216,208,0.1)] transition-all duration-300 text-sm";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 peer-focus:text-tiffany-green transition-colors duration-300";

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-tiffany-blue/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-tiffany-green/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[480px]">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Voltar para home
        </button>

        <div className="glass-card p-8 md:p-12 rounded-3xl shadow-2xl border-t border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tiffany-green to-transparent opacity-50"></div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 text-white">
              {mode === 'login' && 'Acesse sua conta'}
              {mode === 'register' && 'Aplicação Afrovia'}
              {mode === 'forgot_password' && 'Recuperar Senha'}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
              {mode === 'login' && 'Acesse sua jornada no mercado de festas.'}
              {mode === 'register' && 'Seu crescimento começa com uma base bem construída.'}
              {mode === 'forgot_password' && 'Digite seu e-mail para receber as instruções.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-xs leading-relaxed animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
             <div className="mb-6 p-4 bg-green-500/5 border border-green-500/20 rounded-xl flex items-start gap-3 text-green-400 text-xs leading-relaxed animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5 animate-in fade-in">
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  className={`${inputClasses} peer`} 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className={iconClasses} />
              </div>
              <div className="relative group">
                <input 
                  type="password" 
                  placeholder="Senha" 
                  className={`${inputClasses} peer`} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className={iconClasses} />
              </div>
              
              <div className="flex justify-end pt-1">
                <button 
                  type="button" 
                  onClick={() => { setMode('forgot_password'); setError(null); }}
                  className="text-xs text-gray-500 hover:text-tiffany-green transition-colors font-medium"
                >
                  Esqueci minha senha
                </button>
              </div>

              <Button fullWidth type="submit" className="mt-2 text-dark-900 font-bold" disabled={loading}>
                {loading ? 'Acessando...' : 'Entrar na Plataforma'}
              </Button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Nome completo" 
                  className={`${inputClasses} peer`} 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <UserIcon className={iconClasses} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="@instagram" 
                    className={`${inputClasses} peer`} 
                    required 
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                  <Instagram className={iconClasses} />
                </div>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="WhatsApp" 
                    className={`${inputClasses} peer`} 
                    required 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                  <MessageCircle className={iconClasses} />
                </div>
              </div>

              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Cidade" 
                  className={`${inputClasses} peer`} 
                  required 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <MapPin className={iconClasses} />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold block ml-1">Nível atual</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="cursor-pointer relative group">
                    <input 
                      type="radio" 
                      name="level" 
                      className="peer sr-only" 
                      value="iniciante" 
                      checked={level === 'iniciante'}
                      onChange={() => setLevel('iniciante')}
                    />
                    <div className="h-full border border-white/10 bg-dark-800/50 rounded-xl p-4 peer-checked:border-tiffany-green peer-checked:bg-tiffany-dim/20 transition-all hover:bg-dark-800 flex flex-col items-center text-center gap-2">
                      <Sparkles size={20} className="text-gray-500 peer-checked:text-tiffany-green transition-colors" />
                      <div>
                        <span className="block text-sm font-bold text-gray-300 peer-checked:text-white mb-0.5">Iniciante</span>
                        <span className="block text-[10px] text-gray-500">Quero começar</span>
                      </div>
                    </div>
                  </label>

                  <label className="cursor-pointer relative group">
                    <input 
                      type="radio" 
                      name="level" 
                      className="peer sr-only" 
                      value="intermediario" 
                      checked={level === 'intermediario'}
                      onChange={() => setLevel('intermediario')}
                    />
                    <div className="h-full border border-white/10 bg-dark-800/50 rounded-xl p-4 peer-checked:border-tiffany-green peer-checked:bg-tiffany-dim/20 transition-all hover:bg-dark-800 flex flex-col items-center text-center gap-2">
                      <TrendingUp size={20} className="text-gray-500 peer-checked:text-tiffany-green transition-colors" />
                      <div>
                        <span className="block text-sm font-bold text-gray-300 peer-checked:text-white mb-0.5">Já sou RP</span>
                        <span className="block text-[10px] text-gray-500">Quero evoluir</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 mt-2">
                 <div className="relative group mb-4">
                  <input 
                    type="email" 
                    placeholder="E-mail de acesso" 
                    className={`${inputClasses} peer`} 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className={iconClasses} />
                </div>
                 <div className="relative group">
                  <input 
                    type="password" 
                    placeholder="Criar senha segura" 
                    className={`${inputClasses} peer`} 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className={iconClasses} />
                </div>
              </div>

              <Button fullWidth type="submit" className="mt-6 text-dark-900 font-bold" disabled={loading}>
                {loading ? 'Processando...' : 'Aplicar para Afrovia'}
              </Button>
            </form>
          )}

          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-5 animate-in fade-in">
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="E-mail cadastrado" 
                  className={`${inputClasses} peer`} 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className={iconClasses} />
              </div>
              
              <Button fullWidth type="submit" className="mt-2 text-dark-900 font-bold" disabled={loading}>
                {loading ? 'Enviando...' : 'Recuperar Senha'}
              </Button>

               <button 
                  type="button" 
                  onClick={() => { setMode('login'); setError(null); }}
                  className="w-full text-center text-xs text-gray-500 hover:text-white mt-4"
                >
                  Voltar para login
                </button>
            </form>
          )}

          <div className="mt-10 text-center">
            {mode === 'forgot_password' ? null : (
              <p className="text-gray-500 text-xs">
                {mode === 'login' ? 'Ainda não faz parte?' : 'Já possui conta?'}
                <button 
                  onClick={() => { 
                    setMode(mode === 'login' ? 'register' : 'login'); 
                    setError(null); 
                  }}
                  className="ml-2 text-white font-bold hover:text-tiffany-green transition-colors underline decoration-transparent hover:decoration-tiffany-green underline-offset-4"
                >
                  {mode === 'login' ? 'Aplicar agora' : 'Fazer Login'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};