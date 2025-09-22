'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalization } from '@/lib/localization';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, MessageCircle, Send, Bot, User, Mic, MicOff } from 'lucide-react';


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface QuickReply {
  text: string;
  action: string;
}

const QUICK_REPLIES: QuickReply[] = [
  { text: "Earthquake safety", action: "earthquake" },
  { text: "Fire emergency", action: "fire" },
  { text: "Flood preparedness", action: "flood" },
  { text: "Emergency contacts", action: "emergency_contacts" },
  { text: "School safety", action: "school_safety" },
  { text: "Punjab specific", action: "punjab" }
];

interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export default function ChatbotWidget({ isOpen, onToggle, className = "" }: ChatbotWidgetProps) {
  const { translate } = useLocalization();
  const [messagesSent, setMessagesSent] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: translate('Hello! I\'m your safety assistant. How can I help you stay prepared today?'),
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  // Speech Recognition Logic
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const [isListening, setIsListening] = useState(false);
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = "en-IN"; // Set language as needed
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  }

  const handleMicClick = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        try {
          recognition.start();
          setIsListening(true);
        } catch (error: any) {
          console.error("Speech recognition start error:", error);
          setIsListening(false);
          // Handle the error, possibly by showing a user-friendly message
        }
      }
    }
  };



  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // Set input state for chat box
        setIsListening(false);
      };

      recognition.onspeechend = () => {
        recognition.stop();
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }
  }, [recognition]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setMessagesSent(prev => prev + 1);



    try {
      const response = await fetch('/chatbot/api/handle_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToSend }),
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
        throw new Error('Failed to get response');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment or visit the full chatbot page for assistance.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={onToggle}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
          !
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className="w-96 h-[500px] shadow-2xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Safety Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Get instant help with disaster preparedness and safety questions
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col h-[400px] p-4 pt-0">
          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`} aria-hidden="true">
                      {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center" aria-hidden="true">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              {messagesSent > 0 && messagesSent % 5 === 0 && (
                <div className="text-green-500 text-sm">
                  Great job! You're actively engaging with the safety assistant. Keep asking questions to learn more!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>



          {/* Quick Replies */}
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-1">
              {QUICK_REPLIES.map((reply, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer text-xs hover:bg-blue-50"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply.text}
                </Badge>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="flex gap-2 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={translate("Ask about safety...")}
              onKeyPress={handleKeyPress}
              disabled={isLoading || !SpeechRecognition}
              aria-label={translate("Ask about safety...")}
            />
            <Button
              onClick={handleMicClick}
              disabled={isLoading || !SpeechRecognition}
              size="sm"
              variant="ghost"
              aria-label={isListening ? translate("Stop listening") : translate("Start listening")}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              size="sm"
              aria-label={translate("Send message")}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!SpeechRecognition && (
              <p className="text-xs text-red-500 mt-1">
                {translate("Speech recognition is not supported in this browser. Please use a supported browser like Chrome or Edge.")}
              </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
