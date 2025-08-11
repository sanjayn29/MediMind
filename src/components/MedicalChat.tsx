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
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
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
    <Card className="p-6 shadow-xl border-[#E0E0E0] bg-[#FFFFFF] rounded-2xl h-[600px] flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-[#F5F9FC] rounded-lg">
          <MessageSquare className="h-5 w-5 text-[#1E88E5]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#212121]">Medical Chat Assistant</h3>
          <p className="text-sm text-[#616161]">AI-powered medical consultation</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-6">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-[#616161]">
            <Bot className="h-14 w-14 mx-auto mb-4 text-[#1E88E5] opacity-70" />
            <p className="text-base font-medium text-[#212121]">Start a conversation about your symptoms</p>
            <p className="text-sm mt-2">Ask me about any medical concerns</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl shadow-sm transition-all duration-200 ${
                  msg.isUser
                    ? 'bg-[#1E88E5] text-[#FFFFFF]'
                    : 'bg-[#F5F9FC] text-[#212121] border-[#E0E0E0]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {!msg.isUser && (
                    <Bot className="h-5 w-5 mt-1 flex-shrink-0 text-[#43A047]" />
                  )}
                  <div className="flex-1">
                    <p className="text-base leading-relaxed">{msg.message}</p>
                    {msg.confidence && !msg.isUser && (
                      <div className="mt-3">
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-[#F5F9FC] text-[#616161] border-[#E0E0E0] px-3 py-1"
                        >
                          Confidence: {msg.confidence.toFixed(1)}%
                        </Badge>
                      </div>
                    )}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <p className="text-xs font-medium text-[#616161] opacity-80">
                          Suggested follow-up questions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-auto py-1.5 px-3 bg-[#FFFFFF] text-[#1E88E5] border-[#E0E0E0] hover:bg-[#F5F9FC] hover:text-[#43A047] transition-colors duration-200 rounded-lg"
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
                    <User className="h-5 w-5 mt-1 flex-shrink-0 text-[#FFFFFF]" />
                  )}
                </div>
                <div className="text-xs text-[#616161] opacity-70 mt-2">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#F5F9FC] p-4 rounded-2xl shadow-sm border-[#E0E0E0]">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 animate-spin text-[#43A047]" />
                <span className="text-base text-[#616161]">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex space-x-3">
        <Textarea
          placeholder="Describe your symptoms or ask a medical question..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 min-h-[60px] max-h-[120px] resize-none border-[#E0E0E0] focus:ring-2 focus:ring-[#1E88E5] rounded-lg bg-[#F5F9FC] text-[#212121] text-base p-3"
          disabled={isLoading}
        />
        <Button
          onClick={sendMessage}
          variant="default"
          size="icon"
          disabled={!currentMessage.trim() || isLoading}
          className="bg-[#1E88E5] hover:bg-[#43A047] h-[60px] w-[60px] rounded-lg text-[#FFFFFF] shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </Card>
  );
};