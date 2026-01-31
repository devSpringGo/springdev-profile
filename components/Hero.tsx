// import React, { useState, useEffect } from 'react';
// import { ArrowRight, Download, Github, Linkedin } from 'lucide-react';
// import { SectionId } from '../types';
// import { motion } from 'framer-motion';

// const Hero: React.FC = () => {
//   const [text, setText] = useState('');
//   const fullText = "Nguyễn Xuân Tiến";
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [loopNum, setLoopNum] = useState(0);
//   const [typingSpeed, setTypingSpeed] = useState(150);

//   // Typewriter Effect Logic
//   useEffect(() => {
//     const handleType = () => {
//       const i = loopNum % 2; // Toggle between typing and deleting if you wanted multiple phrases
//       // For single name, we just want it to type once and stay, or slight pulse. 
//       // Let's make it Type "Nguyen Van Dev", then "Fullstack Developer" alternating
      
//       const phrases = ["Nguyễn Xuân Tiến", "Fullstack Developer"];
//       const currentPhrase = phrases[loopNum % phrases.length];
      
//       setIsDeleting(false); // Simplification: just type forward for the name
      
//       if (!isDeleting && text !== currentPhrase) {
//         setText(currentPhrase.substring(0, text.length + 1));
//         setTypingSpeed(100);
//       } else if (text === currentPhrase) {
//         // Pause at end
//         setTimeout(() => {
//            setIsDeleting(true);
//         }, 2000);
//         return; 
//       }
//     };
    
//     // Simple typewriter for just the Name to keep it professional
//     if (text.length < fullText.length) {
//        const timeout = setTimeout(() => {
//          setText(fullText.slice(0, text.length + 1));
//        }, 150);
//        return () => clearTimeout(timeout);
//     }

//   }, [text]);

//   const scrollToProjects = () => {
//     document.getElementById(SectionId.PROJECTS)?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <section id={SectionId.HOME} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
//       {/* Background Gradients */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
//         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-blob"></div>
//         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
//         <div className="absolute top-[40%] left-[40%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center">
        
//         <div className="w-full lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20"
//           >
//             Có sẵn cho công việc Freelance
//           </motion.div>
          
//           <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 h-24 lg:h-auto">
//             Xin chào, tôi là <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
//               {text}
//             </span>
//             <span className="animate-pulse text-white">|</span>
//           </h1>
          
//           <motion.p 
//              initial={{ opacity: 0, y: 20 }}
//              animate={{ opacity: 1, y: 0 }}
//              transition={{ duration: 0.5, delay: 0.2 }}
//              className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
//           >
//             Lập trình viên Fullstack với hơn 2 năm kinh nghiệm xây dựng các ứng dụng web hiện đại, hiệu suất cao. 
//             Tôi biến những ý tưởng phức tạp thành giao diện mượt mà và thân thiện với người dùng.
//           </motion.p>
          
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
//           >
//             <button 
//               onClick={scrollToProjects}
//               className="px-8 py-3.5 bg-primary hover:bg-indigo-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-105"
//             >
//               Xem Dự Án <ArrowRight size={20} />
//             </button>
//             <button className="px-8 py-3.5 bg-transparent border border-gray-600 hover:border-white text-gray-300 hover:text-white font-semibold rounded-lg transition-all flex items-center gap-2 hover:bg-white/5">
//               Tải CV <Download size={20} />
//             </button>
//           </motion.div>

//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.6 }}
//             className="mt-10 flex items-center justify-center lg:justify-start gap-6"
//           >
//             {/* <a href="#" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
//               <Github size={24} />
//             </a>
//             <a href="#" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
//               <Linkedin size={24} />
//             </a> */}
//           </motion.div>
//         </div>

