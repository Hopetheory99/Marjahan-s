import React, { useState, useEffect, createContext, useContext } from 'react';
import { useToast } from '../context/ToastContext';

// Achievement types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: 'shopping' | 'social' | 'exploration' | 'loyalty';
}

// User progress context
interface UserProgress {
  level: number;
  experience: number;
  experienceToNext: number;
  totalPoints: number;
  achievements: Achievement[];
  streak: number;
  lastActive: Date;
}

const GamificationContext = createContext<{
  progress: UserProgress;
  unlockAchievement: (achievementId: string) => void;
  addExperience: (amount: number) => void;
  updateProgress: (action: string, value?: any) => void;
} | null>(null);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};

// Initial achievements
const initialAchievements: Achievement[] = [
  {
    id: 'first_purchase',
    title: 'First Sparkle',
    description: 'Complete your first purchase',
    icon: '💎',
    rarity: 'common',
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'shopping',
  },
  {
    id: 'wishlist_add',
    title: 'Dream Catcher',
    description: 'Add 5 items to your wishlist',
    icon: '💝',
    rarity: 'common',
    points: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: 'shopping',
  },
  {
    id: 'review_writer',
    title: 'Honest Critic',
    description: 'Write your first product review',
    icon: '📝',
    rarity: 'rare',
    points: 75,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'social',
  },
  {
    id: 'loyal_customer',
    title: 'Loyal Patron',
    description: 'Make 10 purchases',
    icon: '👑',
    rarity: 'epic',
    points: 500,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    category: 'loyalty',
  },
  {
    id: 'explorer',
    title: 'Treasure Hunter',
    description: 'View 20 different products',
    icon: '🔍',
    rarity: 'rare',
    points: 150,
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    category: 'exploration',
  },
  {
    id: 'social_sharer',
    title: 'Social Butterfly',
    description: 'Share a product on social media',
    icon: '🦋',
    rarity: 'rare',
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'social',
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Browse the store after midnight',
    icon: '🦉',
    rarity: 'epic',
    points: 200,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'exploration',
  },
  {
    id: 'big_spender',
    title: 'Big Spender',
    description: 'Spend $1000 in a single order',
    icon: '💰',
    rarity: 'legendary',
    points: 1000,
    unlocked: false,
    progress: 0,
    maxProgress: 1000,
    category: 'shopping',
  },
];

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('userProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        lastActive: new Date(parsed.lastActive),
      };
    }
    return {
      level: 1,
      experience: 0,
      experienceToNext: 1000,
      totalPoints: 0,
      achievements: initialAchievements,
      streak: 0,
      lastActive: new Date(),
    };
  });

  const { addToast } = useToast();

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(progress));
  }, [progress]);

  const unlockAchievement = (achievementId: string) => {
    setProgress((prev) => ({
      ...prev,
      achievements: prev.achievements.map((achievement) =>
        achievement.id === achievementId
          ? { ...achievement, unlocked: true, progress: achievement.maxProgress }
          : achievement,
      ),
      totalPoints:
        prev.totalPoints + (prev.achievements.find((a) => a.id === achievementId)?.points || 0),
    }));

    const achievement = progress.achievements.find((a) => a.id === achievementId);
    if (achievement) {
      addToast(`🏆 Achievement Unlocked: ${achievement.title}!`, 'success');
    }
  };

  const addExperience = (amount: number) => {
    setProgress((prev) => {
      const newExperience = prev.experience + amount;
      const newLevel = Math.floor(newExperience / 1000) + 1;
      const experienceToNext = newLevel * 1000 - newExperience;

      if (newLevel > prev.level) {
        addToast(`🎉 Level Up! You reached level ${newLevel}!`, 'success');
      }

      return {
        ...prev,
        experience: newExperience,
        level: newLevel,
        experienceToNext: Math.max(0, experienceToNext),
      };
    });
  };

  const updateProgress = (action: string, value?: any) => {
    switch (action) {
      case 'purchase':
        addExperience(100);
        updateAchievementProgress('first_purchase', 1);
        updateAchievementProgress('loyal_customer', 1);
        if (value >= 1000) {
          unlockAchievement('big_spender');
        }
        break;

      case 'add_to_wishlist':
        updateAchievementProgress('wishlist_add', 1);
        addExperience(10);
        break;

      case 'write_review':
        unlockAchievement('review_writer');
        addExperience(50);
        break;

      case 'view_product':
        updateAchievementProgress('explorer', 1);
        addExperience(5);
        break;

      case 'share_product':
        unlockAchievement('social_sharer');
        addExperience(25);
        break;

      case 'night_browse': {
        const hour = new Date().getHours();
        if (hour >= 0 && hour <= 6) {
          unlockAchievement('night_owl');
        }
        break;
      }

      case 'daily_login':
        // Update streak logic would go here
        addExperience(20);
        break;
    }
  };

  const updateAchievementProgress = (achievementId: string, increment: number) => {
    setProgress((prev) => ({
      ...prev,
      achievements: prev.achievements.map((achievement) => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          const newProgress = Math.min(achievement.progress + increment, achievement.maxProgress);
          if (newProgress >= achievement.maxProgress) {
            // Unlock achievement after a delay for better UX
            setTimeout(() => unlockAchievement(achievementId), 1000);
          }
          return { ...achievement, progress: newProgress };
        }
        return achievement;
      }),
    }));
  };

  return (
    <GamificationContext.Provider
      value={{ progress, unlockAchievement, addExperience, updateProgress }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

// Achievement notification component
export const AchievementNotification: React.FC<{
  achievement: Achievement;
  onClose: () => void;
}> = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm transform transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white p-4 rounded-xl shadow-2xl border border-white/20`}
      >
        <div className="flex items-start space-x-3">
          <div className="text-3xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">{achievement.title}</h4>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 500);
                }}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-white/90 text-sm mb-2">{achievement.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full capitalize">
                {achievement.rarity}
              </span>
              <span className="text-sm font-medium">+{achievement.points} points</span>
            </div>
          </div>
        </div>

        {/* Celebration particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-ping"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Progress dashboard component
export const ProgressDashboard: React.FC = () => {
  const { progress } = useGamification();
  const [showAchievements, setShowAchievements] = useState(false);

  const experiencePercentage = (progress.experience % 1000) / 10;

  return (
    <div className="bg-white dark:bg-dark-surface border border-brand-cream dark:border-dark-border rounded-xl p-6 shadow-glass">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif text-brand-charcoal dark:text-dark-text">
          Your Progress
        </h3>
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className="text-brand-gold hover:text-brand-gold-light transition-colors"
        >
          {showAchievements ? 'Hide' : 'Show'} Achievements
        </button>
      </div>

      {/* Level and Experience */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-brand-charcoal dark:text-dark-text">
            Level {progress.level}
          </span>
          <span className="text-sm text-brand-warm-gray dark:text-dark-text-secondary">
            {progress.experience % 1000}/{progress.experienceToNext + (progress.experience % 1000)}{' '}
            XP
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-brand-gold to-brand-burgundy h-3 rounded-full transition-all duration-1000"
            style={{ width: `${experiencePercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-brand-burgundy dark:text-brand-rose">
            {progress.totalPoints}
          </div>
          <div className="text-sm text-brand-warm-gray dark:text-dark-text-secondary">
            Total Points
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-brand-gold">{progress.streak}</div>
          <div className="text-sm text-brand-warm-gray dark:text-dark-text-secondary">
            Day Streak
          </div>
        </div>
      </div>

      {/* Achievements */}
      {showAchievements && (
        <div className="space-y-3">
          <h4 className="font-medium text-brand-charcoal dark:text-dark-text">Achievements</h4>
          <div className="grid gap-3 max-h-60 overflow-y-auto">
            {progress.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? 'bg-brand-gold/10 border-brand-gold/30'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5
                      className={`font-medium ${achievement.unlocked ? 'text-brand-charcoal dark:text-dark-text' : 'text-gray-500'}`}
                    >
                      {achievement.title}
                    </h5>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        achievement.unlocked
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {achievement.unlocked
                        ? 'Unlocked'
                        : `${achievement.progress}/${achievement.maxProgress}`}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${achievement.unlocked ? 'text-brand-warm-gray dark:text-dark-text-secondary' : 'text-gray-400'}`}
                  >
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`text-xs capitalize px-2 py-1 rounded ${
                        achievement.rarity === 'legendary'
                          ? 'bg-yellow-100 text-yellow-800'
                          : achievement.rarity === 'epic'
                            ? 'bg-purple-100 text-purple-800'
                            : achievement.rarity === 'rare'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {achievement.rarity}
                    </span>
                    <span className="text-xs text-brand-gold font-medium">
                      +{achievement.points} pts
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Level up celebration component
export const LevelUpCelebration: React.FC<{
  newLevel: number;
  onClose: () => void;
}> = ({ newLevel, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center">
        {/* Animated level badge */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <div className="text-4xl font-bold text-brand-charcoal">{newLevel}</div>
          </div>

          {/* Level text */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark-surface px-4 py-2 rounded-full shadow-lg">
            <span className="text-lg font-bold text-brand-burgundy">LEVEL UP!</span>
          </div>
        </div>

        <h2 className="text-2xl font-serif text-white mb-4">Congratulations!</h2>
        <p className="text-white/90 mb-8">You&apos;ve reached level {newLevel}!</p>

        {/* Firework effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full animate-ping"
              style={{
                left: `${10 + i * 7}%`,
                top: `${20 + (i % 4) * 15}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Points animation component
export const PointsAnimation: React.FC<{
  points: number;
  position: { x: number; y: number };
  onComplete: () => void;
}> = ({ points, position, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed z-50 pointer-events-none transform transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="bg-brand-gold text-white px-3 py-2 rounded-full shadow-lg animate-bounce">
        <span className="font-bold">+{points} XP</span>
      </div>
    </div>
  );
};

export default GamificationProvider;
