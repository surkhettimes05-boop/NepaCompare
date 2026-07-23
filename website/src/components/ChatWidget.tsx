'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Proactive greeting simulation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 0) {
        setMessages([{ role: 'bot', text: 'Hi! I am NepaBot, your AI Insurance Advisor. How can I help you today?' }]);
        setIsOpen(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Don't show on login pages
  if (pathname === '/login' || pathname === '/register') return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    
    // MVP Toxicity Detection
    const toxicKeywords = ['stupid', 'idiot', 'hate', 'scam', 'fraud', 'fuck', 'shit'];
    const isToxic = toxicKeywords.some(word => userMessage.toLowerCase().includes(word));

    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    if (isToxic) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: "I understand you might be feeling frustrated. To help me assist you better, could you please rephrase your concern? Alternatively, I can connect you directly with a human Financial Doctor right now." 
        }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await res.json();
      
      // Simulate typing token stream effect but very quickly (WebGPU inference speed)
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: data.response || "Sorry, I encountered an error." }]);
      
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I am having trouble connecting to the server right now." }]);
      setIsTyping(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: var(--text-muted);
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out both;
        }
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes pulse-gpu {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}} />

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="animate-fade-up"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '12px',
            height: '12px',
            background: '#10B981',
            borderRadius: '50%',
            border: '2px solid white',
            animation: 'pulse-gpu 2s infinite'
          }}></div>
        </button>
      )}

      {isOpen && (
        <div className="animate-fade-up" style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '350px',
          height: '500px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.5)'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.1)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>NepaBot AI</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse-gpu 2s infinite' }}></div>
                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>WebGPU Inference Active ⚡</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}
            >
              &times;
            </button>
          </div>

          {/* Chat History */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'rgba(248, 250, 252, 0.5)'
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                backgroundColor: m.role === 'user' ? 'var(--primary-color)' : 'white',
                color: m.role === 'user' ? 'white' : '#1e293b',
                padding: '0.75rem 1rem',
                borderRadius: m.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                border: m.role === 'bot' ? '1px solid var(--border-color)' : 'none'
              }}>
                {m.text}
              </div>
            ))}
            
            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '12px 12px 12px 0',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                display: 'flex',
                gap: '4px',
                border: '1px solid var(--border-color)'
              }}>
                <div className="typing-dot"></div>
                <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about insurance..." 
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button type="submit" disabled={!input.trim() || isTyping} style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              opacity: (!input.trim() || isTyping) ? 0.5 : 1
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