//         <motion.div 
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.7 }}
//           className="w-full lg:w-1/2 flex justify-center lg:justify-end"
//         >
//           <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px]">
//             {/* Abstract Tech Illustration placeholder */}
//             <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full animate-pulse blur-3xl"></div>
//             <img 
//               src="https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/274120203_3100112090265940_3954141515582842385_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEmpFp6KZ_UQwYWVvSJ9yC0RuV0SrKbiOlG5XRKspuI6Sv63UnJ3S95vt7lp5z7tpOkEnOIOV1qvhUHJQdUDkf1&_nc_ohc=WhyP-MBKdS0Q7kNvwE3tyPH&_nc_oc=AdmhEkVofcvJRqh33oM8mlAl5NhxK_I3lpwxpXkgnfFPy8kAI3kowOIfinAn5b7CbS8&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=Ma7VPsj4Oc8zwIh6Tmg9uw&oh=00_Afti_O2GiWcustvOuR54OBKBNwak0N0nN2eaQ9RNrhn_UQ&oe=69832B85" 
//               alt="Developer Portrait" 
//               className="relative w-full h-full object-cover rounded-2xl border-2 border-gray-700/50 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 z-10"
//             />
//              {/* Decorative Elements */}
//              <motion.div
//                 animate={{ y: [0, -12, 0], opacity: [0.9, 1, 0.9] }}
//                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//                 className="absolute -top-6 -right-6 w-28 h-20 
//                           bg-gray-800/80 backdrop-blur 
//                           border border-gray-600 rounded-full 
//                           shadow-xl z-20 flex items-center justify-center"
//               >
//                 <span className="text-3xl">💭</span>
//               </motion.div>

//              <motion.div 
//                animate={{ y: [0, 10, 0] }}
//                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//                className="absolute -bottom-5 -left-5 w-auto px-6 py-3 bg-dark border border-gray-700 rounded-lg shadow-xl z-20 flex items-center gap-2"
//              >
//                 <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
//                 <span className="text-sm font-bold text-white">2+ Năm Kinh Nghiệm</span>
//              </motion.div>
//           </div>
//         </motion.div>

//       </div>
//     </section>
//   );
// };

// export default Hero;
//--------------------------------------------
import React, { useState, useEffect } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { SectionId } from '../types';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const fullText = 'Nguyễn Xuân Tiến';

  const [text, setText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  // Typewriter – type once, then stop
  useEffect(() => {
    if (text.length < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, 140);

      return () => clearTimeout(timeout);
    } else {
      setIsTypingDone(true);
    }
  }, [text, fullText]);

  const scrollToProjects = () => {
    document
      .getElementById(SectionId.PROJECTS)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id={SectionId.HOME}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center">
        {/* Left content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20"
          >
            Có sẵn cho công việc Freelance
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 h-24 lg:h-auto">
            Xin chào, tôi là <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {text}
            </span>
            {!isTypingDone && (
              <span className="ml-1 animate-pulse text-white">|</span>
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed
                      text-left text-justify"
          >
            Lập trình viên Fullstack với hơn 2 năm kinh nghiệm xây dựng các ứng
            dụng web hiện đại, hiệu suất cao. Tôi biến những ý tưởng phức tạp
            thành giao diện mượt mà và thân thiện với người dùng.
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              onClick={scrollToProjects}
              className="px-8 py-3.5 bg-primary hover:bg-indigo-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-105"
            >
              Xem Dự Án <ArrowRight size={20} />
            </button>

            <button className="px-8 py-3.5 bg-transparent border border-gray-600 hover:border-white text-gray-300 hover:text-white font-semibold rounded-lg transition-all flex items-center gap-2 hover:bg-white/5">
              Tải CV <Download size={20} />
            </button>
          </motion.div>
        </div>

        {/* Right image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 flex justify-center lg:justify-end"
        >
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-3xl animate-pulse" />

            <img
              src="https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/274120203_3100112090265940_3954141515582842385_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEmpFp6KZ_UQwYWVvSJ9yC0RuV0SrKbiOlG5XRKspuI6Sv63UnJ3S95vt7lp5z7tpOkEnOIOV1qvhUHJQdUDkf1&_nc_ohc=WhyP-MBKdS0Q7kNvwE3tyPH&_nc_oc=AdmhEkVofcvJRqh33oM8mlAl5NhxK_I3lpwxpXkgnfFPy8kAI3kowOIfinAn5b7CbS8&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=Ma7VPsj4Oc8zwIh6Tmg9uw&oh=00_Afti_O2GiWcustvOuR54OBKBNwak0N0nN2eaQ9RNrhn_UQ&oe=69832B85" 
              alt="Developer Portrait"
              className="relative w-full h-full object-cover rounded-2xl border-2 border-gray-700/50 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 z-10"
            />

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 w-28 h-20 bg-gray-800/80 backdrop-blur border border-gray-600 rounded-full shadow-xl z-20 flex items-center justify-center"
            >
              <span className="text-3xl">💭</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 -left-5 px-6 py-3 bg-dark border border-gray-700 rounded-lg shadow-xl z-20 flex items-center gap-2"
            >
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
              <span className="text-sm font-bold text-white">
                2+ Năm Kinh Nghiệm
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
