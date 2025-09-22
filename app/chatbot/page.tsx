'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks';
import { Bot, User, Send, MessageCircle, HelpCircle, AlertTriangle, Shield, Mic, MicOff } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
}

interface Intent {
  tag: string;
  patterns: string[];
  responses: string[];
}

const TOPIC_ICONS: Record<string, any> = {
  earthquake: AlertTriangle,
  flood: MessageCircle,
  fire: AlertTriangle,
  tsunami: AlertTriangle,
  hurricane_cyclone_typhoon: AlertTriangle,
  preparedness: Shield,
  first_aid: HelpCircle,
  school_safety: HelpCircle,
  punjab_earthquake: AlertTriangle,
  punjab_flood: MessageCircle,
  punjab_fire: AlertTriangle,
  emergency_contacts: HelpCircle,
  evacuation: Shield,
  drills: Shield,
  alerts: AlertTriangle
};

const QUICK_TOPICS = [
  { name: 'Earthquake', intent: 'earthquake', icon: AlertTriangle },
  { name: 'Fire Safety', intent: 'fire', icon: AlertTriangle },
  { name: 'Flood', intent: 'flood', icon: MessageCircle },
  { name: 'Emergency Kit', intent: 'preparedness', icon: Shield },
  { name: 'First Aid', intent: 'first_aid', icon: HelpCircle },
  { name: 'Punjab Specific', intent: 'punjab_earthquake', icon: AlertTriangle }
];

export default function ChatbotPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your safety assistant. I can help you with disaster preparedness, safety procedures, and emergency information. What would you like to know about?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [intents, setIntents] = useState<Intent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Load intents from the JSON file
    fetch('/chatbot/intents.json')
      .then(response => response.json())
      .then(data => setIntents(data.intents || []))
      .catch(error => console.error('Failed to load intents:', error));
  }, []);

  const findBestIntent = (userMessage: string): Intent | null => {
    const lowerMessage = userMessage.toLowerCase();

    // Score each intent based on pattern matches
    let bestIntent: Intent | null = null;
    let bestScore = 0;

    for (const intent of intents) {
      let score = 0;
      for (const pattern of intent.patterns) {
        if (lowerMessage.includes(pattern.toLowerCase())) {
          score += 1;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    }

    return bestIntent;
  };

  const getRandomResponse = (intent: Intent): string => {
    const responses = intent.responses;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // First try the API endpoint
      const response = await fetch('/chatbot/api/handle_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback to local intent matching
        const matchedIntent = findBestIntent(input);
        let responseText: string;

        if (matchedIntent) {
          responseText = getRandomResponse(matchedIntent);
        } else {
          responseText = "I'm here to help with safety questions. Try asking about fire safety, earthquakes, first aid, or emergency preparedness. You can also ask about Punjab-specific disaster information.";
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: 'bot',
          timestamp: new Date(),
          intent: matchedIntent?.tag
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      // Fallback to local intent matching
      const matchedIntent = findBestIntent(input);
      let responseText: string;

      if (matchedIntent) {
        responseText = getRandomResponse(matchedIntent);
      } else {
        responseText = "I'm here to help with safety questions. Try asking about fire safety, earthquakes, first aid, or emergency preparedness. You can also ask about Punjab-specific disaster information.";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        intent: matchedIntent?.tag
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTopic = (intentTag: string) => {
    const intent = intents.find(i => i.tag === intentTag);
    if (intent) {
      const responseText = getRandomResponse(intent);
      const botMessage: Message = {
        id: Date.now().toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        intent: intent.tag
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Safety Chatbot</h1>
          <p className="text-gray-600">Get instant help with disaster preparedness and safety questions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  Safety Assistant
                </CardTitle>
                <CardDescription>
                  Ask me anything about disaster preparedness and safety procedures
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
                  {messages.map((message) => {
                    const IconComponent = message.sender === 'user' ? User : Bot;
                    const TopicIcon = message.intent ? TOPIC_ICONS[message.intent] : null;

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className={`p-4 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              {TopicIcon && (
                                <TopicIcon className="h-4 w-4" />
                              )}
                              <span className="text-xs opacity-75">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about safety, disasters, or emergency preparedness..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                  />
                  <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {speechError && (
                  <div className="text-sm text-red-600 mt-1">
                    Speech recognition error: {speechError}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Topics Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Topics</CardTitle>
                <CardDescription>Click to get instant information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {QUICK_TOPICS.map((topic) => {
                  const IconComponent = topic.icon;
                  return (
                    <Button
                      key={topic.intent}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleQuickTopic(topic.intent)}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {topic.name}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Police:</strong> 100
                </div>
                <div>
                  <strong>Fire:</strong> 101
                </div>
                <div>
                  <strong>Ambulance:</strong> 102
                </div>
                <div>
                  <strong>Disaster Management:</strong> 108
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
