import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Chào bạn! Mình là Trợ lý AI của shopH. Bạn cần hỗ trợ về đơn hàng, mã giảm giá hay sản phẩm nào không ạ?',
      time: 'Vừa xong'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const { setActiveModal, vouchers } = useShop();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: 'Vừa xong'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    // Automated smart answers
    setTimeout(() => {
      let reply = 'Cảm ơn bạn đã nhắn tin. ShopH luôn sẵn sàng đồng hành cùng bạn trên mọi đơn hàng!';
      const lower = text.toLowerCase();

      if (lower.includes('freeship') || lower.includes('ship') || lower.includes('vận chuyển')) {
        reply = 'Hiện tại ShopH đang có mã "FREESHIP0D" giảm ngay 30.000₫ tiền ship cho tất cả các đơn hàng, đồng thời đơn từ 300k được miễn phí ship 100% nha bạn!';
      } else if (lower.includes('voucher') || lower.includes('mã giảm') || lower.includes('khuyến mãi')) {
        reply = 'Hôm nay đang có voucher SHOPH50K (giảm 50k cho đơn từ 250k) và SALE15VIP (giảm 15% tối đa 150k). Bạn có thể bấm vào giỏ hàng để áp dụng ngay!';
      } else if (lower.includes('đơn hàng') || lower.includes('giao') || lower.includes('khi nào')) {
        reply = 'Thời gian giao hàng tiêu chuẩn là từ 1 - 2 ngày làm việc. Bạn có thể mở mục "Đơn Mua" trên góc phải màn hình để theo dõi lộ trình đơn hàng theo thời gian thực nhé!';
      } else if (lower.includes('đổi trả') || lower.includes('bảo hành')) {
        reply = 'Tất cả sản phẩm tại ShopH Mall được miễn phí đổi trả trong 7 ngày và bảo hành chính hãng 12 tháng 1 đổi 1 nếu có lỗi từ nhà sản xuất ạ!';
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: reply,
          time: 'Vừa xong'
        }
      ]);
    }, 600);
  };

  const quickPrompts = [
    'Mã Freeship hôm nay?',
    'Đơn hàng giao khi nào tới?',
    'Chính sách đổi trả hàng?'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:opacity-95 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse"></span>
          </div>
          <span className="text-xs font-bold tracking-wide">Chat với ShopH</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[460px] animate-in slide-in-from-bottom-5 duration-200 text-left">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">ShopH Trợ Lý Online</h4>
                <div className="flex items-center gap-1 text-[11px] text-orange-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Phản hồi ngay lập tức</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#f8f9fa] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-[#ee4d2d] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl shadow-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#ee4d2d] text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`block text-[9px] mt-1 text-right ${m.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] bg-orange-50 hover:bg-orange-100 text-[#ee4d2d] font-medium px-2.5 py-1 rounded-full whitespace-nowrap border border-orange-200 transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-[#ee4d2d]"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-[#ee4d2d] hover:bg-[#d73211] text-white flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
