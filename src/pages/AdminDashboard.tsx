import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import * as api from '../services/api';
import type { Project, Certificate, Skill, Experience, Education, Technology, Profile, ContactMessage } from '../types';

type Tab = 'profile' | 'projects' | 'certificates' | 'skills' | 'experience' | 'education' | 'technologies' | 'messages';

const TABS: { key: Tab; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'projects', label: 'Projects' },
  { key: 'certificates', label: 'Certs' },
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'technologies', label: 'Tech Stack' },
  { key: 'messages', label: 'Messages' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState('');

  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [techs, setTechs] = useState<Technology[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Forms
  const [projForm, setProjForm] = useState({ title: '', category: 'web', description: '', live_url: '', github_url: '', technologies: '' });
  const [certForm, setCertForm] = useState({ title: '', issuer: '', issue_date: '', description: '' });
  const [skillForm, setSkillForm] = useState({ name: '', percentage: 80 });
  const [expForm, setExpForm] = useState({ company: '', position: '', start_date: '', end_date: '', description: '', tags: '' });
  const [eduForm, setEduForm] = useState({ school: '', degree: '', year_start: '', year_end: '', gpa: '', honors: '' });
  const [techForm, setTechForm] = useState({ name: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (!data.session) navigate('/admin'); });
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [p, proj, c, s, exp, edu, t, m] = await Promise.all([
      api.getProfile(), api.getProjects(), api.getCertificates(),
      api.getSkills(), api.getExperiences(), api.getEducation(),
      api.getTechnologies(), api.getContactMessages(),
    ]);
    setProfile(p || {});
    setProjects(proj); setCerts(c); setSkills(s);
    setExperiences(exp); setEducation(edu); setTechs(t);
    setMessages(m as ContactMessage[]);
    setLoading(false);
  };

  const toast = (msg: string) => { setSaved(msg); setTimeout(() => setSaved(''), 3000); };
  const logout = async () => { await supabase.auth.signOut(); navigate('/admin'); };

  // Profile save
  const saveProfile = async () => {
    await api.upsertProfile(profile);
    toast('✓ Profile saved!');
  };

  // Project
  const addProject = async () => {
    if (!projForm.title) return;
    await api.upsertProject({ ...projForm, technologies: projForm.technologies.split(',').map(t => t.trim()).filter(Boolean) });
    setProjForm({ title: '', category: 'web', description: '', live_url: '', github_url: '', technologies: '' });
    setProjects(await api.getProjects());
    toast('✓ Project added!');
  };

  // Certificate
  const addCert = async () => {
    if (!certForm.title) return;
    await api.upsertCertificate(certForm);
    setCertForm({ title: '', issuer: '', issue_date: '', description: '' });
    setCerts(await api.getCertificates());
    toast('✓ Certificate added!');
  };

  // Skill
  const addSkill = async () => {
    if (!skillForm.name) return;
    await api.upsertSkill(skillForm);
    setSkillForm({ name: '', percentage: 80 });
    setSkills(await api.getSkills());
    toast('✓ Skill added!');
  };

  // Experience
  const addExp = async () => {
    if (!expForm.position || !expForm.company) return;
    await api.upsertExperience({ ...expForm, tags: expForm.tags.split(',').map(t => t.trim()).filter(Boolean) });
    setExpForm({ company: '', position: '', start_date: '', end_date: '', description: '', tags: '' });
    setExperiences(await api.getExperiences());
    toast('✓ Experience added!');
  };

  // Education
  const addEdu = async () => {
    if (!eduForm.degree || !eduForm.school) return;
    await api.upsertEducation({ ...eduForm, honors: eduForm.honors.split(',').map(h => h.trim()).filter(Boolean) });
    setEduForm({ school: '', degree: '', year_start: '', year_end: '', gpa: '', honors: '' });
    setEducation(await api.getEducation());
    toast('✓ Education added!');
  };

  // Technology
  const addTech = async () => {
    if (!techForm.name) return;
    await api.upsertTechnology(techForm);
    setTechForm({ name: '' });
    setTechs(await api.getTechnologies());
    toast('✓ Technology added!');
  };

  const card: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1rem' };
  const inp: React.CSSProperties = { background: 'rgba(61,255,181,0.03)', border: '1px solid var(--border)', padding: '10px 14px', color: 'var(--text)', fontFamily: "'Rajdhani',sans-serif", fontSize: '0.95rem', outline: 'none', width: '100%', marginBottom: '0.75rem' };
  const sel: React.CSSProperties = { ...inp, cursor: 'pointer' };
  const tabBtn = (active: boolean): React.CSSProperties => ({
    fontFamily: "'Share Tech Mono',monospace", fontSize: '0.65rem', letterSpacing: 1,
    padding: '7px 14px', border: '1px solid', cursor: 'pointer',
    borderColor: active ? 'var(--neon)' : 'var(--border)',
    color: active ? 'var(--neon)' : 'var(--text2)',
    background: active ? 'rgba(61,255,181,0.05)' : 'transparent',
    transition: 'all 0.3s', textTransform: 'uppercase',
  });
  const delBtn: React.CSSProperties = { background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.4)', color: '#ff6b6b', cursor: 'pointer', padding: '6px 14px', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.65rem', flexShrink: 0 };
  const row: React.CSSProperties = { ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' };
  const sectionLabel: React.CSSProperties = { fontFamily: "'Orbitron',monospace", fontSize: '0.85rem', color: 'var(--neon)', marginBottom: '1.25rem' };

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: '2rem', fontWeight: 900, color: 'var(--neon)' }}>ADMIN DASHBOARD</h1>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: 2, marginTop: 4 }}>PORTFOLIO MANAGEMENT SYSTEM</div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-outline" onClick={() => navigate('/')} style={{ fontSize: '0.7rem', padding: '8px 18px' }}>← PORTFOLIO</button>
            <button className="btn-primary" onClick={logout} style={{ fontSize: '0.7rem', padding: '8px 18px' }}>LOGOUT</button>
          </div>
        </div>

        {/* Toast */}
        {saved && (
          <div style={{ background: 'rgba(61,255,181,0.08)', border: '1px solid var(--neon)', padding: '0.75rem 1.5rem', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.75rem', color: 'var(--neon)', marginBottom: '1.5rem', letterSpacing: 1 }}>
            {saved}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {TABS.map(t => <button key={t.key} style={tabBtn(tab === t.key)} onClick={() => setTab(t.key)}>{t.label}</button>)}
        </div>

        {loading && <div style={{ textAlign: 'center', color: 'var(--neon)', fontFamily: "'Share Tech Mono',monospace", padding: '3rem', letterSpacing: 3 }}>LOADING...</div>}

        {/* ── PROFILE ── */}
        {tab === 'profile' && !loading && (
          <div>
            <div style={card}>
              <div style={sectionLabel}>PROFILE INFO</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div><label style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: 2, display: 'block', marginBottom: 4 }}>FULL NAME</label>
                  <input value={profile.full_name || ''} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} placeholder="Your full name" style={inp} /></div>
                <div><label style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: 2, display: 'block', marginBottom: 4 }}>TITLE / ROLE</label>
                  <input value={profile.title || ''} onChange={e => setProfile(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Full-Stack Developer" style={inp} /></div>
                <div><label style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: 2, display: 'block', marginBottom: 4 }}>EMAIL</label>
                  <input value={profile.email || ''} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" style={inp} /></div>
                <div><label style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: 2, display: 'block', marginBottom: 4 }}>PHONE</label>
                  <input value={profile.phone || ''} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+63 912 345 6789" style={inp} /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: 2, display: 'block', marginBottom: 4 }}>LOCATION</label>
                  <input value={profile.location || ''} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} placeholder="Dumaguete, Philippines · Remote OK" style={inp} /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: 2, display: 'block', marginBottom: 4 }}>AVATAR URL</label>
                  <input value={profile.avatar_url || ''} onChange={e => setProfile(p => ({ ...p, avatar_url: e.target.value }))} placeholder="https://..." style={inp} /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: 2, display: 'block', marginBottom: 4 }}>BIO (use new lines for paragraphs)</label>
                  <textarea value={profile.bio || ''} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Write about yourself..." rows={5} style={{ ...inp, resize: 'vertical' }} /></div>
              </div>
              <button className="btn-primary" onClick={saveProfile} style={{ fontSize: '0.72rem', padding: '10px 24px' }}>SAVE PROFILE</button>
            </div>
          </div>
        )}

        {/* ── PROJECTS ── */}
        {tab === 'projects' && !loading && (
          <div>
            <div style={card}>
              <div style={sectionLabel}>ADD PROJECT</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input placeholder="Title *" value={projForm.title} onChange={e => setProjForm(f => ({ ...f, title: e.target.value }))} style={inp} />
                <select value={projForm.category} onChange={e => setProjForm(f => ({ ...f, category: e.target.value }))} style={sel}>
                  <option value="web">Web App</option><option value="ai">AI / ML</option>
                  <option value="mobile">Mobile</option><option value="tool">Dev Tool</option>
                </select>
              </div>
              <textarea placeholder="Description" value={projForm.description} onChange={e => setProjForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inp, resize: 'none' }} />
              <input placeholder="Live URL (https://...)" value={projForm.live_url} onChange={e => setProjForm(f => ({ ...f, live_url: e.target.value }))} style={inp} />
              <input placeholder="GitHub URL (https://...)" value={projForm.github_url} onChange={e => setProjForm(f => ({ ...f, github_url: e.target.value }))} style={inp} />
              <input placeholder="Technologies (comma separated: React, TypeScript, Node.js)" value={projForm.technologies} onChange={e => setProjForm(f => ({ ...f, technologies: e.target.value }))} style={inp} />
              <button className="btn-primary" onClick={addProject} style={{ fontSize: '0.72rem', padding: '10px 24px' }}>ADD PROJECT</button>
            </div>
            {projects.map(p => (
              <div key={p.id} style={row}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '0.9rem', color: 'var(--text)' }}>{p.title}</div>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--neon)', marginTop: 3 }}>{p.category} {p.technologies?.length ? `· ${p.technologies.join(', ')}` : ''}</div>
                </div>
                <button style={delBtn} onClick={async () => { await api.deleteProject(p.id); setProjects(ps => ps.filter(x => x.id !== p.id)); }}>DELETE</button>
              </div>
            ))}
            {projects.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text3)', fontFamily: "'Share Tech Mono',monospace", padding: '2rem', fontSize: '0.75rem' }}>No projects yet</div>}
          </div>
        )}

        {/* ── CERTIFICATES ── */}
        {tab === 'certificates' && !loading && (
          <div>
            <div style={card}>
              <div style={sectionLabel}>ADD CERTIFICATE</div>
              <input placeholder="Title *" value={certForm.title} onChange={e => setCertForm(f => ({ ...f, title: e.target.value }))} style={inp} />
              <input placeholder="Issuer (e.g. Google, Coursera)" value={certForm.issuer} onChange={e => setCertForm(f => ({ ...f, issuer: e.target.value }))} style={inp} />
              <input placeholder="Issue Date (e.g. January 2024)" value={certForm.issue_date} onChange={e => setCertForm(f => ({ ...f, issue_date: e.target.value }))} style={inp} />
              <textarea placeholder="Description / Skills covered" value={certForm.description} onChange={e => setCertForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inp, resize: 'none' }} />
              <button className="btn-primary" onClick={addCert} style={{ fontSize: '0.72rem', padding: '10px 24px' }}>ADD CERTIFICATE</button>
            </div>
            {certs.map(c => (
              <div key={c.id} style={row}>
                <div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '0.9rem', color: 'var(--text)' }}>{c.title}</div>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--green)', marginTop: 3 }}>{c.issuer} {c.issue_date ? `· ${c.issue_date}` : ''}</div>
                </div>
                <button style={delBtn} onClick={async () => { await api.deleteCertificate(c.id); setCerts(cs => cs.filter(x => x.id !== c.id)); }}>DELETE</button>
              </div>
            ))}
            {certs.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text3)', fontFamily: "'Share Tech Mono',monospace", padding: '2rem', fontSize: '0.75rem' }}>No certificates yet</div>}
          </div>
        )}

        {/* ── SKILLS ── */}
        {tab === 'skills' && !loading && (
          <div>
            <div style={card}>
              <div style={sectionLabel}>ADD SKILL</div>
              <input placeholder="Skill Name * (e.g. React, Python)" value={skillForm.name} onChange={e => setSkillForm(f => ({ ...f, name: e.target.value }))} style={inp} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', color: 'var(--text3)', letterSpacing: 1, minWidth: 80 }}>LEVEL: {skillForm.percentage}%</span>
                <input type="range" min={0} max={100} value={skillForm.percentage} onChange={e => setSkillForm(f => ({ ...f, percentage: +e.target.value }))} style={{ flex: 1, accentColor: 'var(--neon)' }} />
              </div>
              <button className="btn-primary" onClick={addSkill} style={{ fontSize: '0.72rem', padding: '10px 24px' }}>ADD SKILL</button>
            </div>
            {skills.map(s => (
              <div key={s.id} style={row}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.78rem', color: 'var(--text)' }}>{s.name}</span>
                    <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.78rem', color: 'var(--neon)' }}>{s.percentage}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(61,255,181,0.1)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(to right,var(--green),var(--neon))', width: `${s.percentage}%` }} />
                  </div>
                </div>
                <button style={delBtn} onClick={async () => { await api.deleteSkill(s.id); setSkills(ss => ss.filter(x => x.id !== s.id)); }}>DELETE</button>
              </div>
            ))}
            {skills.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text3)', fontFamily: "'Share Tech Mono',monospace", padding: '2rem', fontSize: '0.75rem' }}>No skills yet</div>}
          </div>
        )}

        {/* ── EXPERIENCE ── */}
        {tab === 'experience' && !loading && (
          <div>
            <div style={card}>
              <div style={sectionLabel}>ADD WORK EXPERIENCE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input placeholder="Position / Job Title *" value={expForm.position} onChange={e => setExpForm(f => ({ ...f, position: e.target.value }))} style={inp} />
                <input placeholder="Company Name *" value={expForm.company} onChange={e => setExpForm(f => ({ ...f, company: e.target.value }))} style={inp} />
                <input placeholder="Start Date (e.g. July 2024)" value={expForm.start_date} onChange={e => setExpForm(f => ({ ...f, start_date: e.target.value }))} style={inp} />
                <input placeholder="End Date (e.g. Present)" value={expForm.end_date} onChange={e => setExpForm(f => ({ ...f, end_date: e.target.value }))} style={inp} />
              </div>
              <textarea placeholder="Description of your role and responsibilities" value={expForm.description} onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inp, resize: 'none' }} />
              <input placeholder="Tags (comma separated: React, Node.js, AWS)" value={expForm.tags} onChange={e => setExpForm(f => ({ ...f, tags: e.target.value }))} style={inp} />
              <button className="btn-primary" onClick={addExp} style={{ fontSize: '0.72rem', padding: '10px 24px' }}>ADD EXPERIENCE</button>
            </div>
            {experiences.map(e => (
              <div key={e.id} style={row}>
                <div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '0.9rem', color: 'var(--text)' }}>{e.position}</div>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--green)', marginTop: 3 }}>{e.company} · {e.start_date}{e.end_date ? ` — ${e.end_date}` : ''}</div>
                </div>
                <button style={delBtn} onClick={async () => { await api.deleteExperience(e.id); setExperiences(es => es.filter(x => x.id !== e.id)); }}>DELETE</button>
              </div>
            ))}
            {experiences.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text3)', fontFamily: "'Share Tech Mono',monospace", padding: '2rem', fontSize: '0.75rem' }}>No experience yet</div>}
          </div>
        )}

        {/* ── EDUCATION ── */}
        {tab === 'education' && !loading && (
          <div>
            <div style={card}>
              <div style={sectionLabel}>ADD EDUCATION</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input placeholder="Degree / Course *" value={eduForm.degree} onChange={e => setEduForm(f => ({ ...f, degree: e.target.value }))} style={inp} />
                <input placeholder="School / University *" value={eduForm.school} onChange={e => setEduForm(f => ({ ...f, school: e.target.value }))} style={inp} />
                <input placeholder="Year Start (e.g. 2020)" value={eduForm.year_start} onChange={e => setEduForm(f => ({ ...f, year_start: e.target.value }))} style={inp} />
                <input placeholder="Year End (e.g. 2024 or Present)" value={eduForm.year_end} onChange={e => setEduForm(f => ({ ...f, year_end: e.target.value }))} style={inp} />
                <input placeholder="GPA (e.g. 1.50)" value={eduForm.gpa} onChange={e => setEduForm(f => ({ ...f, gpa: e.target.value }))} style={inp} />
                <input placeholder="Honors (comma separated: Dean's List, Cum Laude)" value={eduForm.honors} onChange={e => setEduForm(f => ({ ...f, honors: e.target.value }))} style={inp} />
              </div>
              <button className="btn-primary" onClick={addEdu} style={{ fontSize: '0.72rem', padding: '10px 24px' }}>ADD EDUCATION</button>
            </div>
            {education.map(e => (
              <div key={e.id} style={row}>
                <div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '0.9rem', color: 'var(--text)' }}>{e.degree}</div>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--green)', marginTop: 3 }}>{e.school} · {e.year_start}{e.year_end ? ` — ${e.year_end}` : ''}</div>
                </div>
                <button style={delBtn} onClick={async () => { await api.deleteEducation(e.id); setEducation(es => es.filter(x => x.id !== e.id)); }}>DELETE</button>
              </div>
            ))}
            {education.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text3)', fontFamily: "'Share Tech Mono',monospace", padding: '2rem', fontSize: '0.75rem' }}>No education yet</div>}
          </div>
        )}

        {/* ── TECHNOLOGIES ── */}
        {tab === 'technologies' && !loading && (
          <div>
            <div style={card}>
              <div style={sectionLabel}>ADD TECHNOLOGY</div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input placeholder="Technology name (e.g. React, Python, Figma)" value={techForm.name} onChange={e => setTechForm({ name: e.target.value })} style={{ ...inp, marginBottom: 0 }}
                  onKeyDown={e => e.key === 'Enter' && addTech()} />
                <button className="btn-primary" onClick={addTech} style={{ fontSize: '0.72rem', padding: '10px 24px', flexShrink: 0 }}>ADD</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '0.75rem' }}>
              {techs.map(t => (
                <div key={t.id} style={{ ...card, marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}>
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.75rem', color: 'var(--neon)' }}>{t.name}</span>
                  <button onClick={async () => { await api.deleteTechnology(t.id); setTechs(ts => ts.filter(x => x.id !== t.id)); }}
                    style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 6px' }}>✕</button>
                </div>
              ))}
            </div>
            {techs.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text3)', fontFamily: "'Share Tech Mono',monospace", padding: '2rem', fontSize: '0.75rem' }}>No technologies yet</div>}
          </div>
        )}

        {/* ── MESSAGES ── */}
        {tab === 'messages' && !loading && (
          <div>
            {messages.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text3)', fontFamily: "'Share Tech Mono',monospace", padding: '3rem', fontSize: '0.75rem' }}>No messages yet</div>}
            {messages.map((m, i) => (
              <div key={i} style={{ ...card, marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontFamily: "'Orbitron',monospace", fontSize: '0.9rem', color: 'var(--text)' }}>{m.name}</span>
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)' }}>{m.created_at ? new Date(m.created_at).toLocaleString() : ''}</span>
                </div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem', color: 'var(--green)', marginBottom: '0.5rem' }}>{m.email}</div>
                {m.subject && <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem', color: 'var(--neon)', marginBottom: '0.5rem' }}>RE: {m.subject}</div>}
                <div style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.7, marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>{m.message}</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
