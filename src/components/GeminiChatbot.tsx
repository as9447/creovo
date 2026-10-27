import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Bot,
  User,
  Trash2,
  Minimize2,
  Maximize2,
  ChevronDown,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content:
        'مرحباً بك! أنا المستشار الإبداعي لمنصة Creovo. يمكنني مساعدتك في صياغة Hooks إعلانية قوية لأول 3 ثوانٍ في TikTok، وكتابة سيناريوهات UGC فيروسية، أو تحسين الـ Prompts لتوليد فيديوهات مذهلة بالـ AI. كيف أساعدك اليوم؟',
      time: 'الآن',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
          systemInstruction:
            'أنت المستشار الإبداعي ومدير الإعلانات الذكي لمنصة Creovo المتخصصة في فيديوهات الـ UGC والذكاء الاصطناعي. ساعد المستخدم في كتابة أفكار إعلانية فيروسية، وHooks في أول 3 ثوانٍ، وسيناريوهات تصوير احترافية. اكتب باللغة العربية باحترافية وطاقة حماسية ممتعة، وتجنب التعقيد غير الضروري.',
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'حدث خطأ في استجابة المساعد.');
      }

      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'تم استلام استفسارك بنجاح.',
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ عذراً: ${err.message || 'حدث تعذر مؤقت في الاتصال بمحرك Gemini.'}`,
        time: 'الآن',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'm1',
        role: 'assistant',
        content: 'تم بدء محادثة جديدة! ما هو المنتج أو الفكرة الإعلانية التي تود تطويرها الآن؟',
        time: 'الآن',
      },
    ]);
  };

  const quickPrompts = [
    'اكتب لي 3 Hooks إعلانية تخطف الانتباه في أول 3 ثوانٍ',
    'أفكار سيناريو UGC لمنتج عناية بالبشرة',
    'صياغة Prompt فيديو لنموذج Omni Flash',
  ];

  return (
    <>
      {/* Floating Toggle Button (Bottom Left) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-orange-500 p-4 text-white shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
          <span className="font-bold text-xs">مستشار الإعلانات الذكي</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 left-6 z-50 w-full max-w-md rounded-3xl bg-[#121528] border border-white/15 shadow-2xl flex flex-col overflow-hidden text-right transition-all duration-200 ${
            isMinimized ? 'h-16' : 'h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#181c38] border-b border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={clearChat}
                title="مسح المحادثة"
                className="text-slate-400 hover:text-red-400 p-1 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>مستشار الإعلانات والـ UGC</span>
                  <Bot className="h-3.5 w-3.5 text-indigo-400" />
                </h4>
                <div className="text-[10px] text-emerald-400 font-mono">Gemini AI Active</div>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Model Selector Strip */}
              <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">النموذج النشط:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="bg-[#181c38] text-white rounded-lg px-2.5 py-1 text-[11px] border border-white/10 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (مهام إبداعية عامة)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (فائق السرعة)</option>
                  <option value="gemini-4-argon">gemini-4-argon (استراتيجي متقدم)</option>
                </select>
              </div>

              {/* Scrollable Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                      <span>{msg.time}</span>
                      <span className="font-bold text-slate-300">
                        {msg.role === 'user' ? 'أنت' : 'Creovo AI'}
                      </span>
                    </div>

                    <div
                      className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-medium rounded-tr-none'
                          : 'bg-white/10 text-slate-100 border border-white/10 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-indigo-300 bg-white/5 p-3 rounded-2xl w-fit border border-white/5">
                    <Sparkles className="h-4 w-4 animate-spin text-orange-400" />
                    <span>جاري التفكير وصياغة الأفكار الإعلانية...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Strip */}
              <div className="px-3 py-2 bg-white/5 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(qp)}
                    disabled={isLoading}
                    className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#181c38] hover:bg-indigo-600/30 border border-white/10 text-[10px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {qp}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-[#181c38] border-t border-white/10 flex items-center gap-2"
              >
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Send className="h-4 w-4 rotate-180" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="اسأل عن فكرة إعلان، Hook، أو سيناريو فيديو..."
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none text-right"
                />
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
