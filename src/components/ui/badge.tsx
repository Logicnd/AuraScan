'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // Ethics variants
        safe: 'border-ethics-safe/50 bg-ethics-safe/20 text-ethics-safe',
        warning: 'border-ethics-warning/50 bg-ethics-warning/20 text-ethics-warning',
        danger: 'border-ethics-danger/50 bg-ethics-danger/20 text-ethics-danger',
        critical: 'border-ethics-critical/50 bg-ethics-critical/20 text-ethics-critical',
        // XP tier variants
        bronze: 'border-xp-bronze/50 bg-xp-bronze/20 text-xp-bronze',
        silver: 'border-xp-silver/50 bg-xp-silver/20 text-xp-silver dark:text-xp-silver',
        gold: 'border-xp-gold/50 bg-xp-gold/20 text-xp-gold',
        platinum: 'border-xp-platinum/50 bg-xp-platinum/20 text-xp-platinum dark:text-white',
        diamond: 'border-xp-diamond/50 bg-xp-diamond/20 text-xp-diamond',
        // Rarity variants
        common: 'border-gray-400/50 bg-gray-400/20 text-gray-600 dark:text-gray-300',
        uncommon: 'border-green-500/50 bg-green-500/20 text-green-600 dark:text-green-400',
        rare: 'border-blue-500/50 bg-blue-500/20 text-blue-600 dark:text-blue-400',
        epic: 'border-purple-500/50 bg-purple-500/20 text-purple-600 dark:text-purple-400',
        legendary: 'border-orange-500/50 bg-orange-500/20 text-orange-600 dark:text-orange-400',
        // Neon variants
        neon: 'border-neon-cyan/50 bg-neon-cyan/20 text-neon-cyan',
        'neon-green': 'border-neon-green/50 bg-neon-green/20 text-neon-green',
        'neon-purple': 'border-neon-purple/50 bg-neon-purple/20 text-neon-purple',
        // Karma variants
        karma: 'border-karma-positive/50 bg-karma-positive/20 text-karma-positive',
        // Verified badge
        verified: 'border-blue-500/50 bg-blue-500/20 text-blue-600 dark:text-blue-400',
      },
      size: {
        default: 'text-xs px-2.5 py-0.5',
        sm: 'text-[10px] px-2 py-0.5',
        lg: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon}
      {children}
    </div>
  );
}

// Level Badge Component
interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'default' | 'lg';
  showFire?: boolean;
  className?: string;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = 'default',
  showFire = false,
  className,
}) => {
  const getTierFromLevel = () => {
    if (level <= 10) return 'bronze';
    if (level <= 25) return 'silver';
    if (level <= 50) return 'gold';
    if (level <= 75) return 'platinum';
    return 'diamond';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'min-w-[1.5rem] h-6 text-xs px-1.5';
      case 'lg':
        return 'min-w-[2.5rem] h-10 text-base px-3';
      default:
        return 'min-w-[2rem] h-8 text-sm px-2';
    }
  };

  const tier = getTierFromLevel();

  return (
    <div className={cn('relative inline-flex', className)}>
      <Badge
        variant={tier}
        className={cn(
          'font-bold rounded-full flex items-center justify-center',
          getSizeClasses()
        )}
      >
        {level}
      </Badge>
      {showFire && level > 1 && (
        <span className="absolute -top-1 -right-1 text-sm animate-pulse">🔥</span>
      )}
    </div>
  );
};

// Streak Badge Component
interface StreakBadgeProps {
  days: number;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({
  days,
  size = 'default',
  className,
}) => {
  const getStreakTier = () => {
    if (days >= 100) return { emoji: '💎', variant: 'diamond' as const };
    if (days >= 60) return { emoji: '🔥', variant: 'gold' as const };
    if (days >= 30) return { emoji: '⚡', variant: 'silver' as const };
    if (days >= 7) return { emoji: '✨', variant: 'bronze' as const };
    return { emoji: '🌱', variant: 'default' as const };
  };

  const { emoji, variant } = getStreakTier();

  return (
    <Badge variant={variant} size={size} className={className}>
      <span>{emoji}</span>
      <span>{days} day{days !== 1 ? 's' : ''}</span>
    </Badge>
  );
};

// Verified Badge Component
interface VerifiedBadgeProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 'default', className }) => {
  return (
    <Badge variant="verified" size={size} className={className}>
      <svg
        className="w-3 h-3"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Verified</span>
    </Badge>
  );
};

// XP Badge Component
interface XPBadgeProps {
  amount: number;
  isBonus?: boolean;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const XPBadge: React.FC<XPBadgeProps> = ({
  amount,
  isBonus = false,
  size = 'default',
  className,
}) => {
  return (
    <Badge
      variant="gold"
      size={size}
      className={cn(isBonus && 'animate-pulse', className)}
    >
      {isBonus && '🎁 '}
      +{amount.toLocaleString()} XP
    </Badge>
  );
};

// Karma Badge Component
interface KarmaBadgeProps {
  amount: number;
  type?: 'earned' | 'spent';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const KarmaBadge: React.FC<KarmaBadgeProps> = ({
  amount,
  type = 'earned',
  size = 'default',
  className,
}) => {
  return (
    <Badge variant="karma" size={size} className={className}>
      {type === 'earned' ? '+' : '-'}
      {amount.toLocaleString()} Karma
    </Badge>
  );
};

// Ethics Score Badge
interface EthicsScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const EthicsScoreBadge: React.FC<EthicsScoreBadgeProps> = ({
  score,
  showLabel = true,
  size = 'default',
  className,
}) => {
  const getVariant = () => {
    if (score >= 80) return 'safe';
    if (score >= 60) return 'warning';
    if (score >= 40) return 'danger';
    return 'critical';
  };

  const getLabel = () => {
    if (score >= 80) return 'Ethical';
    if (score >= 60) return 'Review';
    if (score >= 40) return 'Concerning';
    return 'Critical';
  };

  return (
    <Badge variant={getVariant()} size={size} className={className}>
      <span className="font-bold">{Math.round(score)}</span>
      {showLabel && <span>· {getLabel()}</span>}
    </Badge>
  );
};

// Rarity Badge Component
interface RarityBadgeProps {
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const RarityBadge: React.FC<RarityBadgeProps> = ({
  rarity,
  size = 'default',
  className,
}) => {
  return (
    <Badge variant={rarity} size={size} className={cn('capitalize', className)}>
      {rarity}
    </Badge>
  );
};

export {
  Badge,
  badgeVariants,
  LevelBadge,
  StreakBadge,
  VerifiedBadge,
  XPBadge,
  KarmaBadge,
  EthicsScoreBadge,
  RarityBadge,
};
