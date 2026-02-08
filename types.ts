export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  demoUrl?: string;
  repoUrl?: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum SectionId {
  HOME = 'home',
  ABOUT = 'about',
  EXPERIENCE = 'experience',
  PROJECTS = 'projects',
    LUCKY = 'lucky',          // mới
  CONTACT = 'contact'
}