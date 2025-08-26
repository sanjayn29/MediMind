import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useVoiceInput } from '@/hooks/use-voice-input';
import { apiService } from '@/lib/api';
import { MessageSquare, Send, Loader2, Bot, User, Sparkles, Mic, MicOff } from 'lucide-react';

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
  
  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    resetTranscript
  } = useVoiceInput();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setCurrentMessage(transcript);
    }
  }, [transcript]);

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
    resetTranscript();
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
        variant: "destructive",
        style: { background: '#E53936', color: '#FFFFFF' }
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

  const toggleVoiceInput = async () => {
    try {
      if (isListening) {
        stopListening();
        toast({
          title: "Voice Input Stopped",
          description: "Voice recording has been stopped.",
          style: { background: '#4CAF50', color: '#FFFFFF' }
        });
      } else {
        await startListening();
        toast({
          title: "Voice Input Started",
          description: "Start speaking now. Click the microphone again to stop.",
          style: { background: '#00ACC1', color: '#FFFFFF' }
        });
      }
    } catch (error) {
      console.error('Voice input error:', error);
      toast({
        title: "Voice Input Error",
        description: "Unable to start voice input. Please check your microphone permissions.",
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' }
      });
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-xl border-[#E0E0E0] bg-[#FFFFFF] rounded-xl">
      <CardHeader className="sticky top-0 z-10 border-b-[#E0E0E0] bg-[#1E88E5] p-4 rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="p-2 bg-black rounded-lg">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-semibold">AI Medical Assistant</span>
          <Sparkles className="h-4 w-4 text-white" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 bg-[#F5F9FC]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-10 text-[#616161]">
              <Bot className="h-10 w-10 mx-auto mb-3 text-[#1E88E5] opacity-70" />
              <p className="font-medium text-[#212121] text-xs">Start a conversation</p>
              <p className="text-[10px] mt-1">Ask me about your symptoms or medical concerns</p>
              {isSupported && (
                <p className="text-[10px] mt-1 text-[#1E88E5]">
                  💡 Try using the microphone button for voice input
                </p>
              )}
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} w-full`}
              >
                <div
                  className={`max-w-[100%] min-w-[120px] p-3.5 rounded-xl shadow-sm border ${
                    msg.isUser
                      ? 'bg-[#1E88E5] text-[#FFFFFF] border-[#1E88E5]'
                      : 'bg-[#FFFFFF] text-[#212121] border-[#E0E0E0]'
                  }`} style={{ wordBreak: 'break-word' }}
                >
                  <div className="flex items-start gap-1.5">
                    {!msg.isUser && (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#43A047]" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs leading-relaxed">{msg.message}</p>
                      
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-1.5 space-y-1">
                          <p className="text-[10px] font-medium text-[#616161] opacity-80">
                            Suggested questions:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-[10px] h-auto py-1 px-2.5 bg-[#FFFFFF] text-[#1E88E5] border-[#E0E0E0] hover:bg-[#F5F9FC] hover:text-[#1E88E5]"
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
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#FFFFFF]" />
                    )}
                  </div>
                  <div className="text-[10px] text-[#616161] opacity-70 mt-1 text-right">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start w-full">
              <div className="max-w-[80%] min-w-[120px] p-3.5 rounded-xl shadow-sm border-[#E0E0E0] bg-[#FFFFFF]">
                <div className="flex items-center gap-1.5">
                  <Loader2 className="h-4 w-4 animate-spin text-[#43A047]" />
                  <span className="text-xs text-[#616161]">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 z-10 border-t-[#E0E0E0] p-3 bg-[#1E88E5]">
          <div className="flex gap-2 max-w-[95%] mx-auto"> {/* Extended width with max-w-[95%] */}
            <Textarea
              placeholder="Describe your symptoms or ask a medical question..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 min-h-[48px] max-h-[96px] resize-none border-[#E0E0E0] focus:ring-2 focus:ring-[#1E88E5] rounded-lg bg-[#F5F9FC] text-xs text-[#212121]"
              disabled={isLoading}
              style={{ wordBreak: 'break-word' }}
            />
            <div className="flex flex-col gap-2">
              {isSupported && (
                <Button
                  onClick={toggleVoiceInput}
                  size="icon"
                  className="h-[48px] w-[48px] rounded-lg shadow-sm bg-white border-[#E0E0E0] text-black"
                  disabled={isLoading}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-black animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4 text-black" />
                  )}
                </Button>
              )}
              <Button
                onClick={sendMessage}
                className="h-[48px] w-[48px] rounded-lg shadow-sm bg-white border-[#E0E0E0] text-black"
                disabled={!currentMessage.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 text-black animate-spin" />
                ) : (
                  <Send className="h-4 w-4 text-black" />
                )}
              </Button>
            </div>
          </div>
          
          {isListening && (
            <div className="mt-2 p-1.5 bg-[#F5F9FC] rounded-lg border border-[#E0E0E0] max-w-[95%] mx-auto">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#E53935] rounded-full animate-pulse"></div>
                <span className="text-xs text-[#1E88E5]" style={{ wordBreak: 'break-word' }}>
                  Listening... {transcript && `"${transcript}"`}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};