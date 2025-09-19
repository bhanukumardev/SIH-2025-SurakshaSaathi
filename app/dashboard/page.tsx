'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks';
import { useLocalization } from '@/hooks/use-localization';
import { useRole } from '@/lib/roleContext';
import UserMenu from '../components/UserMenu';

interface DashboardItem {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  action: () => void;
  regions: string[]; // 'national', 'punjab', or both
  roles: string[]; // roles allowed to see this item
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const { region } = useLocalization();
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  const dashboardItems: DashboardItem[] = [
    {
      id: 'safety-drills',
      title: 'Safety Drills',
      description: 'Interactive safety training modules',
      buttonText: 'Start Drills',
      action: () => router.push('/drills'),
      regions: ['national', 'punjab'],
      roles: ['student', 'teacher', 'parent', 'admin']
    },
    {
      id: 'alerts',
      title: 'Alerts',
      description: 'View safety alerts and notifications',
      buttonText: 'View Alerts',
      action: () => router.push('/alerts'),
      regions: ['national', 'punjab'],
      roles: ['student', 'teacher', 'parent', 'admin']
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your profile information',
      buttonText: 'Edit Profile',
      action: () => router.push('/profile'),
      regions: ['national', 'punjab'],
      roles: ['student', 'teacher', 'parent', 'admin']
    },
    {
      id: 'chatbot',
      title: 'Chatbot',
      description: 'Get help with safety questions',
      buttonText: 'Open Chatbot',
      action: () => router.push('/chatbot'),
      regions: ['national', 'punjab'],
      roles: ['student', 'teacher', 'parent', 'admin']
    },
    {
      id: 'modules',
      title: 'Modules',
      description: 'Access learning modules',
      buttonText: 'View Modules',
      action: () => router.push('/modules'),
      regions: ['national', 'punjab'],
      roles: ['student', 'teacher', 'parent', 'admin']
    },
    {
      id: 'punjab-culture',
      title: 'Punjab Cultural Elements',
      description: 'Explore Punjab-specific cultural safety practices',
      buttonText: 'Explore',
      action: () => router.push('/punjab-culture'),
      regions: ['punjab'],
      roles: ['student', 'teacher', 'parent', 'admin']
    }
  ];

  // Filter dashboard items based on selected region and user role
  const filteredItems = dashboardItems.filter(item => item.regions.includes(region) && item.roles.includes(role || ''));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <UserMenu />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user.name}</CardTitle>
              <CardDescription>Role: {user.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Email: {user.email}</p>
              {user.school && <p>School: {user.school}</p>}
              {user.class && <p>Class: {user.class}</p>}
              {user.region && <p>Region: {user.region}</p>}
              {user.language && <p>Language: {user.language}</p>}
            </CardContent>
          </Card>

          {filteredItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={item.action} className="w-full">
                  {item.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
