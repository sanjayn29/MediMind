import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiService, type ChatMessage, type ChatResponse } from '@/lib/api';

interface ChatMessageDisplay {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
  confidence?: number;
}

export const MedicalChat = () => {
  const [messages, setMessages] = useState<ChatMessageDisplay[]>([]);
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

    const userMessage: ChatMessageDisplay = {
      id: Date.now().toString(),
      message: currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const chatRequest: ChatMessage = {
        message: currentMessage,
        context: 'Medical consultation'
      };

      const response: ChatResponse = await apiService.medicalChat(chatRequest);

      const botMessage: ChatMessageDisplay = {
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

      const errorMessage: ChatMessageDisplay = {
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
    <Card className="p-6 shadow-card h-[600px] flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-primary rounded-lg">
          <MessageSquare className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Medical Chat Assistant</h3>
          <p className="text-sm text-muted-foreground">AI-powered medical consultation</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start a conversation about your symptoms</p>
            <p className="text-xs mt-2">Ask me about any medical concerns</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {!msg.isUser && (
                    <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{msg.message}</p>
                    {msg.confidence && !msg.isUser && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Confidence: {msg.confidence.toFixed(1)}%
                        </Badge>
                      </div>
                    )}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Suggested follow-up questions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-auto py-1 px-2"
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
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex space-x-2">
        <Textarea
          placeholder="Describe your symptoms or ask a medical question..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 min-h-[60px] max-h-[120px] resize-none"
          disabled={isLoading}
        />
        <Button
          onClick={sendMessage}
          variant="medical"
          size="icon"
          disabled={!currentMessage.trim() || isLoading}
          className="h-[60px] w-[60px]"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}; 