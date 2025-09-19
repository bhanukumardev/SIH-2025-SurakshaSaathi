'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/lib/hooks';
import { useLocalization } from '@/hooks/use-localization';
import { useLanguage } from '@/lib/useLanguage';
import { LanguageSelector } from '@/components/language-selector';
import { RegionSelector } from '@/components/region-selector';
import { ProtectedRoute } from '@/lib/roleContext';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { region, setRegion } = useLocalization();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  const handleSave = () => {
    // Save to localStorage or backend
    localStorage.setItem('notifications', notifications.toString());
    // In real app, call API to save preferences
    alert('Settings saved!');
  };

  return (
    <ProtectedRoute allowedRoles={['student', 'teacher', 'parent', 'admin']}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>Choose your preferred language and region</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Language</Label>
                  <LanguageSelector />
                </div>
                <div>
                  <Label>Region</Label>
                  <RegionSelector />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave}>Save Settings</Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
