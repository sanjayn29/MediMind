import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import { MessageSquare, Send, Loader2, Bot, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
  confidence?: number;
}

export const ChatSection = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await apiService.medicalChat({
        message: currentMessage,
        context: 'Medical consultation'
      });

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.response,
        isUser: false,
        timestamp: new Date(),
        suggestions: response.suggestions,
        confidence: response.confidence
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "Unable to send message. Please try again.",
        variant: "destructive"
      });

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const useSuggestion = (suggestion: string) => {
    setCurrentMessage(suggestion);
  };

  return (
    <Card className="h-full flex flex-col shadow-lg border-0">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-green-50">
        <CardTitle className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <span>AI Medical Assistant</span>
          <Sparkles className="h-4 w-4 text-green-500" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Start a conversation</p>
              <p className="text-sm mt-2">Ask me about your symptoms or medical concerns</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {!msg.isUser && (
                      <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-green-600" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      {msg.confidence && !msg.isUser && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs bg-white/80">
                            Confidence: {msg.confidence.toFixed(1)}%
                          </Badge>
                        </div>
                      )}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-medium opacity-80">
                            Suggested questions:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {msg.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-auto py-1 px-2 bg-white/90 hover:bg-white"
                                onClick={() => useSuggestion(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {msg.isUser && (
                      <User className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex space-x-2">
            <Textarea
              placeholder="Describe your symptoms or ask a medical question..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 min-h-[50px] max-h-[100px] resize-none border-0 focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 h-[50px] w-[50px] p-0"
              disabled={!currentMessage.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 