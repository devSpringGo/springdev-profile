// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';

// const CustomCursor: React.FC = () => {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [isHovering, setIsHovering] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // Only enable on desktop
//     const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
//     if (isTouchDevice) return;
    
//     setIsVisible(true);

//     const updateMousePosition = (e: MouseEvent) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
      
//       // Check if hovering over clickable elements
//       const target = e.target as HTMLElement;
//       const isClickable = 
//         target.tagName === 'BUTTON' || 
//         target.tagName === 'A' || 
//         target.tagName === 'INPUT' || 
//         target.tagName === 'TEXTAREA' ||
//         target.closest('button') || 
//         target.closest('a');
        
//       setIsHovering(!!isClickable);
//     };

//     window.addEventListener('mousemove', updateMousePosition);

//     return () => {
//       window.removeEventListener('mousemove', updateMousePosition);
//     };
//   }, []);

//   if (!isVisible) return null;

//   return (
//     <>
//       {/* Main Dot */}
//       <motion.div
//         className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
//         animate={{
//           x: mousePosition.x - 8,
//           y: mousePosition.y - 8,
//           scale: isHovering ? 0 : 1
//         }}
//         transition={{ type: 'spring', stiffness: 1000, damping: 50, mass: 0.1 }}
//       />
      
//       {/* Trailing Ring */}
//       <motion.div
//         className="fixed top-0 left-0 w-10 h-10 border border-primary/50 rounded-full pointer-events-none z-[9998]"
//         animate={{
//           x: mousePosition.x - 20,
//           y: mousePosition.y - 20,
//           scale: isHovering ? 1.5 : 1,
//           backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
//           borderColor: isHovering ? 'rgba(99, 102, 241, 0.8)' : 'rgba(99, 102, 241, 0.3)'
//         }}
//         transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }}
//       />
//     </>
//   );
// };

// export default CustomCursor;
//--------------------------------------------
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouch =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    setVisible(true);

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const el = e.target as HTMLElement;
      setHover(
        !!el.closest('button, a, input, textarea, [role="button"]')
      );
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Center Dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none
                   w-2 h-2 rounded-full bg-primary"
        animate={{
          x: pos.x - 4,
          y: pos.y - 4
        }}
        transition={{ duration: 0.08, ease: 'linear' }}
      />

      {/* Focus Ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none
                   w-7 h-7 rounded-full border border-primary/40"
        animate={{
          x: pos.x - 14,
          y: pos.y - 14,
          scale: hover ? 1.25 : 1,
          opacity: hover ? 0.8 : 0.4
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      />
    </>
  );
};

export default CustomCursor;
