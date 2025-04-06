import React, { useRef, useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import MarkdownRenderer from './MarkdownRenderer';
import { useUser, useClerk } from '@clerk/nextjs';
import { useChat } from 'ai/react';
import { SiteContent } from '../types/SiteContent';
import { getSitePrompt } from '../utils/getSitePrompt';

type ChatProps = {
  siteContent: SiteContent;
};

const Chat: React.FC<ChatProps> = ({ siteContent }) => {
  const chatContainer = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useUser();
  const { openSignUp } = useClerk();

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: getSitePrompt(siteContent),
    onResponse: () => setIsTyping(false),
  });

  const scroll = useCallback(() => {
    const { scrollHeight } = chatContainer.current as HTMLDivElement;
    chatContainer.current?.scrollTo?.({
      top: scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    scroll();
  }, [messages, scroll]);

  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 30000); // Timeout after 30s
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!user) {
        openSignUp();
        return;
      }
      setIsTyping(true);
      await handleSubmit(event);
    },
    [user, openSignUp, handleSubmit]
  );

  const MemoizedMarkdownRenderer = React.memo(MarkdownRenderer);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      <div 
        ref={chatContainer} 
        className="flex-1 p-4 overflow-y-auto space-y-6"
      >
        {messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .map((m, index) => (
            <div 
              key={index} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-3xl ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0 mx-2">
                  <Image 
                    className="rounded-full"
                    alt="avatar" 
                    src={`/${m.role}.jpg`} 
                    width={40} 
                    height={40} 
                  />
                </div>
                <div className={`px-4 py-2 rounded-lg ${m.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
                >
                  <MemoizedMarkdownRenderer>{m.content}</MemoizedMarkdownRenderer>
                </div>
              </div>
            </div>
          ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-3xl">
              <div className="flex-shrink-0 mx-2">
                <Image 
                  className="rounded-full"
                  alt="ai-avatar" 
                  src="/assistant.jpg" 
                  width={40} 
                  height={40} 
                />
              </div>
              <div className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            name="input-field"
            type="text"
            placeholder="Ask anything about the site..."
            onChange={handleInputChange}
            value={input}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={!input.trim() || isLoading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;