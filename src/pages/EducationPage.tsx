import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { getEducation } from '../services/api';
import type { Education } from '../types';

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEducation().then(data => {
      setEducation(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <section className="section">
        <div className="section-header">
          <span className="section-tag">&gt; ACADEMIC_RECORDS.dat</span>
          <h2 className="section-title">Education</h2>
          <p className="section-sub">The foundation of knowledge that powers every line I write</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Share Tech Mono',monospace", color: 'var(--neon)', letterSpacing: 3, fontSize: '0.8rem' }}>
            LOADING...
          </div>
        )}

        {!loading && education.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Share Tech Mono',monospace", color: 'var(--text3)', letterSpacing: 2, fontSize: '0.8rem' }}>
            NO EDUCATION RECORDS — Add some from the admin dashboard
          </div>
        )}

        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: '2rem' }}>
          {education.map(e => (
            <div
              key={e.id}
              style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '2rem', transition: 'all 0.4s', position: 'relative', overflow: 'hidden' }}
              onMouseOver={ev => {
                const el = ev.currentTarget;
                el.style.borderColor = 'var(--border2)';
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                const bar = el.querySelector('.edu-bar') as HTMLElement;
                if (bar) bar.style.height = '100%';
              }}
              onMouseOut={ev => {
                const el = ev.currentTarget;
                el.style.borderColor = 'var(--border)';
                el.style.transform = '';
                el.style.boxShadow = '';
                const bar = el.querySelector('.edu-bar') as HTMLElement;
                if (bar) bar.style.height = '0';
              }}
            >
              <div className="cc tl" /><div className="cc br" />
              <div className="edu-bar" style={{ position: 'absolute', top: 0, left: 0, width: 3, height: 0, background: 'var(--neon)', transition: 'height 0.4s', boxShadow: '0 0 10px var(--neon)' }} />
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', color: 'var(--neon)', letterSpacing: 3, marginBottom: 8 }}>
                {e.year_start}{e.year_end ? ` — ${e.year_end}` : ''}
              </div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{e.degree}</div>
              <div style={{ color: 'var(--green)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>{e.school}</div>
              {e.gpa && (
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem', color: 'var(--text2)', padding: '5px 12px', border: '1px solid var(--border)', display: 'inline-block', marginBottom: '1rem' }}>{e.gpa}</div>
              )}
              {e.honors && e.honors.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {e.honors.map(h => (
                    <span key={h} style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.58rem', padding: '3px 10px', background: 'rgba(61,255,181,0.04)', border: '1px solid var(--border)', color: 'var(--text3)' }}>{h}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
