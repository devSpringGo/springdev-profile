// import React from 'react';
// import { SectionId, Project } from '../types';
// import { ExternalLink, Github } from 'lucide-react';
// import { motion } from 'framer-motion';
// import TiltCard from './TiltCard';

// const projectList: Project[] = [
//   {
//     id: 1,
//     title: 'E-commerce Dashboard',
//     description: 'Hệ thống quản lý bán hàng toàn diện với thống kê doanh thu thời gian thực, quản lý đơn hàng và kho hàng.',
//     techStack: ['React', 'TypeScript', 'Tailwind', 'Recharts'],
//     imageUrl: 'https://picsum.photos/600/400?random=1',
//     demoUrl: '#',
//     repoUrl: '#'
//   },
//   {
//     id: 2,
//     title: 'AI Content Generator',
//     description: 'Ứng dụng tích hợp Gemini API để tự động tạo nội dung marketing, blog post và email cho doanh nghiệp.',
//     techStack: ['Next.js', 'OpenAI API', 'PostgreSQL'],
//     imageUrl: 'https://picsum.photos/600/400?random=2',
//     demoUrl: '#',
//     repoUrl: '#'
//   },
//   {
//     id: 3,
//     title: 'Task Management App',
//     description: 'Ứng dụng quản lý công việc cá nhân và đội nhóm theo mô hình Kanban, hỗ trợ kéo thả và real-time update.',
//     techStack: ['React', 'Firebase', 'DnD Kit'],
//     imageUrl: 'https://picsum.photos/600/400?random=3',
//     demoUrl: '#',
//     repoUrl: '#'
//   },
// ];

// const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2
//       }
//     }
//   };
  
//   const item = {
//     hidden: { opacity: 0, y: 50 },
//     show: { opacity: 1, y: 0 }
//   };

// const Projects: React.FC = () => {
//   return (
//     <section id={SectionId.PROJECTS} className="py-20 bg-slate-900/50 backdrop-blur-sm relative perspective-1000">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Dự Án Nổi Bật</h2>
//           <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
//           <p className="mt-4 text-gray-400">Những sản phẩm tôi đã xây dựng bằng tâm huyết và kỹ năng.</p>
//         </motion.div>

//         <motion.div 
//             variants={container}
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true }}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//         >
//           {projectList.map((project) => (
//             <motion.div key={project.id} variants={item} className="h-full">
//               <TiltCard className="h-full">
//                 <div 
//                     className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 h-full flex flex-col group relative z-10"
//                 >
//                   <div className="relative h-48 overflow-hidden transform-style-3d translate-z-10">
//                     <img 
//                       src={project.imageUrl} 
//                       alt={project.title} 
//                       className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
//                     />
//                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
//                       <a href={project.demoUrl} className="p-2 bg-primary rounded-full text-white hover:bg-indigo-600 transition-colors transform hover:scale-110" title="Live Demo">
//                         <ExternalLink size={20} />
//                       </a>
//                       <a href={project.repoUrl} className="p-2 bg-slate-700 rounded-full text-white hover:bg-slate-600 transition-colors transform hover:scale-110" title="Github Code">
//                         <Github size={20} />
//                       </a>
//                     </div>
//                   </div>
                  
//                   <div className="p-6 flex flex-col flex-grow transform-style-3d translate-z-10 bg-slate-800">
//                     <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
//                     <p className="text-gray-400 text-sm mb-4 flex-grow line-clamp-3">
//                       {project.description}
//                     </p>
//                     <div className="flex flex-wrap gap-2 mt-auto">
//                       {project.techStack.map((tech, idx) => (
//                         <span key={idx} className="px-2 py-1 bg-slate-700 text-xs font-medium text-primary rounded border border-slate-600 shadow-sm">
//                           {tech}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </TiltCard>
//             </motion.div>
//           ))}
//         </motion.div>
        
//         <div className="text-center mt-12">
//            <button className="px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all rounded-lg text-sm font-semibold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
//               Xem tất cả dự án trên Github
//            </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Projects;
//-----------------
import React from 'react';
import { SectionId } from '../types';
import { Hammer } from 'lucide-react';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 }
};

const Projects: React.FC = () => {
  return (
    <section
      id={SectionId.PROJECTS}
      className="py-20 bg-slate-900/50 backdrop-blur-sm relative perspective-1000"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Dự Án
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          <p className="mt-4 text-gray-400">
            Các dự án đang được hoàn thiện và sẽ sớm được cập nhật.
          </p>
        </motion.div>

        {/* Placeholder Card */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <motion.div variants={item} className="w-full max-w-md">
            <TiltCard>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center flex flex-col items-center gap-4 hover:border-primary/50 transition">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  <Hammer size={32} />
                </div>

                <h3 className="text-xl font-bold text-white">
                  Dự án đang cập nhật
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed">
                  Hiện tại tôi đang hoàn thiện và tối ưu các dự án cá nhân cũng như
                  dự án thực tế. Nội dung sẽ được cập nhật trong thời gian sớm nhất.
                </p>

                <span className="mt-4 px-4 py-1 text-xs font-semibold uppercase tracking-wider
                  text-primary border border-primary/40 rounded-full">
                  Coming Soon
                </span>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
