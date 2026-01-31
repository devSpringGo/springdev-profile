import React from 'react';
import { SectionId } from '../types';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id={SectionId.CONTACT} className="py-20 bg-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Liên Hệ</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-400">Bạn có ý tưởng dự án? Hãy cùng thảo luận nhé!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Side */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white">Kết nối với tôi</h3>
            <p className="text-gray-400 leading-relaxed">
              Tôi luôn sẵn sàng cho các cơ hội hợp tác mới. Dù bạn có câu hỏi hay chỉ muốn nói lời chào, 
              tôi sẽ cố gắng phản hồi sớm nhất có thể!
            </p>
            
            <div className="space-y-6 mt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-primary border border-slate-700">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium">Email</h4>
                  <p className="text-gray-400">contact@springgo.xyz</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-secondary border border-slate-700">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium">Điện thoại</h4>
                  <p className="text-gray-400">034.609.2267</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-green-500 border border-slate-700">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium">Địa chỉ</h4>
                  <p className="text-gray-400">TP. Đà Nẵng, Việt Nam</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Họ tên</label>
                  <input type="text" id="name" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="nhập họ tên của bạn" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input type="email" id="email" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="nhập email của bạn" />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Chủ đề</label>
                <input type="text" id="subject" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Dự án Website..." />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Nội dung</label>
                <textarea id="message" rows={4} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none" placeholder="Viết nội dung tin nhắn..."></textarea>
              </div>

              <button type="button" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Gửi Tin Nhắn <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;