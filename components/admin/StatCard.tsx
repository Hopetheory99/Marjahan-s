import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  variant?: 'gold' | 'burgundy' | 'ivory';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  variant = 'ivory',
}) => {
  const variantClasses = {
    ivory:
      'bg-surface-2 text-brand-charcoal border-transparent hover:shadow-luxury-hover hover:border-brand-gold/20',
    gold: 'bg-gradient-gold text-white shadow-lg border-transparent',
    burgundy: 'bg-gradient-luxury text-white shadow-lg border-transparent',
  };

  const iconClasses = {
    ivory: 'bg-brand-burgundy/5 text-brand-burgundy',
    gold: 'bg-white/20 text-white',
    burgundy: 'bg-white/20 text-white',
  };

  return (
    <div
      className={`bento-card group flex flex-col justify-between h-full border ${variantClasses[variant]}`}
    >
      <div className="flex justify-between items-start">
        <div
          className={`p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${iconClasses[variant]}`}
        >
          <span className="text-2xl" role="img" aria-label={title}>
            {icon}
          </span>
        </div>
        {trend && (
          <div
            className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
              trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <p
          className={`text-sm tracking-wider uppercase opacity-70 font-semibold ${variant === 'ivory' ? 'text-brand-warm-gray' : 'text-white/80'}`}
        >
          {title}
        </p>
        <h3
          className={`text-3xl font-display mt-1 ${variant === 'ivory' ? 'text-brand-burgundy' : 'text-white'}`}
        >
          {value}
        </h3>
        {subtitle && <p className="text-xs mt-2 opacity-60 italic">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
