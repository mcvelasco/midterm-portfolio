import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { getSkills, getTechnologies, getProfile } from '../services/api';
import type { Skill, Technology, Profile } from '../types';

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [techs, setTechs] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProfile(), getSkills(), getTechnologies()]).then(([p, s, t]) => {
      setProfile(p);
      setSkills(s);
      setTechs(t);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Share Tech Mono',monospace", color: 'var(--neon)', letterSpacing: 3, fontSize: '0.8rem' }}>LOADING...</div>
    </div>
  );

  const fullName = profile?.full_name || '';
  const initials = fullName.trim().split(' ').map(n => n[0]).join('') || 'TV';

  // Split bio into paragraphs — handles both \n and literal newlines
  const bioParagraphs = profile?.bio
    ? profile.bio.split(/\n+/).map(p => p.trim()).filter(Boolean)
    : [];

  return (
    <div>
      <section className="section">
        <div className="section-header">
          <span className="section-tag">&gt; WHO_AM_I.exe</span>
          <h2 className="section-title">About Me</h2>
          {profile?.title && (
            <p className="section-sub">{profile.title}</p>
          )}
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }} className="about-grid">

          {/* ── LEFT COLUMN ── */}
          <div>

            {/* Bio card */}
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
              <div className="cc tl" /><div className="cc tr" /><div className="cc bl" /><div className="cc br" />

              {/* Avatar + name header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  border: '2px solid var(--neon)',
                  boxShadow: '0 0 20px rgba(61,255,181,0.3)',
                  background: 'var(--bg3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', flexShrink: 0,
                }}>
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontFamily: "'Orbitron',monospace", fontSize: '1.6rem', fontWeight: 900, color: 'var(--neon)' }}>{initials}</span>
                  }
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: '1.2rem', color: 'var(--neon)', marginBottom: 4 }}>
                    {fullName || 'Hello, World!'}
                  </h3>
                  {profile?.title && (
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem', color: 'var(--green)', letterSpacing: 2 }}>
                      {profile.title}
                    </div>
                  )}
                </div>
              </div>

              {/* Bio text */}
              {bioParagraphs.length > 0
                ? bioParagraphs.map((para, i) => (
                    <p key={i} style={{ color: 'var(--text2)', lineHeight: 1.9, marginBottom: i < bioParagraphs.length - 1 ? '1rem' : 0 }}>
                      {para}
                    </p>
                  ))
                : (
                  <p style={{ color: 'var(--text3)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.78rem', lineHeight: 1.8 }}>
                    No bio yet — go to <span style={{ color: 'var(--neon)' }}>Admin → Profile</span> and fill in your bio.
                  </p>
                )
              }

              {/* Contact details under bio */}
              {(profile?.email || profile?.location || profile?.phone) && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {profile.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: 'var(--neon)', fontSize: '0.85rem' }}>✉</span>
                      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem', color: 'var(--text2)' }}>{profile.email}</span>
                    </div>
                  )}
                  {profile.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: 'var(--neon)', fontSize: '0.85rem' }}>📱</span>
                      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem', color: 'var(--text2)' }}>{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: 'var(--neon)', fontSize: '0.85rem' }}>📍</span>
                      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem', color: 'var(--text2)' }}>{profile.location}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tech Arsenal */}
            {techs.length > 0 && (
              <div className="glass-card">
                <div className="cc tl" /><div className="cc tr" /><div className="cc bl" /><div className="cc br" />
                <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: '1rem', color: 'var(--neon)', marginBottom: '1.5rem' }}>Tech Arsenal</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
                  {techs.map(t => (
                    <div
                      key={t.id}
                      style={{ background: 'rgba(61,255,181,0.04)', border: '1px solid var(--border)', padding: '8px 10px', textAlign: 'center', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', color: 'var(--text2)', letterSpacing: 1, transition: 'all 0.3s', cursor: 'default' }}
                      onMouseOver={e => { const el = e.currentTarget; el.style.borderColor = 'var(--neon)'; el.style.color = 'var(--neon)'; el.style.background = 'rgba(61,255,181,0.08)'; }}
                      onMouseOut={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text2)'; el.style.background = 'rgba(61,255,181,0.04)'; }}
                    >
                      {t.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {techs.length === 0 && (
              <div className="glass-card">
                <div className="cc tl" /><div className="cc tr" /><div className="cc bl" /><div className="cc br" />
                <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: '1rem', color: 'var(--neon)', marginBottom: '1rem' }}>Tech Arsenal</h3>
                <p style={{ color: 'var(--text3)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.78rem' }}>
                  No technologies yet — add from <span style={{ color: 'var(--neon)' }}>Admin → Tech Stack</span>.
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div>
            {/* Skill bars */}
            <div className="glass-card">
              <div className="cc tl" /><div className="cc tr" /><div className="cc bl" /><div className="cc br" />
              <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: '1rem', color: 'var(--neon)', marginBottom: '1.5rem' }}>Skill Levels</h3>

              {skills.length > 0
                ? skills.map(s => (
                    <div key={s.id} style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.78rem', color: 'var(--text)', letterSpacing: 1 }}>{s.name}</span>
                        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.78rem', color: 'var(--neon)' }}>{s.percentage}%</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(61,255,181,0.1)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'linear-gradient(to right,var(--green),var(--neon))', width: `${s.percentage}%`, animation: 'fillBar 2.5s ease forwards', position: 'relative' }}>
                          <span style={{ position: 'absolute', right: 0, top: -2, width: 8, height: 8, background: 'var(--neon)', borderRadius: '50%', boxShadow: '0 0 10px var(--neon)', display: 'block' }} />
                        </div>
                      </div>
                    </div>
                  ))
                : (
                  <p style={{ color: 'var(--text3)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.78rem' }}>
                    No skills yet — add from <span style={{ color: 'var(--neon)' }}>Admin → Skills</span>.
                  </p>
                )
              }
            </div>
          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
}
