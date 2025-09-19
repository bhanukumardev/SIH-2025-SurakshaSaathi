'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks';

interface Drill {
  id: string;
  title: string;
  description: string;
}

export default function DrillsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [drills, setDrills] = useState<Drill[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // For demo, static drills data
    setDrills([
      { id: '1', title: 'Fire Safety Drill', description: 'Learn how to safely evacuate during a fire.' },
      { id: '2', title: 'Earthquake Drill', description: 'Practice safety measures during an earthquake.' },
      { id: '3', title: 'First Aid Basics', description: 'Basic first aid techniques everyone should know.' },
    ]);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Safety Drills</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drills.map((drill) => (
            <Card key={drill.id}>
              <CardHeader>
                <CardTitle>{drill.title}</CardTitle>
                <CardDescription>{drill.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => alert(`Starting drill: ${drill.title}`)} className="w-full">
                  Start Drill
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
