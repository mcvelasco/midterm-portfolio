import { create } from 'zustand';
import type {
  Profile, Skill, Technology, Experience,
  Education, Project, Certificate, SocialLink
} from '../types';
import * as api from '../services/api';

interface PortfolioStore {
  profile: Profile | null;
  skills: Skill[];
  technologies: Technology[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  certificates: Certificate[];
  socialLinks: SocialLink[];
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  profile: null,
  skills: [],
  technologies: [],
  experiences: [],
  education: [],
  projects: [],
  certificates: [],
  socialLinks: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    try {
      const [profile, skills, technologies, experiences, education, projects, certificates, socialLinks] =
        await Promise.all([
          api.getProfile(),
          api.getSkills(),
          api.getTechnologies(),
          api.getExperiences(),
          api.getEducation(),
          api.getProjects(),
          api.getCertificates(),
          api.getSocialLinks(),
        ]);
      set({ profile, skills, technologies, experiences, education, projects, certificates, socialLinks });
    } finally {
      set({ loading: false });
    }
  },
}));
