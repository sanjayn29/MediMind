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
  
  // Voice input hook
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

  // Update current message when transcript changes
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
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
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
          style: { background: '#4CAF50', color: '#FFFFFF' } // Success Green
        });
      } else {
        await startListening();
        toast({
          title: "Voice Input Started",
          description: "Start speaking now. Click the microphone again to stop.",
          style: { background: '#00ACC1', color: '#FFFFFF' } // Info Cyan
        });
      }
    } catch (error) {
      console.error('Voice input error:', error);
      toast({
        title: "Voice Input Error",
        description: "Unable to start voice input. Please check your microphone permissions.",
        variant: "destructive",
        style: { background: '#E53935', color: '#FFFFFF' } // Warning/Alert Red
      });
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-xl border-[#E0E0E0] bg-[#FFFFFF] rounded-2xl">
      <CardHeader className="border-b-[#E0E0E0] bg-black p-4 rounded-t-2xl">
        <CardTitle className="flex items-center space-x-2 text-white">
          <div className="p-2.5 bg-black rounded-lg">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold">AI Medical Assistant</span>
          <Sparkles className="h-4 w-4 text-white" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 bg-[#F5F9FC]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-[#616161]">
              <Bot className="h-12 w-12 mx-auto mb-4 text-[#1E88E5] opacity-70" />
              <p className="font-medium text-[#212121] text-base">Start a conversation</p>
              <p className="text-sm mt-2">Ask me about your symptoms or medical concerns</p>
              {isSupported && (
                <p className="text-xs mt-2 text-[#1E88E5]">
                  💡 Try using the microphone button for voice input
                </p>
              )}
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
                      : 'bg-[#FFFFFF] text-[#212121] border-[#E0E0E0]'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {!msg.isUser && (
                      <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-[#43A047]" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      {msg.confidence && !msg.isUser && (
                        <div className="mt-2">
                          <Badge 
                            variant="outline" 
                            className="text-xs bg-[#F5F9FC] text-[#616161] border-[#E0E0E0]"
                          >
                            Confidence: {msg.confidence.toFixed(1)}%
                          </Badge>
                        </div>
                      )}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-medium text-[#616161] opacity-80">
                            Suggested questions:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {msg.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-auto py-1 px-3 bg-[#FFFFFF] text-[#1E88E5] border-[#E0E0E0] hover:bg-[#F5F9FC] hover:text-[#43A047] transition-colors duration-200"
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
                      <User className="h-4 w-4 mt-1 flex-shrink-0 text-[#FFFFFF]" />
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
              <div className="bg-[#FFFFFF] p-4 rounded-2xl shadow-sm border-[#E0E0E0]">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#43A047]" />
                  <span className="text-sm text-[#616161]">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t-[#E0E0E0] p-4 bg-black">
          <div className="flex space-x-3">
            <Textarea
              placeholder="Describe your symptoms or ask a medical question..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 min-h-[50px] max-h-[100px] resize-none border-[#E0E0E0] focus:ring-2 focus:ring-[#1E88E5] rounded-lg bg-[#F5F9FC] text-[#212121]"
              disabled={isLoading}
            />
12            <div className="flex flex-col space-y-3">
              {isSupported && (
                <Button
                  onClick={toggleVoiceInput}
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  className={`h-[50px] w-[50px] rounded-lg shadow-sm ${isListening ? 'bg-[#E53935] hover:bg-[#E53935]/90 text-white' : 'border-[#E0E0E0] text-white hover:bg-black hover:text-white active:bg-black focus:bg-black'}`}
                  disabled={isLoading}
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5 animate-pulse" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              )}
              <Button
                onClick={sendMessage}
                variant="default"
                className="bg-black text-white border-black hover:bg-black hover:text-white active:bg-black focus:bg-black h-[50px] w-[50px] p-0 rounded-lg shadow-sm"
                disabled={!currentMessage.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Voice Input Status */}
          {isListening && (
            <div className="mt-2 p-2 bg-[#F5F9FC] rounded-lg border border-[#E0E0E0]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#E53935] rounded-full animate-pulse"></div>
                <span className="text-sm text-[#1E88E5]">
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