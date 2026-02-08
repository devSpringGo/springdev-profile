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
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { SectionId } from '../types';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const fullText = 'Nguyễn Xuân Tiến';

  const [text, setText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Fireworks Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const particles: any[] = [];
    const colors = ['#ef4444', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#f43f5e'];

    const createExplosion = (x: number, y: number) => {
      const count = 40; // Số lượng hạt mỗi pháo hoa
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    };

    const loop = () => {
      requestAnimationFrame(loop);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Tạo hiệu ứng đuôi mờ
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      // Tự động bắn pháo hoa ngẫu nhiên
      if (Math.random() < 0.03) {
        createExplosion(Math.random() * w, Math.random() * h * 0.6);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // Trọng lực
        p.alpha -= p.decay;
        
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const frameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

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
        <div className="absolute top-[-8%] left-[-8%] w-72 h-72 sm:w-80 sm:h-80 bg-primary/18 rounded-full blur-[80px] animate-blob" />
        <div className="absolute bottom-[-8%] right-[-8%] w-72 h-72 sm:w-80 sm:h-80 bg-secondary/18 rounded-full blur-[80px] animate-blob animation-delay-2000" />
        <div className="absolute top-[45%] left-[45%] w-60 h-60 sm:w-72 sm:h-72 bg-purple-500/14 rounded-full blur-[80px] animate-blob animation-delay-4000" />
        
        {/* Fireworks Canvas Layer */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
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

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
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
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 flex justify-center lg:justify-end mb-8 lg:mb-0"
        >
          <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] group">
            
            {/* 1. Background Aura (Hào quang Tết) */}
            <div className="absolute -inset-6 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-full blur-3xl opacity-50 animate-pulse" />

            {/* 2. Rotating Rings (Vòng xoay tài lộc) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 rounded-full border-[2px] border-dashed border-amber-500/40"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 rounded-full border border-dotted border-red-500/30"
            />

            {/* 3. Main Circular Frame */}
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 bg-slate-900 overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.4)] z-10 relative">
            <img
              src="https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/624905967_4251737148436756_7500851371227167851_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=QbYC9JeFo3wQ7kNvwGwmccR&_nc_oc=AdkRROZboavhJoMMgCDvq8v92CTVGOUSF1AZvHCNrv1AStrjrb3WvSYV-cI1Jv91TSs&_nc_zt=23&_nc_ht=scontent.fhan2-5.fna&_nc_gid=iuar5ybGnO75mdryJiKQ1g&oh=00_Afs_75W-tgtaxZSQB7HgDjUeEo9KXERWAYbIjx7kDr7Q9Q&oe=698BAE63"
              alt="Developer Portrait"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* 4. Floating Badges */}
            
            {/* Badge: Year 2026 (Horse) */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 z-20 bg-gradient-to-r from-amber-400 to-amber-600 text-red-900 font-bold px-4 py-1.5 rounded-full shadow-lg border-2 border-white/20 transform rotate-12 flex items-center gap-1"
            >
              <span>2026</span>
              <span className="text-lg">🐎</span>
            </motion.div>

            {/* Badge: Experience (Red Envelope Style) */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-4 left-0 z-20 bg-red-600 text-amber-100 px-5 py-2 rounded-xl shadow-xl border border-amber-400/50 flex items-center gap-3 transform -rotate-6 hover:rotate-0 transition-transform group-hover:scale-105"
            >
              <div className="relative">
                <div className="w-3 h-3 bg-amber-300 rounded-full animate-ping absolute inset-0" />
                <div className="w-3 h-3 bg-amber-400 rounded-full relative" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-amber-200 font-semibold tracking-wider">Kinh nghiệm</span>
                <span className="text-base font-bold text-white leading-none">2+ Năm</span>
              </div>
            </motion.div>

            {/* Badge: Flag */}
            <div className="absolute bottom-8 right-2 z-20 w-14 h-14 rounded-full border-2 border-amber-500 overflow-hidden shadow-lg bg-slate-800 hover:scale-110 transition-transform">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png"
                alt="Vietnam flag"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative Apricot Blossoms (Hoa Mai) */}
            <div className="absolute top-1/2 -left-4 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_10px_#fbbf24] animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute top-10 -right-2 w-2 h-2 bg-amber-300 rounded-full opacity-80" />
            <div className="absolute -bottom-2 left-1/2 w-2 h-2 bg-red-500 rounded-full blur-[1px]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
