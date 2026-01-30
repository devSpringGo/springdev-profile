import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use a royalty-free ambient track
  const AUDIO_URL = "music.mp3"; 

  useEffect(() => {
    audioRef.current = new Audio("music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Low volume for background
    
    // Attempt to autoplay
    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Autoplay started successfully
          setIsPlaying(true);
        })
        .catch((error) => {
          // Autoplay was prevented by browser policy (user interaction required)
          console.log("Autoplay blocked by browser policy:", error);
          setIsPlaying(false);
        });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={togglePlay}
        className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
          isPlaying 
            ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
            : 'bg-slate-800/50 border-gray-600 text-gray-400 hover:bg-slate-800'
        }`}
      >
        <div className={`relative flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
           <Music size={16} />
        </div>
        <span className="text-xs font-medium hidden sm:inline-block">
            {isPlaying ? 'Lo-Fi Chill' : 'Music Off'}
        </span>
        {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
      
      {/* Visualizer bars simulation */}
      {isPlaying && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-end gap-1 h-6">
           <div className="w-1 bg-primary animate-[bounce_1s_infinite] h-3"></div>
           <div className="w-1 bg-secondary animate-[bounce_1.2s_infinite] h-5"></div>
           <div className="w-1 bg-primary animate-[bounce_0.8s_infinite] h-2"></div>
           <div className="w-1 bg-secondary animate-[bounce_1.5s_infinite] h-4"></div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;