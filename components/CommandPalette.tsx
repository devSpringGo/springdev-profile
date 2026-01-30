import React, { useEffect, useState } from 'react';
import { Search, Command, ArrowRight, Home, User, Briefcase, Code, Mail } from 'lucide-react';
import { SectionId } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    { id: 'home', label: 'Go to Home', icon: <Home size={18} />, section: SectionId.HOME },
    { id: 'about', label: 'Go to About', icon: <User size={18} />, section: SectionId.ABOUT },
    { id: 'experience', label: 'Go to Experience', icon: <Briefcase size={18} />, section: SectionId.EXPERIENCE },
    { id: 'projects', label: 'Go to Projects', icon: <Code size={18} />, section: SectionId.PROJECTS },
    { id: 'contact', label: 'Go to Contact', icon: <Mail size={18} />, section: SectionId.CONTACT },
  ];

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden relative z-10"
          >
            <div className="flex items-center px-4 py-3 border-b border-slate-700">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input 
                autoFocus
                type="text" 
                placeholder="Type a command or search..."
                className="bg-transparent border-none focus:ring-0 text-white w-full outline-none placeholder-gray-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-slate-700 px-2 py-1 rounded">
                <span className="text-xs">ESC</span>
              </div>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No results found.
                </div>
              ) : (
                filteredActions.map((action, index) => (
                  <button
                    key={action.id}
                    onClick={() => handleSelect(action.section)}
                    className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between group transition-colors ${
                      index === selectedIndex ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-slate-700'
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center gap-3">
                      {action.icon}
                      <span>{action.label}</span>
                    </div>
                    {index === selectedIndex && <ArrowRight size={16} className="opacity-50" />}
                  </button>
                ))
              )}
            </div>
            
            <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-700 text-[10px] text-gray-500 flex justify-between">
               <span>Use arrow keys to navigate</span>
               <div className="flex items-center gap-1">
                 <Command size={10} /> 
                 <span>+ K to open</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;