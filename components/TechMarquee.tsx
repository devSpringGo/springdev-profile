import React from 'react';

const techs = [
  "C#, VB", ".NET", "Java", "PHP", "Node.JS", "React", "TypeScript", "TailwindCSS", "SQL Server", "MongoDB", 
  "Source Tree", "Oracle", "Mobile Developer", "Flutter", "Git", "Vite"
];

const TechMarquee: React.FC = () => {
  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] py-10">
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll">
        {techs.map((tech, index) => (
          <li key={index} className="text-2xl font-bold text-slate-600 hover:text-white transition-colors cursor-default whitespace-nowrap">
            {tech}
          </li>
        ))}
      </ul>
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll" aria-hidden="true">
        {techs.map((tech, index) => (
          <li key={`duplicate-${index}`} className="text-2xl font-bold text-slate-600 hover:text-white transition-colors cursor-default whitespace-nowrap">
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TechMarquee;