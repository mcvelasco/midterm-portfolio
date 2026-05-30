export interface Profile {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatar_url: string;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  created_at: string;
}

export interface Technology {
  id: string;
  name: string;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  tags: string[];
  created_at: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year_start: string;
  year_end: string;
  gpa: string;
  honors: string[];
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  live_url: string;
  github_url: string;
  technologies: string[];
  created_at: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  created_at: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}
