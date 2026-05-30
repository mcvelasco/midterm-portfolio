import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTyping } from '../hooks/useTyping';

import { getProfile, getSocialLinks } from '../services/api';
import type { Profile, SocialLink } from '../types';
import Footer from '../components/Footer';


export default function HomePage() {
  const navigate = useNavigate();
  const typed = useTyping();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    Promise.all([getProfile(), getSocialLinks()]).then(([p, s]) => {
      setProfile(p);
      setSocialLinks(s);
    });
  }, []);

  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0 }); };

  const fullName = profile?.full_name || 'TERE VELASCO';
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || '';
 /* const initials = nameParts.map((n: string) => n[0]).join(''); */

  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 2rem', paddingTop: 70, position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="hero-inner">
          {/* Text */}
          <div style={{ animation: 'fadeInUp 0.8s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', padding: '6px 16px', marginBottom: '1.5rem', background: 'rgba(61,255,181,0.04)' }}>
              <span style={{ width: 6, height: 6, background: 'var(--neon)', borderRadius: '50%', animation: 'pulse 2s infinite', display: 'block' }} />
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: 'var(--neon)', letterSpacing: 3, textTransform: 'uppercase' }}>Available for Work</span>
            </div>

            <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem' }} className="hero-title">
              {firstName.toUpperCase()}
              {lastName && <><br /><span style={{ display: 'block', color: 'var(--neon)', textShadow: '0 0 40px rgba(61,255,181,0.5)' }}>{lastName.toUpperCase()}</span></>}
            </h1>

            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '1.05rem', color: 'var(--text2)', marginBottom: '2rem', minHeight: '2em' }}>
              {profile?.title
                ? <span style={{ color: 'var(--neon2)' }}>{profile.title}</span>
                : <>I am a <span style={{ color: 'var(--neon2)' }}>{typed}</span><span style={{ animation: 'blink 0.8s infinite', color: 'var(--neon)', display: 'inline-block' }}>|</span></>
              }
            </div>

            {profile?.bio && (
              <p style={{ color: 'var(--text2)', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.9, maxWidth: 500 }} className="hero-desc">
                {profile.bio.split('\n')[0]}
              </p>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }} className="hero-btns">
              <button className="btn-primary" onClick={() => go('/projects')}>View Projects</button>
              <button className="btn-outline" onClick={() => go('/contact')}>Get In Touch</button>
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                {socialLinks.map(s => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', padding: '7px 16px', border: '1px solid var(--border)', color: 'var(--text2)', textDecoration: 'none', letterSpacing: 2, transition: 'all 0.3s', textTransform: 'uppercase' }}
                    onMouseOver={e => { const el = e.currentTarget; el.style.borderColor = 'var(--neon)'; el.style.color = 'var(--neon)'; }}
                    onMouseOut={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text2)'; }}
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Profile Ring */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="hero-img-wrap">
            <div style={{ width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(61,255,181,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spinSlow 20s linear infinite', position: 'relative', flexShrink: 0 }}>
              {[
                { top: '4px', left: '50%', transform: 'translateX(-50%)' },
                { bottom: '4px', left: '50%', transform: 'translateX(-50%)' },
                { left: '4px', top: '50%', transform: 'translateY(-50%)' },
                { right: '4px', top: '50%', transform: 'translateY(-50%)' },
              ].map((pos, i) => (
                <span key={i} style={{ position: 'absolute', width: 8, height: 8, background: 'var(--neon)', borderRadius: '50%', boxShadow: '0 0 12px var(--neon)', ...pos }} />
              ))}
              <div style={{ width: 260, height: 260, borderRadius: '50%', border: '2px solid var(--neon)', boxShadow: '0 0 40px rgba(61,255,181,0.3),inset 0 0 40px rgba(61,255,181,0.05)', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'floatAnim 4s ease-in-out infinite', overflow: 'hidden' }}>
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', animation: 'floatAnim 4s ease-in-out infinite reverse' }} />
                  : <span style={{ fontFamily: "'Orbitron',monospace", fontSize: '5rem', fontWeight: 900, color: 'var(--neon)', textShadow: '0 0 40px rgba(61,255,181,0.8)', animation: 'spinSlow 20s linear infinite reverse' }}> <img src="src/assets/Profile.png" alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /></span>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          onClick={() => go('/about')}
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', opacity: 0.6, transition: 'opacity 0.3s' }}
          onMouseOver={e => (e.currentTarget.style.opacity = '1')}
          onMouseOut={e => (e.currentTarget.style.opacity = '0.6')}
        >
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom,var(--neon),transparent)', animation: 'scrollAnim 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.58rem', color: 'var(--text3)', letterSpacing: 3 }}>SCROLL</span>
        </div>
      </section>

      {/* Contact Info Bar */}
      {profile && (
        <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.5rem 2rem', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            {profile.location && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Location</div>
                <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '0.9rem', color: 'var(--neon)' }}>{profile.location}</div>
              </div>
            )}
            {profile.email && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Email</div>
                <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '0.9rem', color: 'var(--neon)' }}>{profile.email}</div>
              </div>
            )}
            {profile.phone && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Phone</div>
                <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '0.9rem', color: 'var(--neon)' }}>{profile.phone}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Secret Admin Button */}
      <AdminPortalButton />
      <Footer />
    </div>
  );
}

function AdminPortalButton() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => navigate('/admin')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 50, opacity: hovered ? 0.7 : 0.08, transition: 'opacity 0.4s ease' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      {hovered && (
        <div style={{ position: 'absolute', bottom: '110%', right: 0, fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem', color: 'var(--neon)', letterSpacing: 2, whiteSpace: 'nowrap', background: 'var(--bg2)', border: '1px solid var(--border)', padding: '4px 10px', animation: 'fadeInUp 0.2s ease' }}>
          ADMIN PORTAL
        </div>
      )}
    </div>
  );
}
