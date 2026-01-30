import React from 'react';
import { SectionId, Experience as ExperienceType } from '../types';
import { Briefcase, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const experiences: ExperienceType[] = [
  {
    id: 1,
    company: 'Tech Solutions Corp',
    role: 'Senior Frontend Developer',
    period: '2023 - Hiện tại',
    description: [
      'Dẫn dắt team Frontend 4 người, review code và thiết kế kiến trúc dự án.',
      'Tối ưu hóa hiệu suất website, giảm thời gian tải trang 40%.',
      'Phát triển hệ thống Dashboard SaaS sử dụng Next.js và Tailwind CSS.',
    ]
  },
  {
    id: 2,
    company: 'Creative Web Agency',
    role: 'Fullstack Developer',
    period: '2022 - 2023',
    description: [
      'Xây dựng các website thương mại điện tử trọn gói cho khách hàng.',
      'Tích hợp cổng thanh toán và hệ thống quản lý kho hàng (Node.js).',
      'Làm việc trực tiếp với khách hàng để lấy yêu cầu và demo sản phẩm.',
    ]
  },
  {
    id: 3,
    company: 'Freelancer',
    role: 'Web Developer',
    period: '2021 - 2022',
    description: [
      'Nhận các dự án cắt PSD/Figma sang HTML/CSS/React.',
      'Xây dựng landing page cho các chiến dịch marketing.',
      'Học hỏi và áp dụng các công nghệ mới vào thực tế.',
    ]
  }
];

const Experience: React.FC = () => {
  return (
    <section id={SectionId.EXPERIENCE} className="py-20 bg-dark relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kinh Nghiệm Làm Việc</h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
        </motion.div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-slate-700 rounded-full"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div 
                key={exp.id} 
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center relative`}
              >
                
                {/* Dot on timeline */}
                <div className="absolute left-[-5px] md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-slate-900 z-10 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 pl-8 md:pl-0 md:px-8">
                  <div className={`bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:shadow-primary/10 transition-shadow ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} hover:border-secondary/50 duration-300`}>
                    <div className={`flex items-center gap-2 text-primary font-bold text-lg mb-1 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                      <Briefcase size={18} /> {exp.role}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{exp.company}</h3>
                    <div className={`flex items-center gap-2 text-gray-400 text-sm mb-4 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                      <Calendar size={14} /> {exp.period}
                    </div>
                    <ul className={`text-gray-300 text-sm space-y-2 list-disc list-inside ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} inline-block`}>
                      {exp.description.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Empty Side for layout balance */}
                <div className="hidden md:block w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;