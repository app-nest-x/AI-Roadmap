'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    const authenticated = localStorage.getItem('authenticated');
    if (!authenticated) {
      router.push('/login');
      return;
    }
    setMessages([{
      id: 1,
      type: 'ai',
      content: "Hi there! I'm your AI career mentor. I'm excited to help you discover your ideal career path. To get started, could you tell me what kind of career or profession you're interested in exploring? For example, you might say 'I want to become a software engineer' or 'I'm interested in healthcare careers'.",
      timestamp: new Date()
    }]);
  }, [router]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || rateLimited) return;
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: updatedMessages
        }),
      });
      if (!response.ok) {
        if (response.status === 429) {
          // For rate limits, still process the response since we provide fallback content
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }
      const data = await response.json();
      const aiMessage = {
        id: updatedMessages.length + 1,
        type: 'ai',
        content: data.message,
        timestamp: new Date(),
        isRoadmapReady: data.isRoadmapReady,
        roadmapData: data.roadmapData
      };
      setMessages(prev => [...prev, aiMessage]);
      if (data.isRoadmapReady && data.roadmapData) {
        setConversationComplete(true);
        localStorage.setItem('roadmapData', JSON.stringify(data.roadmapData));
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.message && error.message.includes('Rate limit exceeded')) {
        setRateLimited(true);
      }
      const errorMessage = {
        id: updatedMessages.length + 1,
        type: 'ai',
        content: error.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isRoadmapReady: false,
        roadmapData: null
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  const handleGenerateRoadmap = () => {
    router.push('/roadmap');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex flex-col">
      {}
      {rateLimited && (
        <div className="bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 text-amber-700 dark:text-amber-300 p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="font-semibold">Rate Limit Exceeded</p>
              <p className="text-sm">You have reached the free tier limit of 50 requests per day. Please upgrade your Google AI plan or try again tomorrow.</p>
            </div>
          </div>
        </div>
      )}
      {}
      <header className="relative z-10 border-b border-slate-200/60 dark:border-slate-800/60 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-slate-800 dark:text-slate-200">CareerGuide</span>
            </Link>
            <div className="hidden sm:block w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
            <span className="hidden sm:block text-slate-600 dark:text-slate-400 font-medium">AI Career Mentor</span>
          </div>
          {conversationComplete && (
            <button
              onClick={handleGenerateRoadmap}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>View Roadmap</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
        </div>
      </header>
      {}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6">
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl h-[calc(100vh-180px)] flex flex-col border border-slate-200 dark:border-slate-700">
          {}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                      : message.isRoadmapReady
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">CareerGuide AI</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Career Mentor</p>
                      </div>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  {message.isRoadmapReady && (
                    <div className="mt-4 p-4 bg-emerald-100 dark:bg-emerald-800/30 rounded-xl border border-emerald-200 dark:border-emerald-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-emerald-800 dark:text-emerald-200 font-semibold text-sm">Ready for Your Roadmap!</p>
                      </div>
                      <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                        I&apos;ve gathered enough information to create your personalized career roadmap. Click the button above to view it.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-lg bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600`}>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">CareerGuide AI</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Thinking...</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {}
          <div className="border-t border-slate-200 dark:border-slate-600 p-6">
            <form onSubmit={sendMessage} className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={rateLimited ? "Rate limit exceeded - try again tomorrow" : "Share your thoughts about your career goals..."}
                  disabled={loading || rateLimited}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-400 dark:focus:border-emerald-400 transition-all duration-200 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <svg className="w-5 h-5 text-slate-400 absolute right-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim() || rateLimited}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span className="hidden sm:block">Send</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}