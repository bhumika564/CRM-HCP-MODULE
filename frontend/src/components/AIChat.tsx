import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { sendMessage, startNewInteraction, loadPastSession } from '../store/interactionSlice';
import { Send, Loader2, Bot, History, Plus } from 'lucide-react';

const AIChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { chatHistory, pastSessions, isLoading } = useSelector((state: RootState) => state.interaction);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    dispatch(sendMessage(input));
    setInput('');
  };

  return (
    <div className="glass-panel right-panel" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--surface-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot color="var(--primary)" size={24} />
          <h3 style={{ color: 'var(--text-main)', fontWeight: 600 }}>AI Assistant</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
          <button 
            className="icon-btn" 
            onClick={() => dispatch(startNewInteraction())}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.4rem', fontWeight: 500, background: 'var(--surface-hover)' }}
          >
            <Plus size={14} />
            New
          </button>
          <button 
            className="icon-btn" 
            onClick={() => setShowHistory(!showHistory)}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.4rem', fontWeight: 500 }}
          >
            <History size={14} />
            Chat History
          </button>

          {showHistory && (
            <div className="history-dropdown">
              <div className="history-dropdown-header">Past Sessions</div>
              <div className="history-dropdown-list">
                {pastSessions.length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No past sessions.</div>
                ) : (
                  pastSessions.map(session => (
                    <button 
                      key={session.id} 
                      className="history-dropdown-item"
                      onClick={() => {
                        dispatch(loadPastSession(session.id));
                        setShowHistory(false);
                      }}
                    >
                      <span className="session-date">{session.date}</span>
                      <span className="session-preview">{session.messages.find(m => m.role === 'user')?.content.substring(0, 30) || 'New Chat'}...</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="chat-container">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe interaction..."
          disabled={isLoading}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-primary" disabled={isLoading || !input.trim()} style={{ display: 'flex', gap: '0.5rem' }}>
          {isLoading ? <Loader2 size={18} /> : (
            <>
              <Send size={18} />
              <span>Log</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AIChat;
