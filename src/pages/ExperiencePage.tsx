import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { getExperiences } from '../services/api';
import type { Experience } from '../types';

function TlCard({ exp }: { exp: Experience }) {
  return (
    <div className="glass-card" style={{ position: 'relative' }}>
      <div className="cc tl" /><div className="cc br" />
      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', color: 'var(--neon)', letterSpacing: 2, marginBottom: 8 }}>
        {exp.start_date}{exp.end_date ? ` — ${exp.end_date}` : ''}
      </div>
      <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{exp.position}</div>
      <div style={{ color: 'var(--green)', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>⬡ {exp.company}</div>
      <div style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.7 }}>{exp.description}</div>
      {exp.tags && exp.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {exp.tags.map(t => (
            <span key={t} style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem', padding: '3px 10px', border: '1px solid var(--border)', color: 'var(--text3)', letterSpacing: 1 }}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExperiences().then(data => {
      setExperiences(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <section className="section">
        <div className="section-header">
          <span className="section-tag">&gt; CAREER_PATH.log</span>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-sub">A journey through innovation, collaboration, and relentless learning</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Share Tech Mono',monospace", color: 'var(--neon)', letterSpacing: 3, fontSize: '0.8rem' }}>
            LOADING...
          </div>
        )}

        {!loading && experiences.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Share Tech Mono',monospace", color: 'var(--text3)', letterSpacing: 2, fontSize: '0.8rem' }}>
            NO EXPERIENCE RECORDS — Add some from the admin dashboard
          </div>
        )}

        {experiences.length > 0 && (
          <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }} className="timeline">
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom,transparent,var(--border2) 10%,var(--green) 50%,var(--border2) 90%,transparent)', transform: 'translateX(-50%)' }} className="tl-line" />
            {experiences.map((exp, i) => (
              <div key={exp.id} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', marginBottom: '3rem', alignItems: 'start' }} className="tl-item">
                {i % 2 === 0 ? (
                  <>
                    <div style={{ padding: '0 2rem' }} className="tl-content"><TlCard exp={exp} /></div>
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 14 }} className="tl-node">
                      <div style={{ width: 14, height: 14, background: 'var(--bg)', border: '2px solid var(--neon)', borderRadius: '50%', boxShadow: '0 0 15px rgba(61,255,181,0.5)', zIndex: 1, flexShrink: 0 }} />
                    </div>
                    <div className="tl-empty" />
                  </>
                ) : (
                  <>
                    <div className="tl-empty" />
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 14 }} className="tl-node">
                      <div style={{ width: 14, height: 14, background: 'var(--bg)', border: '2px solid var(--neon)', borderRadius: '50%', boxShadow: '0 0 15px rgba(61,255,181,0.5)', zIndex: 1, flexShrink: 0 }} />
                    </div>
                    <div style={{ padding: '0 2rem' }} className="tl-content"><TlCard exp={exp} /></div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        <style>{`@media(max-width:900px){ .tl-line{ left: 20px !important; } }`}</style>
      </section>
      <Footer />
    </div>
  );
}
