'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks';
import { useLanguage } from '@/lib/useLanguage';
import { useLocalization } from '@/hooks/use-localization';
import { ProtectedRoute } from '@/lib/roleContext';
import ProfileDropdown from '../components/ProfileDropdown';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  regions: string[]; // 'national', 'punjab', or both
}

const allModules: Module[] = [
  { id: '1', title: 'Earthquake Drill', description: 'Follow earthquake safety steps', duration: '10 min', regions: ['national', 'punjab'] },
  { id: '2', title: 'Fire Evacuation', description: 'Practise safe evacuation', duration: '8 min', regions: ['national', 'punjab'] },
  { id: '3', title: 'Flood Preparedness', description: 'Prepare for flood emergencies', duration: '12 min', regions: ['national'] },
  { id: '4', title: 'Punjab-Specific Disaster', description: 'Local disaster preparedness for Punjab', duration: '15 min', regions: ['punjab'] },
];

export default function ModulesPage() {
  const { user, loading, logout } = useAuth();
  const { t } = useLanguage();
  const { region } = useLocalization();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Filter modules based on selected region
  const filteredModules = allModules.filter(mod => mod.regions.includes(region));

  return (
    <ProtectedRoute allowedRoles={['student', 'teacher']}>
      <div className="p-6 space-y-4">
        <div className="flex justify-end mb-4">
          {user && (
            <ProfileDropdown
              name={user.name || 'User'}
              email={user.email || ''}
              role={user.role || ''}
            />
          )}
        </div>
        <h1 className="text-2xl font-bold">{t('disasterPreparednessModules')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredModules.map((mod) => (
            <Card key={mod.id}>
              <CardHeader>
                <CardTitle>{mod.title}</CardTitle>
                <CardDescription>{mod.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div>{t('duration')}: {mod.duration}</div>
                <Button onClick={() => alert(`Start ${mod.title}`)}>{t('startModule')}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button variant="destructive" onClick={handleLogout} className="mt-6">
          {t('logout')}
        </Button>
      </div>
    </ProtectedRoute>
  );
}
