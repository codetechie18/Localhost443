import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: `Hello ${user?.name || ''}! I am the Civic AI Verifier. Provide a case description or ID to check if it's likely real or fake.`, 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Don't show if not logged in
  if (!user) return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const isFake = Math.random() > 0.5; // 50% chance of being fake for demonstration
      const botResponse = {
        id: Date.now() + 1,
        text: isFake 
          ? "⚠️ Based on my analysis, this case exhibits patterns of a **FAKE** report (e.g., duplicated images or inconsistent location data)."
          : "✅ Analysis complete. This case appears to be **REAL** and verified against our database patterns.",
        sender: 'bot',
        isFake
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const formatText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-110 transition-all duration-300 z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[360px] h-[500px] bg-slate-900 border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right z-50 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-20%] w-[100%] h-[200%] bg-white/5 rounded-full blur-[20px]" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm shadow-inner">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Civic AI Verifier</h3>
              <p className="text-[10px] text-indigo-100 uppercase tracking-widest font-semibold">Case Authenticity Checker</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors relative z-10">
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-lg ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-sm' 
                  : msg.isFake 
                    ? 'bg-rose-500/20 border border-rose-500/30 text-slate-200 rounded-bl-sm'
                    : msg.isFake === false
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-slate-200 rounded-bl-sm'
                      : 'bg-slate-800 text-slate-200 border border-white/5 rounded-bl-sm'
              }`}>
                {msg.sender === 'bot' && (
                  <div className="flex items-center gap-2 mb-2 opacity-70">
                    <Bot size={14} className={msg.isFake ? 'text-rose-400' : msg.isFake === false ? 'text-emerald-400' : 'text-indigo-400'} />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">AI System</span>
                  </div>
                )}
                <div className="leading-relaxed">
                  {formatText(msg.text)}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
               <div className="bg-slate-800 border border-white/5 rounded-2xl rounded-bl-sm p-3.5 flex items-center gap-2 w-16 h-10 shadow-lg">
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-slate-900 border-t border-white/10">
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-1 pr-1.5 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all shadow-inner">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Enter case details or ID..."
              className="flex-1 bg-transparent text-slate-200 text-sm px-3 py-2 outline-none placeholder:text-slate-500"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-lg bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-400 transition-colors shadow-md"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
