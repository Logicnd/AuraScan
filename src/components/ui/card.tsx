'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-xl border bg-card text-card-foreground transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'shadow-sm hover:shadow-md',
        elevated: 'shadow-lg hover:shadow-xl',
        outline: 'border-2',
        ghost: 'border-transparent bg-transparent',
        glass: 'glass',
        ethics: 'border-2 hover:border-primary/50',
        gamification:
          'border-2 bg-gradient-to-br from-card to-muted/30 shadow-lg hover:scale-[1.02]',
        quest:
          'border-2 bg-gradient-to-br from-card to-card/50 hover:border-primary/50',
        achievement:
          'bg-gradient-to-br from-xp-gold/10 to-transparent border-2 border-xp-gold/30',
        neon: 'border-2 border-neon-cyan/50 bg-black/20 backdrop-blur-sm shadow-neon-cyan/20',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
      interactive: {
        true: 'cursor-pointer active:scale-[0.98]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      interactive: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, onClick, ...props }, ref) => {
    const interactiveProps = interactive && onClick ? {
      role: 'button',
      tabIndex: 0,
      onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e as any);
        }
      },
    } : {};

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, interactive, className }))}
        onClick={onClick}
        {...interactiveProps}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}) => {
  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.direction === 'up') return 'text-ethics-safe';
    if (trend.direction === 'down') return 'text-ethics-danger';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.direction === 'up') return '↑';
    if (trend.direction === 'down') return '↓';
    return '→';
  };

  return (
    <Card variant="default" padding="sm" className={className}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-gradient">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className={cn('text-xs font-medium', getTrendColor())}>
              {getTrendIcon()} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        )}
      </div>
    </Card>
  );
};

// Quest Card Component
interface QuestCardProps {
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
  karmaReward?: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  isCompleted?: boolean;
  onClaim?: () => void;
  className?: string;
}

const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  progress,
  maxProgress,
  xpReward,
  karmaReward,
  difficulty,
  isCompleted,
  onClaim,
  className,
}) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'bg-ethics-safe/20 text-ethics-safe';
      case 'medium':
        return 'bg-ethics-warning/20 text-ethics-warning';
      case 'hard':
        return 'bg-ethics-danger/20 text-ethics-danger';
      case 'expert':
        return 'bg-neon-purple/20 text-neon-purple';
    }
  };

  const percentage = (progress / maxProgress) * 100;

  return (
    <Card
      variant="quest"
      padding="sm"
      className={cn(isCompleted && 'border-ethics-safe bg-ethics-safe/5', className)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium capitalize',
              getDifficultyColor()
            )}
          >
            {difficulty}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {progress} / {maxProgress}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500',
                isCompleted ? 'bg-ethics-safe' : 'bg-primary'
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-xp-gold font-medium">+{xpReward} XP</span>
            {karmaReward && (
              <span className="text-karma-positive font-medium">
                +{karmaReward} Karma
              </span>
            )}
          </div>
          {isCompleted && onClaim && (
            <button
              onClick={onClaim}
              className="px-3 py-1 text-sm font-medium rounded-lg bg-ethics-safe text-white hover:bg-ethics-safe/90 transition-colors"
            >
              Claim
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Achievement Card Component
interface AchievementCardProps {
  name: string;
  description: string;
  iconUrl?: string;
  icon?: React.ReactNode;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  progress?: number;
  maxProgress?: number;
  isUnlocked?: boolean;
  unlockedAt?: Date;
  className?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  name,
  description,
  icon,
  tier,
  progress,
  maxProgress,
  isUnlocked,
  unlockedAt,
  className,
}) => {
  const getTierStyles = () => {
    switch (tier) {
      case 'bronze':
        return 'from-xp-bronze/30 to-xp-bronze/10 border-xp-bronze/50';
      case 'silver':
        return 'from-xp-silver/30 to-xp-silver/10 border-xp-silver/50';
      case 'gold':
        return 'from-xp-gold/30 to-xp-gold/10 border-xp-gold/50';
      case 'platinum':
        return 'from-xp-platinum/30 to-xp-platinum/10 border-xp-platinum/50';
      case 'diamond':
        return 'from-xp-diamond/30 to-xp-diamond/10 border-xp-diamond/50';
    }
  };

  return (
    <Card
      className={cn(
        'border-2 bg-gradient-to-br',
        getTierStyles(),
        !isUnlocked && 'opacity-50 grayscale',
        className
      )}
      padding="sm"
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
            isUnlocked ? 'animate-badge-unlock' : ''
          )}
        >
          {icon || '🏆'}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">{name}</h4>
          <p className="text-sm text-muted-foreground truncate">{description}</p>
          {!isUnlocked && progress !== undefined && maxProgress !== undefined && (
            <div className="mt-2">
              <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/50 transition-all"
                  style={{ width: `${(progress / maxProgress) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {progress} / {maxProgress}
              </p>
            </div>
          )}
          {isUnlocked && unlockedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  StatsCard,
  QuestCard,
  AchievementCard,
};
