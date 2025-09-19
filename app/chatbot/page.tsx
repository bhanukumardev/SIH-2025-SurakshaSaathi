'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatbotPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! I\'m your safety assistant. How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('fire')) {
      return 'In case of fire, remember: RACE - Rescue, Alarm, Contain, Extinguish/Evacuate. Stay calm and follow your evacuation plan.';
    } else if (lowerMessage.includes('earthquake')) {
      return 'During an earthquake, drop, cover, and hold on. Stay away from windows and heavy objects.';
    } else if (lowerMessage.includes('first aid')) {
      return 'For basic first aid, remember ABC: Airway, Breathing, Circulation. Call emergency services if needed.';
    } else if (lowerMessage.includes('drill')) {
      return 'Safety drills are important. Check the Drills page for interactive modules.';
    } else if (lowerMessage.includes('alert')) {
      return 'Check the Alerts page for the latest safety notifications.';
    } else {
      return 'I\'m here to help with safety questions. Try asking about fire safety, earthquakes, first aid, or drills.';
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Safety Chatbot</h1>
        <Card className="h-96 flex flex-col">
          <CardHeader>
            <CardTitle>Safety Assistant</CardTitle>
            <CardDescription>Ask me about safety procedures</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-2 rounded-lg max-w-xs ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white self-end ml-auto'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a safety question..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6">
          <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    </div>
  );
}
