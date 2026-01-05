import React, { useState, useEffect } from 'react';

const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-12 h-6 bg-gray-200 rounded-full p-1 transition-colors duration-300">
        <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300"></div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="relative w-12 h-6 bg-gradient-to-r from-brand-ivory to-brand-cream dark:from-dark-surface dark:to-dark-surface-elevated rounded-full p-1 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-bg touch-target group"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Background glow effect */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-lavender/20 to-brand-emerald/20 rounded-full blur-sm"></div>
      </div>

      {/* Toggle knob */}
      <div
        className={`relative w-4 h-4 bg-white dark:bg-dark-surface-elevated rounded-full shadow-lg transform transition-all duration-500 flex items-center justify-center ${
          isDark ? 'translate-x-6 rotate-180' : 'translate-x-0 rotate-0'
        }`}
      >
        {/* Sun icon */}
        <svg
          className={`w-3 h-3 text-yellow-500 transition-all duration-300 ${
            isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>

        {/* Moon icon */}
        <svg
          className={`w-3 h-3 text-blue-400 transition-all duration-300 ${
            isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-brand-gold rounded-full transition-all duration-700 ${
              isDark ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              top: `${20 + i * 10}%`,
              left: `${15 + i * 12}%`,
              animationDelay: `${i * 0.1}s`,
              animation: isDark ? 'twinkle 2s ease-in-out infinite' : 'none',
            }}
          />
        ))}
      </div>
    </button>
  );
};

export default DarkModeToggle;

// Add twinkle animation to global CSS if not already present
const style = document.createElement('style');
style.textContent = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
`;
document.head.appendChild(style);
