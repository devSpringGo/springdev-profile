import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LuckyMoney from './components/LuckyMoney'; // mới
import AIChat from './components/AIChat';
import ParticleBackground from './components/ParticleBackground';
import AudioPlayer from './components/AudioPlayer';
import CustomCursor from './components/CustomCursor';
import CommandPalette from './components/CommandPalette';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div className="bg-dark text-slate-200 min-h-screen font-sans selection:bg-primary selection:text-white relative cursor-none">
      <CustomCursor />
      <ParticleBackground />
      <CommandPalette />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        {/* <LuckyMoney />    */}

        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <AIChat />
      <ScrollToTop />
      <AudioPlayer />
      <Footer />
    </div>
  );
}

export default App;