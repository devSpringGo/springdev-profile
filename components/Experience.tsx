// import React from 'react';
// import { SectionId, Experience as ExperienceType } from '../types';
// import { Briefcase, Calendar } from 'lucide-react';
// import { motion } from 'framer-motion';

// const experiences: ExperienceType[] = [
//   {
//     id: 1,
//     company: 'Fujinet Systems',
//     role: 'Intern .NET Developer & Probation .NET Developer',
//     period: '04/2023 - 10/2023',
//     description: [
//       'Tham gia chương trình tuyển dụng tại Ngày hội việc làm OpenDay 2023 do Đại học Công nghệ TP.HCM (HUTECH) tổ chức và gia nhập công ty với vai trò Thực tập sinh.',
//       'Thực tập tại vị trí Lập trình viên .NET, tham gia phát triển ứng dụng WinForms sử dụng Visual Basic và cơ sở dữ liệu Oracle.',
//       'Sau thời gian thực tập, tiếp tục đảm nhiệm vị trí Lập trình viên .NET (thử việc), tham gia phát triển dự án WinForms cho khách hàng Nhật Bản, sử dụng C#, SQL Server, xây dựng và tối ưu Stored Procedure, Function.',
//       'Kết thúc giai đoạn thử việc và chủ động định hướng phát triển chuyên môn theo mảng Web Development.',
//     ]
//   },
//   {
//     id: 2,
//     company: 'Công ty Cho Thuê Chính Quốc Tế Chailease',
//     role: '.NET Developer',
//     period: '12/2023 - 07/2025',
//     description: [
//       'Tham gia thử việc và làm việc chính thức tại công ty với vai trò .NET Developer, phụ trách phát triển và bảo trì hệ thống website nội bộ theo yêu cầu của các phòng ban.',
//       'Phối hợp với phòng CSD trong việc xây dựng các chức năng soạn thảo, quản lý hợp đồng và hỗ trợ quy trình làm việc với khách hàng.',
//       'Phát triển các tính năng phục vụ nghiệp vụ kế toán như quản lý cho thuê và các nghiệp vụ liên quan theo yêu cầu của phòng Kế toán.',
//       'Tham gia xây dựng và phát triển các chức năng hỗ trợ nghiệp vụ cho phòng Credit.',
//       'Đảm nhiệm chủ yếu mảng backend và thiết kế giao diện cơ bản, sử dụng Visual Basic, ADO.NET và cơ sở dữ liệu SQL Server.',
//       'Thiết kế cơ sở dữ liệu, viết và tối ưu Stored Procedure, Function nhằm đảm bảo hiệu năng và tính ổn định của hệ thống.'
//     ]
//   },
//   {
//     id: 3,
//     company: 'Công ty Bánh Đồng Tiến',
//     role: 'Full Stack Developer',
//     period: '09/2025 - Hiện tại',
//     description: [
//       'Tham gia thử việc và làm việc chính thức tại công ty với vai trò .NET Developer, chịu trách nhiệm toàn bộ quá trình phát triển các phần mềm và module nội bộ.',
//       'Đảm nhiệm cả thiết kế giao diện người dùng (UI) và phát triển backend cho các hệ thống/module theo yêu cầu của công ty.',
//       'Phân tích yêu cầu, đề xuất giải pháp kỹ thuật và trực tiếp triển khai từ giai đoạn thiết kế đến hoàn thiện sản phẩm.',
//       'Xây dựng và tối ưu cơ sở dữ liệu, viết Stored Procedure, Function nhằm đảm bảo hiệu năng và tính ổn định của hệ thống.',
//       'Phối hợp với các bộ phận liên quan để kiểm thử, chỉnh sửa và cải tiến chức năng theo nhu cầu thực tế.'
//     ]
//   }
// ];

// const Experience: React.FC = () => {
//   return (
//     <section id={SectionId.EXPERIENCE} className="py-20 bg-dark relative z-10">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kinh Nghiệm Làm Việc</h2>
//           <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
//         </motion.div>

//         <div className="relative">
//           {/* Vertical Line */}
//           <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-slate-700 rounded-full"></div>

//           <div className="space-y-12">
//             {experiences.map((exp, index) => (
//               <motion.div 
//                 key={exp.id} 
//                 initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true, margin: "-100px" }}
//                 transition={{ duration: 0.6 }}
//                 className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center relative`}
//               >
                
//                 {/* Dot on timeline */}
//                 <div className="absolute left-[-5px] md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-slate-900 z-10 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>

