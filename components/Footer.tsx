import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Nguyễn Xuân Tiến. All rights reserved.
        </p>
        {/* <p className="text-gray-600 text-xs mt-2">
          Designed with ❤️ AI assistance.
        </p> */}
      </div>
    </footer>
  );
};

export default Footer;