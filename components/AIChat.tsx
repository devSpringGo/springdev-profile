import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ArrowUp, Loader2 } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Chào bạn. Bạn có thể hỏi về kinh nghiệm, kỹ năng hoặc cách liên hệ với Tiến.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API (excluding error messages)
      const history = messages
        .filter(m => !m.isError)
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const responseText = await sendMessageToGemini(userMsg.text, history);

      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      } else {
        throw new Error("No response text");
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'Xin lỗi, hiện chưa kết nối được. Bạn có thể gửi email tới contact@springgo.xyz.',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Đóng trợ lý' : 'Mở trợ lý'}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-accent/40 bg-surface/95 backdrop-blur px-4 py-2.5 text-sm font-medium text-ink shadow-lg shadow-black/10 hover:border-accent transition-colors"
      >
        {isOpen ? <X size={16} aria-hidden="true" /> : <MessageCircle size={16} className="text-accent" aria-hidden="true" />}
        <span>{isOpen ? 'Đóng' : 'Hỏi trợ lý'}</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[min(480px,calc(100vh-7rem))] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/15">
          <div className="border-b border-line px-4 py-3">
            <h3 className="text-sm font-medium">Trợ lý hồ sơ</h3>
            <p className="mt-0.5 text-xs text-muted">Trả lời tự động dựa trên hồ sơ của Tiến, có thể chưa chính xác.</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-paper px-4 py-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-md px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent text-surface'
                      : 'border border-line bg-surface text-ink'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-md border border-line bg-surface px-3 py-2">
                  <Loader2 size={14} className="animate-spin text-muted" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-line p-3">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ví dụ: Tiến làm việc với SQL Server thế nào?"
                disabled={isLoading}
                aria-label="Câu hỏi"
                className="field pr-11"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                aria-label="Gửi"
                className="absolute right-1.5 rounded-lg bg-accent p-1.5 text-surface disabled:opacity-30 transition-opacity"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
