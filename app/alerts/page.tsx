'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks';
import { useLocalization } from '@/hooks/use-localization';
import { ProtectedRoute } from '@/lib/roleContext';

interface AlertItem {
  id: string;
  title: string;
  message: string;
  date: string;
  regions: string[]; // 'national', 'punjab', or both
}

export default function AlertsPage() {
  const { user, loading } = useAuth();
  const { region } = useLocalization();
  const router = useRouter();
  const [allAlerts, setAllAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // For demo, static alerts data with regions
    setAllAlerts([
      { id: '1', title: 'Fire Drill Alert', message: 'Fire drill scheduled for tomorrow at 10 AM.', date: '2024-06-01', regions: ['national', 'punjab'] },
      { id: '2', title: 'Weather Warning', message: 'Severe weather expected this weekend.', date: '2024-06-02', regions: ['national'] },
      { id: '3', title: 'Punjab Flood Alert', message: 'Flood warning for Punjab rivers.', date: '2024-06-03', regions: ['punjab'] },
    ]);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  // Filter alerts based on selected region
  const filteredAlerts = allAlerts.filter(alert => alert.regions.includes(region));

  return (
    <ProtectedRoute allowedRoles={['student', 'teacher', 'parent', 'admin']}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Alerts</h1>
          {filteredAlerts.length === 0 ? (
            <p>No alerts at this time.</p>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id}>
                  <CardHeader>
                    <CardTitle>{alert.title}</CardTitle>
                    <CardDescription>{alert.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{alert.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-6">
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