//                 {/* Content Side */}
//                 <div className="w-full md:w-1/2 pl-8 md:pl-0 md:px-8">
//                   <div className={`bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:shadow-primary/10 transition-shadow ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} hover:border-secondary/50 duration-300`}>
//                     <div className={`flex items-center gap-2 text-primary font-bold text-lg mb-1 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
//                       <Briefcase size={18} /> {exp.role}
//                     </div>
//                     <h3 className="text-xl font-bold text-white mb-2">{exp.company}</h3>
//                     <div className={`flex items-center gap-2 text-gray-400 text-sm mb-4 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
//                       <Calendar size={14} /> {exp.period}
//                     </div>
//                     <ul className={`text-gray-300 text-sm space-y-2 list-disc list-inside ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} inline-block`}>
//                       {exp.description.map((item, idx) => (
//                         <li key={idx} className="leading-relaxed">{item}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>

//                 {/* Empty Side for layout balance */}
//                 <div className="hidden md:block w-1/2"></div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Experience;
//-------------------------------------
import React from 'react';
import { SectionId } from '../types';
import { Briefcase, Calendar, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

/* =======================
   Timeline Data
======================= */

type TimelineItem = {
  id: number;
  type: 'education' | 'experience';
  school?: string;
  degree?: string;
  company?: string;
  role?: string;
  period: string;
  description: string[];
};

const timeline: TimelineItem[] = [
  {
    id: 3,
    type: 'experience',
    company: 'Công ty Bánh Đồng Tiến',
    role: 'Full Stack Developer',
    period: '09/2025 - Hiện tại',
    description: [
      'Chịu trách nhiệm end-to-end cho các phần mềm và module nội bộ của công ty.',
      'Thiết kế giao diện người dùng (UI) và phát triển backend cho hệ thống.',
      'Phân tích yêu cầu, đề xuất giải pháp kỹ thuật và triển khai hoàn chỉnh sản phẩm.',
      'Xây dựng và tối ưu cơ sở dữ liệu, cải thiện hiệu năng hệ thống.',
      'Phối hợp với các bộ phận liên quan để kiểm thử và cải tiến chức năng.'
    ]
  },
  {
    id: 2,
    type: 'experience',
    company: 'Công ty Cho Thuê Tài Chính Quốc Tế Chailease',
    role: '.NET Developer',
    period: '12/2023 - 07/2025',
    description: [
      'Phát triển và bảo trì hệ thống website nội bộ theo yêu cầu các phòng ban.',
      'Xây dựng chức năng soạn thảo và quản lý hợp đồng cho phòng CSD.',
      'Phát triển các nghiệp vụ kế toán như quản lý cho thuê theo yêu cầu phòng Kế toán.',
      'Tham gia phát triển các tính năng hỗ trợ nghiệp vụ cho phòng Credit.',
      'Đảm nhiệm backend và thiết kế giao diện cơ bản với Visual Basic, ADO.NET.',
      'Thiết kế CSDL, viết và tối ưu Stored Procedure, Function trên SQL Server.'
    ]
  },
  {
    id: 1,
    type: 'experience',
    company: 'Fujinet Systems',
    role: 'Intern .NET Developer & Probation .NET Developer',
    period: '04/2023 - 10/2023',
    description: [
      'Tham gia chương trình tuyển dụng tại Ngày hội việc làm OpenDay 2023 do HUTECH tổ chức.',
      'Phát triển ứng dụng WinForms với Visual Basic và cơ sở dữ liệu Oracle.',
      'Tham gia dự án WinForms cho khách hàng Nhật Bản sử dụng C#, SQL Server.',
      'Xây dựng và tối ưu Stored Procedure, Function.'
    ]
  },
  {
    id: 0,
    type: 'education',
    school: 'Đại học Công nghệ TP.HCM (HUTECH)',
    degree: 'Cử nhân Công nghệ Thông tin',
    period: '2019 - 2023',
    description: [
      'Chuyên ngành Công nghệ Phần mềm.',
      'Nền tảng về .NET, C#, Java, PHP, Node.js, SQL Server, MongoDB, Firebase, Mobile Developer Java, Flutter và Phân tích thiết kế hệ thống.',
      'Tham gia các đồ án học thuật liên quan đến phát triển phần mềm.'
    ]
  }
];

/* =======================
   Component
======================= */

const Experience: React.FC = () => {
  return (
    <section
      id={SectionId.EXPERIENCE}
      className="py-20 bg-dark relative z-10"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Học vấn & Kinh nghiệm
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          {/* Vertical Line (Tree Trunk) */}
          <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 h-full w-1.5 bg-amber-900/60 rounded-full shadow-[0_0_15px_rgba(120,53,15,0.3)]" />

          <div className="space-y-16">
            {timeline.map((item, index) => {
              const isEducation = item.type === 'education';
              const isEven = index % 2 === 0; // Desktop: Content Right

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: isEven ? 60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } items-center relative`}
                >
                  {/* Tree Branch & Lantern System */}
                  <div className={`absolute top-6 z-10 flex items-center justify-center
                    ${/* Mobile: Left aligned */ 'left-[-4px]'}
                    ${/* Desktop: Center aligned */ 'md:left-1/2 md:-translate-x-1/2'}
                  `}>
                     {/* Connection Node (Trunk knot) */}
                     <div className="absolute w-4 h-4 rounded-full bg-amber-800 border-2 border-amber-600 z-20 shadow-sm" />

                     {/* Branch SVG */}
                     <div className={`relative w-[140px] h-[100px] -mt-12 transition-transform duration-500 pointer-events-none
                        ${/* Mobile: always point right */ 'origin-left'}
                        ${/* Desktop: flip based on side */ isEven ? 'md:scale-x-100' : 'md:-scale-x-100'}
                     `}>
                        <svg width="100%" height="100%" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                          {/* Branch Path */}
                          <path d="M0 50 Q 40 45, 70 50 T 130 40" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                          <path d="M70 50 Q 80 40, 90 35" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
                          
                          {/* Peach Blossoms (Hoa Đào) */}
                          <g className="animate-pulse" style={{ animationDuration: '3s' }}>
                             <circle cx="70" cy="50" r="4" fill="#f472b6" />
                             <circle cx="70" cy="50" r="1.5" fill="#fef08a" />
                          </g>
                          <g className="animate-pulse" style={{ animationDuration: '4s' }}>
                             <circle cx="90" cy="35" r="3" fill="#fbcfe8" />
                             <circle cx="130" cy="40" r="5" fill="#f472b6" />
                             <circle cx="130" cy="40" r="2" fill="#fef08a" />
                          </g>
                          <circle cx="110" cy="45" r="2" fill="#fbcfe8" />
                          
                          {/* Lantern String */}
                          <line x1="100" y1="45" x2="100" y2="65" stroke="#fbbf24" strokeWidth="1" />
                          
                          {/* Lantern Body (Animated Swing) */}
                          <g transform="translate(90, 65)">
                             <animateTransform attributeName="transform" type="rotate" values="5 10 0; -5 10 0; 5 10 0" dur="4s" repeatCount="indefinite" additive="sum" />
                             <path d="M10 0 H10" stroke="#fbbf24" strokeWidth="2" />
                             <rect x="2" y="2" width="16" height="20" rx="5" fill="#dc2626" stroke="#b91c1c" strokeWidth="1" />
                             <rect x="4" y="2" width="12" height="2" fill="#fbbf24" />
                             <rect x="4" y="20" width="12" height="2" fill="#fbbf24" />
                             <path d="M10 22 V 32" stroke="#dc2626" strokeWidth="1.5" />
                             <circle cx="10" cy="32" r="1.5" fill="#fbbf24" />
                             {/* Glow effect */}
                             <circle cx="10" cy="12" r="8" fill="url(#lanternGlow)" opacity="0.6" />
                          </g>
                          
                          <defs>
                            <radialGradient id="lanternGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(10 12) rotate(90) scale(10)">
                              <stop stopColor="#fbbf24" />
                              <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
                            </radialGradient>
                          </defs>
                        </svg>
                     </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-1/2 pl-12 md:px-12">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300">
                      
                      {/* Decoration: Peach Blossom (Hoa Đào) */}
                      <div className="absolute -top-2 -right-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Cành cây uốn lượn */}
                          <path d="M70 10 C 50 30, 30 20, 10 40" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M40 25 C 45 35, 55 35, 60 40" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
                          
                          {/* Hoa đào nở (5 cánh) */}
                          <g transform="translate(10, 40)">
                            <circle cx="0" cy="-5" r="3" fill="#f472b6" />
                            <circle cx="5" cy="-2" r="3" fill="#f472b6" />
                            <circle cx="3" cy="4" r="3" fill="#f472b6" />
                            <circle cx="-3" cy="4" r="3" fill="#f472b6" />
                            <circle cx="-5" cy="-2" r="3" fill="#f472b6" />
                            <circle cx="0" cy="0" r="1.5" fill="#fef08a" />
                          </g>

                          {/* Nụ hoa */}
                          <circle cx="60" cy="40" r="2.5" fill="#fbcfe8" />
                          <circle cx="25" cy="22" r="2" fill="#fbcfe8" />
                        </svg>
                      </div>
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-500/5 rounded-full blur-xl group-hover:bg-pink-500/10 transition-colors" />

                      {/* Header */}
                      <div className="flex items-center gap-2 text-secondary font-semibold mb-1">
                        {isEducation ? <GraduationCap size={18} /> : <Briefcase size={18} />}
                        {isEducation ? item.degree : item.role}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-1">
                        {isEducation ? item.school : item.company}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                        <Calendar size={14} />
                        {item.period}
                      </div>

                      {/* 👇 CĂN ĐỀU NỘI DUNG */}
                      <ul className="text-gray-300 text-sm space-y-2 list-disc list-inside text-justify">
                        {item.description.map((desc, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
