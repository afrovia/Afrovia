import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-8 py-4 rounded-full font-bold transition-all duration-300 tracking-wide text-sm uppercase transform hover:-translate-y-1";
  
  const variants = {
    primary: "bg-gradient-to-r from-tiffany-blue to-tiffany-green text-dark-900 shadow-[0_0_20px_rgba(129,216,208,0.3)] hover:shadow-[0_0_30px_rgba(129,216,208,0.5)]",
    outline: "border border-tiffany-green text-tiffany-green hover:bg-tiffany-green hover:text-dark-900"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};