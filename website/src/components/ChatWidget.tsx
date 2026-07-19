'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'Hi there! I am NepaBot, your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.response || "Sorry, I encountered an error." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I am having trouble connecting to the server right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
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
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '350px',
      height: '500px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80' }}></div>
          <span style={{ fontWeight: 600 }}>NepaBot AI</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
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
        backgroundColor: '#f8fafc'
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            backgroundColor: m.role === 'user' ? 'var(--primary-color)' : 'white',
            color: m.role === 'user' ? 'white' : '#1e293b',
            padding: '0.75rem 1rem',
            borderRadius: m.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            fontSize: '0.9rem',
            lineHeight: '1.4'
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
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex',
            gap: '4px'
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
          placeholder="Ask me anything..." 
          style={{
            flex: 1,
            padding: '0.5rem 1rem',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
        <button type="submit" style={{
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}
