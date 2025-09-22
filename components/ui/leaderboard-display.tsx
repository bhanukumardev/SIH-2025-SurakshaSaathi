'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/lib/hooks';

interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
}

interface UserRank {
  rank: number;
  score: number;
  totalUsers: number;
}

const RANK_ICONS = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
  4: '🏅',
  5: '🎖️'
};

const RANK_COLORS = {
  1: 'text-yellow-600',
  2: 'text-gray-400',
  3: 'text-amber-600',
  4: 'text-blue-600',
  5: 'text-purple-600'
};

export default function LeaderboardDisplay() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch('/api/leaderboard');
        if (response.ok) {
          const data = await response.json();

          setLeaderboard(data);

          // Find user's rank
          if (user?.id) {
            const userEntry = data.find((entry: LeaderboardEntry) => entry.userId === user.id);
            if (userEntry) {
              const rank = data.findIndex((entry: LeaderboardEntry) => entry.userId === user.id) + 1;
              setUserRank({
                rank,
                score: userEntry.score,
                totalUsers: data.length
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [user?.id]);

  const getRankIcon = (rank: number) => {
    return RANK_ICONS[rank as keyof typeof RANK_ICONS] || '🏆';
  };

  const getRankColor = (rank: number) => {
    return RANK_COLORS[rank as keyof typeof RANK_COLORS] || 'text-gray-600';
  };

  const getRankSuffix = (rank: number) => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🏆 Leaderboard</CardTitle>
          <CardDescription>Loading rankings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-100 rounded animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const topFive = leaderboard.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🏆 Leaderboard
            {userRank && (
              <Badge variant="outline" className="ml-2">
                Rank #{userRank.rank}
              </Badge>
            )}
          </span>
          <Dialog open={showFullLeaderboard} onOpenChange={setShowFullLeaderboard}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View Full
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Full Leaderboard</DialogTitle>
                <DialogDescription>
                  Complete rankings of all users
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrentUser = entry.userId === user?.id;

                  return (
                    <div
                      key={entry.userId}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isCurrentUser
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`text-xl ${getRankColor(rank)}`}>
                        {getRankIcon(rank)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {entry.name}
                            {isCurrentUser && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                You
                              </Badge>
                            )}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {rank}{getRankSuffix(rank)} place • {entry.score} points
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          {userRank
            ? `You're ranked ${userRank.rank}${getRankSuffix(userRank.rank)} out of ${userRank.totalUsers} users with ${userRank.score} points!`
            : 'Complete safety modules and drills to climb the leaderboard!'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {topFive.length > 0 ? (
            topFive.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.userId === user?.id;

              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isCurrentUser
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-lg ${getRankColor(rank)}`}>
                    {getRankIcon(rank)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {entry.name}
                        {isCurrentUser && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            You
                          </Badge>
                        )}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {entry.score} points
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-gray-500">
              No leaderboard data available yet
            </div>
          )}
        </div>

        {userRank && userRank.rank > 5 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800">
              <span className="text-sm font-medium">
                Your Position: {userRank.rank}{getRankSuffix(userRank.rank)} place
              </span>
              <Badge variant="secondary" className="text-xs">
                {userRank.score} pts
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
