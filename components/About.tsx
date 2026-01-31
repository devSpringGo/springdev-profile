import React from 'react';
import { SectionId } from '../types';
import { Cpu, Globe, Database, Layout, Terminal, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import TechMarquee from './TechMarquee';
import SpotlightCard from './SpotlightCard';

const skills = [
  { name: 'Frontend Development', icon: <Layout />, description: 'Html/Css, Boostrap, Javascript, React' },
  { name: 'Backend Integration', icon: <Database />, description: 'ASP.NET Core, Node.js, Java, SQL Server, Firebase, MongoDB' },
  { name: 'UI/UX Design', icon: <Globe />, description: 'Figma, Responsive Design, Photoshop' },
  { name: 'Tools & DevOps', icon: <Terminal />, description: 'VS Studio, VS Code, GitHub' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const About: React.FC = () => {
  return (
    <section id={SectionId.ABOUT} className="py-20 bg-slate-900/50 backdrop-blur-sm relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Về bản thân tôi</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Tôi là một lập trình viên đam mê công nghệ, luôn tìm kiếm giải pháp tối ưu cho mọi vấn đề. 
            Với nền tảng vững chắc về Frontend và kinh nghiệm làm việc với Backend, tôi có thể đảm nhận nhiều vai trò trong dự án.
          </p>
        </motion.div>
        
        {/* Infinite Marquee */}
        <div className="mb-16">
            <TechMarquee />
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {skills.map((skill, index) => (
            <motion.div key={index} variants={item} className="h-full">
              <SpotlightCard className="p-6 h-full flex flex-col items-start bg-slate-800/50 border-slate-700">
                <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center text-primary mb-4 ring-1 ring-white/10">
                  {React.cloneElement(skill.icon as React.ReactElement, { size: 24 })}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{skill.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {skill.description}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-slate-800 rounded-2xl p-8 lg:p-12 border border-slate-700 flex flex-col lg:flex-row items-center gap-10 shadow-2xl relative"
        >
           {/* Decorative background element for the card */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
           
           <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" /> Triết lý làm việc
              </h3>
              <p className="text-gray-300 mb-4">
                "Code sạch, dễ bảo trì và tối ưu hiệu suất là ưu tiên hàng đầu."
              </p>
              <p className="text-gray-400">
                Trong 2 năm qua, tôi đã tham gia phát triển hơn 10 dự án lớn nhỏ, từ landing page đơn giản đến các hệ thống quản lý phức tạp. 
                Tôi luôn chủ động cập nhật các công nghệ mới như AI integration để mang lại giá trị tốt nhất cho sản phẩm.
              </p>
           </div>
           <div className="flex-1 w-full grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-lg text-center hover:scale-105 transition-transform duration-300 cursor-default border border-slate-800 hover:border-slate-600">
                 <span className="block text-3xl font-bold text-primary">2+</span>
                 <span className="text-sm text-gray-400">Năm kinh nghiệm</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg text-center hover:scale-105 transition-transform duration-300 cursor-default border border-slate-800 hover:border-slate-600">
                 <span className="block text-3xl font-bold text-secondary">5</span>
                 <span className="text-sm text-gray-400">Dự án hoàn thành</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg text-center hover:scale-105 transition-transform duration-300 cursor-default border border-slate-800 hover:border-slate-600">
                 <span className="block text-3xl font-bold text-green-500">3+</span>
                 <span className="text-sm text-gray-400">Công nghệ sử dụng</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg text-center hover:scale-105 transition-transform duration-300 cursor-default border border-slate-800 hover:border-slate-600">
                 <span className="block text-3xl font-bold text-orange-500">100%</span>
                 <span className="text-sm text-gray-400">Hoàn thành nhiệm vụ</span>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;