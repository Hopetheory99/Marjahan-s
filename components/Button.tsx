import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    gold: 'btn-gold',
  };

  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed relative`}
      disabled={loading || props.disabled}
      {...props}
    >
<<<<<<< HEAD
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
=======
      {/* Shine effect on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      {/* Button content */}
      <span
        className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}
      >
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
<<<<<<< HEAD
            />
=======
            ></circle>
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
<<<<<<< HEAD
            />
=======
            ></path>
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
          </svg>
        </span>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>{children}</span>
    </button>
  );
};

export default Button;
