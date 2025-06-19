import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { chatAboutBook } from '../services/requests';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  timestamp: Date;
}


const BookChat = ({title, author} : {title: string; author: string}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      isStreaming: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setError(null);
    setStreamingMessageId(assistantMessageId);

    try {
      await chatAboutBook({
        title: title,
        author: author,
        message: userMessage.content,
        sessionId,
        onChunk: (text: string, sessionId: string) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: msg.content + text }
              : msg
          ));
        },
        onComplete: () => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, isStreaming: false }
              : msg
          ));
          setIsLoading(false);
          setStreamingMessageId(null);
        },
        onError: (errorMessage: string) => {
          setError(errorMessage);
          setIsLoading(false);
          setStreamingMessageId(null);
          // Remove the failed message
          setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setIsLoading(false);
      setStreamingMessageId(null);
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-full bg-light-background dark:bg-dark-background flex flex-col">
      <header className="bg-light-background border-b border-gray-200 px-1 md:px-4 py-4 dark:bg-dark-background">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-light-accent dark:bg-dark-secondary rounded-full w-10 h-10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-light-secondary dark:text-dark-background" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 dark:text-dark-text">{title}</h1>
              <p className="text-sm text-gray-600">by {author}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-light-primary dark:bg-dark-primary text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.isStreaming && (
                  <div className="flex items-center mt-1 text-light-text">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 pb-2">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 ml-auto"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 bg-white dark:bg-dark-background px-1 md:px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4 items-center">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask something about the book..."
                rows={1}
                className="w-full px-2 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-light-accent focus:border-light-accent outline-none resize-none transition-colors"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              className="bg-light-accent text-white hover:text-light-text p-3 rounded-xl hover:bg-dark-secondary focus:ring-2 focus:bg-dark-secondary focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors md:w-14 flex justify-center items-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookChat;