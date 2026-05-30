import { supabase } from '../lib/supabase';
import type {
  Profile, Skill, Technology, Experience,
  Education, Project, Certificate, SocialLink, ContactMessage
} from '../types';

// ---- Profile ----
export const getProfile = async (): Promise<Profile | null> => {
  const { data } = await supabase.from('profiles').select('*').maybeSingle();
  return data;
};

export const upsertProfile = async (profile: Partial<Profile>) => {
  // Check if a profile row already exists
  const { data: existing } = await supabase.from('profiles').select('id').maybeSingle();
  if (existing?.id) {
    // Update existing row by id
    const { data } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', existing.id)
      .select()
      .single();
    return data;
  } else {
    // Insert first-time row
    const { data } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    return data;
  }
};

// ---- Skills ----
export const getSkills = async (): Promise<Skill[]> => {
  const { data } = await supabase.from('skills').select('*').order('created_at');
  return data || [];
};
export const upsertSkill = async (skill: Partial<Skill>) => {
  const { data } = await supabase.from('skills').upsert(skill).select().single();
  return data;
};
export const deleteSkill = async (id: string) => {
  await supabase.from('skills').delete().eq('id', id);
};

// ---- Technologies ----
export const getTechnologies = async (): Promise<Technology[]> => {
  const { data } = await supabase.from('technologies').select('*').order('created_at');
  return data || [];
};
export const upsertTechnology = async (tech: Partial<Technology>) => {
  const { data } = await supabase.from('technologies').upsert(tech).select().single();
  return data;
};
export const deleteTechnology = async (id: string) => {
  await supabase.from('technologies').delete().eq('id', id);
};

// ---- Experiences ----
export const getExperiences = async (): Promise<Experience[]> => {
  const { data } = await supabase.from('experiences').select('*').order('created_at', { ascending: false });
  return data || [];
};
export const upsertExperience = async (exp: Partial<Experience>) => {
  const { data } = await supabase.from('experiences').upsert(exp).select().single();
  return data;
};
export const deleteExperience = async (id: string) => {
  await supabase.from('experiences').delete().eq('id', id);
};

// ---- Education ----
export const getEducation = async (): Promise<Education[]> => {
  const { data } = await supabase.from('education').select('*').order('year_start', { ascending: false });
  return data || [];
};
export const upsertEducation = async (edu: Partial<Education>) => {
  const { data } = await supabase.from('education').upsert(edu).select().single();
  return data;
};
export const deleteEducation = async (id: string) => {
  await supabase.from('education').delete().eq('id', id);
};

// ---- Projects ----
export const getProjects = async (): Promise<Project[]> => {
  const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  return data || [];
};
export const upsertProject = async (project: Partial<Project>) => {
  const { data } = await supabase.from('projects').upsert(project).select().single();
  return data;
};
export const deleteProject = async (id: string) => {
  await supabase.from('projects').delete().eq('id', id);
};

// ---- Certificates ----
export const getCertificates = async (): Promise<Certificate[]> => {
  const { data } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
  return data || [];
};
export const upsertCertificate = async (cert: Partial<Certificate>) => {
  const { data } = await supabase.from('certificates').upsert(cert).select().single();
  return data;
};
export const deleteCertificate = async (id: string) => {
  await supabase.from('certificates').delete().eq('id', id);
};

// ---- Social Links ----
export const getSocialLinks = async (): Promise<SocialLink[]> => {
  const { data } = await supabase.from('social_links').select('*');
  return data || [];
};
export const upsertSocialLink = async (link: Partial<SocialLink>) => {
  const { data } = await supabase.from('social_links').upsert(link).select().single();
  return data;
};
export const deleteSocialLink = async (id: string) => {
  await supabase.from('social_links').delete().eq('id', id);
};

// ---- Contact Messages ----
export const sendContactMessage = async (msg: ContactMessage) => {
  const { data, error } = await supabase.from('contact_messages').insert(msg).select().single();
  if (error) throw error;
  return data;
};
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  return data || [];
};

// ---- Storage ----
export const uploadImage = async (bucket: string, path: string, file: File): Promise<string | null> => {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
