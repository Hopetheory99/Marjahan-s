import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'luxury' | 'luxury-outline';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'luxury',
  fullWidth = false,
  size = 'md',
  className = '',
  loading = false,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-5 py-2 text-xs',
    md: 'px-8 py-3 text-sm',
    lg: 'px-10 py-4 text-sm',
  };

  const baseStyles = `
    font-sans font-medium tracking-wider uppercase 
    transition-all duration-500 ease-luxury
    disabled:opacity-50 disabled:cursor-not-allowed 
    focus:outline-none focus:ring-2 focus:ring-brand-gold/50
    relative overflow-hidden
  `;

  const variantStyles = {
    primary: `
      bg-brand-charcoal text-white 
      hover:bg-brand-burgundy hover:shadow-luxury
    `,
    secondary: `
      bg-transparent text-brand-charcoal border-2 border-brand-charcoal 
      hover:bg-brand-charcoal hover:text-white
    `,
    luxury: `
      bg-brand-burgundy text-white border-2 border-brand-burgundy
      hover:bg-brand-burgundy-light hover:shadow-luxury-hover
    `,
    'luxury-outline': `
      bg-transparent text-brand-burgundy border-2 border-brand-burgundy
      hover:bg-brand-burgundy hover:text-white
    `,
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`
        .trim()
        .replace(/\s+/g, ' ')}
      {...props}
    >
      {/* Shine effect on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      {/* Button content */}
      <span className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
    </button>
  );
};

export default Button;
