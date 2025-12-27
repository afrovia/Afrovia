import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { LayoutDashboard, LogOut, Camera, Check } from 'lucide-react';
import { getUserConfig } from '../utils';

interface NavbarProps {
  onNavigate: (page: 'landing' | 'auth' | 'dashboard') => void;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-900/90 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}
          className="block h-10 md:h-12 transition-transform duration-300 ease-in-out hover:scale-105 flex items-center"
        >
          {!imgError ? (
            <img 
              src="logo.png" 
              alt="Afrovia" 
              className="h-full w-auto object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
             <div className="text-2xl font-bold tracking-widest uppercase flex items-center h-full">
              <span className="text-white">Afro</span>
              <span className="text-tiffany-green">via</span>
            </div>
          )}
        </a>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="relative group">
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                />
                <label 
                  htmlFor="avatar-upload" 
                  className={`block w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 transition-all duration-500 relative shadow-lg ${
                    uploadSuccess 
                      ? 'border-green-500 shadow-green-500/20 scale-110' 
                      : 'border-transparent hover:border-tiffany-green shadow-tiffany-green/10'
                  }`}
                >
                  {avatar ? (
                    <img src={avatar} alt="User Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-dark-800 flex items-center justify-center text-tiffany-green font-bold text-lg border border-white/10">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  {/* Upload Overlay (Hover) */}
                  <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${!uploadSuccess ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
                    <Camera size={14} className="text-white" />
                  </div>

                   {/* Success Overlay */}
                   <div className={`absolute inset-0 bg-green-500/30 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 ${uploadSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <Check size={16} className="text-white drop-shadow-md animate-bounce" />
                  </div>
                </label>

                {/* Role Badge Indicator */}
                {(() => {
                   const config = getUserConfig(user);
                   return (
                     <div 
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${config.colors.bg} ${config.colors.badgeText} flex items-center justify-center border-2 border-dark-900 z-10 shadow-sm transition-transform hover:scale-110`} 
                      title={config.label}
                     >
                       {config.icon}
                     </div>
                   );
                })()}
                
                {/* Optional Text Feedback Tooltip */}
                 <div className={`absolute top-full right-0 mt-2 bg-green-500 text-dark-900 text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none transition-all duration-300 transform ${uploadSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                  Foto atualizada!
                  <div className="absolute bottom-full right-4 border-4 border-transparent border-b-green-500"></div>
                </div>
              </div>

              <div className="h-6 w-px bg-white/10 hidden md:block"></div>

              <button 
                onClick={() => onNavigate('dashboard')}
                className="hidden md:flex items-center gap-2 text-sm font-medium text-white hover:text-tiffany-green transition-colors uppercase tracking-wider"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                title="Sair"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => onNavigate('auth')}
              className="text-sm font-medium text-white hover:text-tiffany-green transition-colors uppercase tracking-wider"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};