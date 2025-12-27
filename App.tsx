import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { TargetAudience } from './components/TargetAudience';
import { HowItWorks } from './components/HowItWorks';
import { Differentiators } from './components/Differentiators';
import { FooterCTA } from './components/FooterCTA';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { User, PageView } from './types';
import { supabase } from './supabaseClient';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Helper to fetch profile data from the database
  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Handle case where table is missing (42P01) or other DB errors gracefully
        // allowing the user to still log in with basic features.
        if (error.code === '42P01') {
           console.warn("Database table 'users_profile' not found. Please run the migration SQL.");
        } else if (error.code !== 'PGRST116') {
           console.warn("Error fetching profile:", error.message);
        }

        // Return basic user structure so the app doesn't crash
        // Assume existing users without profile data (legacy) have completed onboarding
        return {
          id: userId,
          name: 'Usuário',
          email: email,
          role: 'promoter',
          level: 'iniciante',
          onboarding_completed: true 
        } as User;
      }

      return {
        id: data.id,
        name: data.nome,
        email: data.email,
        role: data.role,
        level: data.nivel,
        whatsapp: data.whatsapp,
        instagram: data.instagram,
        city: data.cidade,
        // If the column is null (legacy user before migration), treat as TRUE (completed)
        onboarding_completed: data.onboarding_completed ?? true
      } as User;
    } catch (e) {
      console.error("Unexpected error fetching profile:", e);
      return {
          id: userId,
          name: 'Usuário',
          email: email,
          role: 'promoter',
          level: 'iniciante',
          onboarding_completed: true 
      } as User;
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id, session.user.email || '');
        if (userProfile) {
          setUser(userProfile);
          setCurrentPage('dashboard');
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Fetch fresh profile data on auth state change
        const userProfile = await fetchUserProfile(session.user.id, session.user.email || '');
        if (userProfile) {
          setUser(userProfile);
          // Only redirect to dashboard if we are currently on auth or landing
          setCurrentPage((prev) => (prev === 'auth' ? 'dashboard' : prev));
        }
      } else {
        setUser(null);
        setCurrentPage('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // State handled by onAuthStateChange
  };

  const navigateTo = (page: PageView) => {
    // Prevent going to dashboard if not logged in
    if (page === 'dashboard' && !user) {
      setAuthMode('login');
      setCurrentPage('auth');
      return;
    }
    if (page === 'auth') {
      setAuthMode('login');
    }
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-tiffany-green border-t-transparent animate-spin"></div>
          <span className="text-tiffany-green font-bold animate-pulse">Carregando Afrovia...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-white selection:bg-tiffany-green selection:text-dark-900 bg-dark-900 min-h-screen">
      {currentPage !== 'auth' && (
        <Navbar 
          onNavigate={navigateTo} 
          user={user} 
          onLogout={handleLogout} 
        />
      )}

      {currentPage === 'landing' && (
        <main>
          <Hero onRegister={() => {
            setAuthMode('register');
            setCurrentPage('auth');
          }} />
          <About />
          <TargetAudience />
          <HowItWorks />
          <Differentiators />
          <FooterCTA onApply={() => {
            setAuthMode('register');
            setCurrentPage('auth');
          }} />
        </main>
      )}

      {currentPage === 'auth' && (
        <Auth 
          onLogin={handleLogin} 
          onBack={() => setCurrentPage('landing')} 
          initialMode={authMode}
        />
      )}

      {currentPage === 'dashboard' && user && (
        <Dashboard user={user} />
      )}
    </div>
  );
}

export default App;