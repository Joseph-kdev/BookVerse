import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { chatAboutBook, ChatTurn } from "../services/requests";
import { useUserAuthContext } from "../config/UserAuthContext";
import { motion } from "framer-motion";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  timestamp: string;
}

/** Turns sent to the server with each message (the server keeps the last 20). */
const HISTORY_TURNS_SENT = 20;
/** Messages kept in localStorage per book. */
const MAX_STORED_MESSAGES = 50;
export const MAX_MESSAGE_LENGTH = 2000;
const STORAGE_VERSION = 1;

const storageKey = (uid: string, bookId: string) =>
  `bookverse-chat:v${STORAGE_VERSION}:${uid}:${bookId}`;

const loadMessages = (key: string | null): Message[] => {
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.messages)
      ? parsed.messages.filter(
          (m: Message) =>
            (m.type === "user" || m.type === "assistant") &&
            typeof m.content === "string"
        )
      : [];
  } catch {
    return [];
  }
};

const saveMessages = (key: string, messages: Message[]) => {
  const finished = messages
    .filter((m) => !m.isStreaming && m.content.trim())
    .slice(-MAX_STORED_MESSAGES);
  try {
    if (finished.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify({ messages: finished }));
    }
  } catch (error) {
    // Storage full or disabled: the chat still works, it just won't persist.
    console.warn("Could not save chat history", error);
  }
};

const BookChat = ({
  bookId,
  title,
  author,
}: {
  bookId: string;
  title: string;
  author: string;
}) => {
  const { user } = useUserAuthContext();
  const key = user?.uid ? storageKey(user.uid, bookId) : null;

  const [messages, setMessages] = useState<Message[]>(() => loadMessages(key));
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Which storage key `messages` was loaded from. Saving is skipped until the
  // messages for the current key are loaded, so a late sign-in can't
  // overwrite stored history with an empty conversation.
  const [loadedKey, setLoadedKey] = useState<string | null>(key);

  // Reload when the signed-in user or book changes.
  useEffect(() => {
    if (key !== loadedKey) {
      abortRef.current?.abort();
      setMessages(loadMessages(key));
      setLoadedKey(key);
    }
  }, [key, loadedKey]);

  // Persist finished messages.
  useEffect(() => {
    if (key && key === loadedKey) saveMessages(key, messages);
  }, [key, loadedKey, messages]);

  // Stop an in-flight reply when the chat closes.
  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearConversation = () => {
    abortRef.current?.abort();
    setIsLoading(false);
    setError(null);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading || !user) return;

    const history: ChatTurn[] = messages
      .filter((m) => !m.isStreaming && m.content.trim())
      .slice(-HISTORY_TURNS_SENT)
      .map((m) => ({ role: m.type, content: m.content }));

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: "user",
      content: currentMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      type: "assistant",
      content: "",
      isStreaming: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setCurrentMessage("");
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await chatAboutBook({
        title: title,
        author: author,
        message: userMessage.content,
        history,
        signal: controller.signal,
        onChunk: (text: string) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + text }
                : msg
            )
          );
        },
        onComplete: () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          setIsLoading(false);
        },
        onError: (errorMessage: string) => {
          setError(errorMessage);
          setIsLoading(false);
          // Remove the failed message
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== assistantMessageId)
          );
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      setIsLoading(false);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== assistantMessageId)
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full bg-light-background dark:bg-dark-background flex flex-col">
      <header className="bg-light-background border-b border-gray-200 px-1 md:px-4 py-4 dark:bg-dark-background">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-light-accent dark:bg-dark-secondary rounded-full w-10 h-10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-light-secondary dark:text-dark-background" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 dark:text-dark-text">
                {title}
              </h1>
              <p className="text-sm text-gray-600">by {author}</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Clear</span>
            </button>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-8">
              {user
                ? `Ask anything about ${title}. Your conversation is saved on this device.`
                : `Log in to chat with the BookVerse assistant about ${title}.`}
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <motion.div
                className={`max-w-3xl rounded-2xl px-4 py-3 ${
                  message.type === "user"
                    ? "bg-light-primary dark:bg-dark-primary text-white"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.isStreaming && (
                  <motion.div
                    className="flex items-center mt-1 text-light-text"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm">Thinking...</span>
                  </motion.div>
                )}
              </motion.div>
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
          {!user ? (
            <div className="flex justify-center">
              <Link
                to="/login"
                className="bg-light-accent dark:bg-dark-accent px-4 py-2 rounded-xl font-Tilt_Neon text-dark-background"
              >
                Log in to chat
              </Link>
            </div>
          ) : (
          <div className="flex space-x-4 items-center">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={MAX_MESSAGE_LENGTH}
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
        )}
        </div>
      </div>
    </div>
  );
};

export default BookChat;
