import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { getProjects } from '../services/api';
import type { Project } from '../types';

const CAT_ICONS: Record<string, string> = {
  web: '◈', ai: '⬡', mobile: '◯', tool: '⟐', default: '◇',
};

const CAT_LABELS: Record<string, string> = {
  web: 'Web Application', ai: 'AI / Machine Learning',
  mobile: 'Mobile Application', tool: 'Developer Tool',
};

const FILTERS = [
  { key: 'all', label: 'All Systems' },
  { key: 'web', label: 'Web Apps' },
  { key: 'ai', label: 'AI / ML' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'tool', label: 'Dev Tools' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const visible = projects.filter(p => activeFilter === 'all' || p.category === activeFilter);

  return (
    <div>
      <section className="section">
        <div className="section-header">
          <span className="section-tag">&gt; PROJECTS_ARCHIVE.sh</span>
          <h2 className="section-title">My Projects</h2>
          <p className="section-sub">A showcase of crafted solutions and digital innovations</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', letterSpacing: 2,
                padding: '8px 20px', border: '1px solid', cursor: 'pointer',
                transition: 'all 0.3s', textTransform: 'uppercase',
                borderColor: activeFilter === f.key ? 'var(--neon)' : 'var(--border)',
                color: activeFilter === f.key ? 'var(--neon)' : 'var(--text2)',
                background: activeFilter === f.key ? 'rgba(61,255,181,0.05)' : 'transparent',
              }}
            >{f.label}</button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Share Tech Mono',monospace", color: 'var(--neon)', letterSpacing: 3, fontSize: '0.8rem' }}>
            LOADING PROJECTS...
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Share Tech Mono',monospace", color: 'var(--text3)', letterSpacing: 2, fontSize: '0.8rem' }}>
            NO PROJECTS FOUND — Add some from the admin dashboard
          </div>
        )}

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '2rem' }}>
          {visible.map((p, i) => (
            <div
              key={p.id}
              style={{ background: 'var(--card)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden', transition: 'all 0.4s', animation: 'fadeInUp 0.4s ease forwards' }}
              onMouseOver={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border2)'; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4),0 0 40px rgba(61,255,181,0.07)'; }}
              onMouseOut={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.transform = ''; el.style.boxShadow = ''; }}
            >
              {/* Image / placeholder */}
              <div style={{ height: 190, background: p.image_url ? 'var(--bg3)' : 'linear-gradient(135deg,var(--bg3),var(--bg2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'rgba(61,255,181,0.12)', position: 'relative', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : CAT_ICONS[p.category] || CAT_ICONS.default
                }
                <span style={{ position: 'absolute', top: '1rem', right: '1rem', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', color: 'var(--text3)' }}>[{String(i + 1).padStart(2, '0')}]</span>
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 2, background: 'linear-gradient(to right,transparent,var(--neon),transparent)' }} />
              </div>

              <div style={{ padding: '1.5rem' }}>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--neon)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
                  {CAT_LABELS[p.category] || p.category}
                </div>
                <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{p.title}</div>
                <div style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1rem' }}>{p.description}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.5rem' }}>
                  {(p.technologies || []).map(t => (
                    <span key={t} style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.58rem', padding: '3px 10px', background: 'rgba(0,168,107,0.1)', border: '1px solid rgba(0,168,107,0.3)', color: 'var(--green)', letterSpacing: 1 }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.65rem', padding: '7px 14px', border: '1px solid var(--neon)', textDecoration: 'none', color: 'var(--neon)', background: 'rgba(61,255,181,0.05)', letterSpacing: 1 }}>
                      Live Demo
                    </a>
                  )}
                  {p.github_url && (
                    <a href={p.github_url} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.65rem', padding: '7px 14px', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text2)', letterSpacing: 1 }}>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
