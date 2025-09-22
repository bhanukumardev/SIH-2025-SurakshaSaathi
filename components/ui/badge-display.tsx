'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/lib/hooks';

interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  isNew?: boolean;
}

const BADGE_DEFINITIONS: Record<string, { name: string; description: string; icon: string }> = {
  'module-master-all': {
    name: 'Module Master',
    description: 'Completed all safety modules with passing scores',
    icon: '🏆'
  },
  'drill-champion-5': {
    name: 'Drill Champion (5)',
    description: 'Participated in 5 safety drills',
    icon: '🎯'
  },
  'drill-champion-10': {
    name: 'Drill Champion (10)',
    description: 'Participated in 10 safety drills',
    icon: '🎖️'
  },
  'drill-champion-25': {
    name: 'Drill Champion (25)',
    description: 'Participated in 25 safety drills',
    icon: '👑'
  },
  'streak-star-5': {
    name: 'Streak Star (5)',
    description: 'Maintained a 5-day login streak',
    icon: '⭐'
  },
  'streak-star-10': {
    name: 'Streak Star (10)',
    description: 'Maintained a 10-day login streak',
    icon: '🌟'
  },
  'streak-star-30': {
    name: 'Streak Star (30)',
    description: 'Maintained a 30-day login streak',
    icon: '💫'
  },
  'top-scorer': {
    name: 'Top Scorer',
    description: 'Achieved 90%+ average across all modules',
    icon: '🎓'
  }
};

export default function BadgeDisplay() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<BadgeInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBadges() {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/user/${user.id}/badges`);
        if (response.ok) {
          const data = await response.json();
          const earnedBadges = data.badges || [];

          // Create badge info array with all possible badges
          const allBadges: BadgeInfo[] = Object.entries(BADGE_DEFINITIONS).map(([id, info]) => ({
            id,
            name: info.name,
            description: info.description,
            icon: info.icon,
            earned: earnedBadges.includes(id),
            isNew: false // This would need to be determined by comparing with previous badges
          }));

          setBadges(allBadges);
        }
      } catch (error) {
        console.error('Failed to fetch badges:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBadges();
  }, [user?.id]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🏅 Badges</CardTitle>
          <CardDescription>Loading your achievements...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏅 Badges
          {earnedBadges.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {earnedBadges.length}/{badges.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {earnedBadges.length > 0
            ? `You've earned ${earnedBadges.length} out of ${badges.length} badges!`
            : 'Complete challenges to earn badges and showcase your safety knowledge!'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2">Earned Badges</h4>
              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  {earnedBadges.map((badge) => (
                    <Tooltip key={badge.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={`relative p-3 rounded-full text-2xl cursor-pointer transition-all duration-300 hover:scale-110 ${
                            badge.isNew ? 'animate-bounce ring-2 ring-yellow-400' : ''
                          }`}
                          style={{ backgroundColor: badge.isNew ? '#fef3c7' : '#dcfce7' }}
                        >
                          {badge.icon}
                          {badge.isNew && (
                            <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                              New!
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <div className="font-semibold">{badge.name}</div>
                          <div className="text-sm text-gray-600">{badge.description}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>
          )}

          {/* Unearned Badges */}
          {unearnedBadges.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Available Badges</h4>
              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  {unearnedBadges.map((badge) => (
                    <Tooltip key={badge.id}>
                      <TooltipTrigger asChild>
                        <div
                          className="relative p-3 rounded-full text-2xl cursor-pointer opacity-30 grayscale transition-all duration-300 hover:opacity-50 hover:grayscale-0"
                          style={{ backgroundColor: '#f3f4f6' }}
                        >
                          {badge.icon}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <div className="font-semibold">{badge.name}</div>
                          <div className="text-sm text-gray-600">{badge.description}</div>
                          <div className="text-xs text-gray-500 mt-1">🔒 Locked</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
