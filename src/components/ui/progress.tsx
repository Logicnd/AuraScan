'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indicatorClassName?: string;
  showValue?: boolean;
  variant?: 'default' | 'xp' | 'karma' | 'ethics';
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indicatorClassName, showValue, variant = 'default', ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const getVariantStyles = () => {
      switch (variant) {
        case 'xp':
          return {
            root: 'bg-secondary',
            indicator: 'bg-gradient-to-r from-xp-gold via-xp-gold/80 to-xp-gold/60',
          };
        case 'karma':
          return {
            root: 'bg-secondary',
            indicator: 'bg-gradient-to-r from-karma-negative via-karma-neutral to-karma-positive',
          };
        case 'ethics':
          return {
            root: 'bg-secondary',
            indicator: value >= 80
              ? 'bg-ethics-safe'
              : value >= 60
              ? 'bg-ethics-warning'
              : value >= 40
              ? 'bg-ethics-danger'
              : 'bg-ethics-critical',
          };
        default:
          return {
            root: 'bg-secondary',
            indicator: 'bg-primary',
          };
      }
    };

    const styles = getVariantStyles();

    return (
      <div className="relative w-full">
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(
            'relative h-3 w-full overflow-hidden rounded-full',
            styles.root,
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'h-full transition-all duration-500 ease-out',
              styles.indicator,
              indicatorClassName
            )}
            style={{ width: `${percentage}%` }}
          />
          {variant === 'xp' && (
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" 
              />
            </div>
          )}
        </div>
        {showValue && (
          <span className="absolute right-0 -top-5 text-xs font-medium text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);
Progress.displayName = 'Progress';

// XP Progress Bar Component
interface XPProgressProps {
  currentXP: number;
  xpToNextLevel: number;
  level: number;
  className?: string;
}

const XPProgress: React.FC<XPProgressProps> = ({
  currentXP,
  xpToNextLevel,
  level,
  className,
}) => {
  const percentage = (currentXP / xpToNextLevel) * 100;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-foreground">Level {level}</span>
        <span className="text-muted-foreground">
          {currentXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
        </span>
      </div>
      <Progress value={percentage} variant="xp" className="h-4" />
    </div>
  );
};

// Ethics Score Circle Component
interface EthicsScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const EthicsScoreCircle: React.FC<EthicsScoreCircleProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className,
}) => {
  const sizeStyles = {
    sm: { container: 'w-16 h-16', text: 'text-lg', label: 'text-[10px]' },
    md: { container: 'w-24 h-24', text: 'text-2xl', label: 'text-xs' },
    lg: { container: 'w-32 h-32', text: 'text-4xl', label: 'text-sm' },
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: 'stroke-ethics-safe', text: 'text-ethics-safe' };
    if (score >= 60) return { stroke: 'stroke-ethics-warning', text: 'text-ethics-warning' };
    if (score >= 40) return { stroke: 'stroke-ethics-danger', text: 'text-ethics-danger' };
    return { stroke: 'stroke-ethics-critical', text: 'text-ethics-critical' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Ethical';
    if (score >= 60) return 'Warning';
    if (score >= 40) return 'Danger';
    return 'Critical';
  };

  const colors = getScoreColor(score);
  const styles = sizeStyles[size];
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('relative flex items-center justify-center', styles.container, className)}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          className="stroke-secondary"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={cn(colors.stroke, 'transition-all duration-1000 ease-out')}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold', styles.text, colors.text)}>{Math.round(score)}</span>
        {showLabel && (
          <span className={cn('font-medium text-muted-foreground', styles.label)}>
            {getScoreLabel(score)}
          </span>
        )}
      </div>
    </div>
  );
};

// Streak Counter Component
interface StreakCounterProps {
  days: number;
  isActive?: boolean;
  className?: string;
}

const StreakCounter: React.FC<StreakCounterProps> = ({
  days,
  isActive = true,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center w-10 h-10 rounded-full',
          isActive
            ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
            : 'bg-secondary text-muted-foreground'
        )}
      >
        <span className="text-lg">🔥</span>
        {isActive && (
          <div className="absolute inset-0 rounded-full bg-orange-500/50 animate-ping" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-tight">{days}</span>
        <span className="text-xs text-muted-foreground">day streak</span>
      </div>
    </div>
  );
};

export { Progress, XPProgress, EthicsScoreCircle, StreakCounter };
export type { ProgressProps, XPProgressProps, EthicsScoreCircleProps, StreakCounterProps };
