import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-amber-500/20 py-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Nguyễn Xuân Tiến. All rights reserved.
        </p>
        
        <div className="mt-4 flex items-center justify-center gap-3">
           <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-amber-500/30"></div>
           <p className="text-xs text-amber-500/70 font-medium flex items-center gap-2 uppercase tracking-wider">
             <span>🌸</span> 
             <span>Xuân Bính Ngọ 2026</span>
             <span>🌸</span>
           </p>
           <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-amber-500/30"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;