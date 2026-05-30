import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { getCertificates } from '../services/api';
import type { Certificate } from '../types';

const CERT_ICONS = ['☁', '◉', '⬡', '◈', '⧫', '⛨', '◎', '⬢', '◑'];

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Certificate | null>(null);

  useEffect(() => {
    getCertificates().then(data => {
      setCerts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <section className="section">
        <div className="section-header">
          <span className="section-tag">&gt; CREDENTIALS.vault</span>
          <h2 className="section-title">Certificates</h2>
          <p className="section-sub">Verified credentials and professional achievements unlocked through dedication</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Share Tech Mono',monospace", color: 'var(--neon)', letterSpacing: 3, fontSize: '0.8rem' }}>
            LOADING CERTIFICATES...
          </div>
        )}

        {!loading && certs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Share Tech Mono',monospace", color: 'var(--text3)', letterSpacing: 2, fontSize: '0.8rem' }}>
            NO CERTIFICATES FOUND — Add some from the admin dashboard
          </div>
        )}

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: '2rem' }}>
          {certs.map((c, i) => (
            <div
              key={c.id}
              onClick={() => setModal(c)}
              style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '2rem', textAlign: 'center', transition: 'all 0.4s', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              onMouseOver={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border2)'; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3),0 0 30px rgba(61,255,181,0.1)'; }}
              onMouseOut={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.transform = ''; el.style.boxShadow = ''; }}
            >
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: 8, height: 8, background: 'var(--neon)', borderRadius: '50%', boxShadow: '0 0 8px var(--neon)' }} />

              {/* Icon or image */}
              <div style={{ width: 64, height: 64, border: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.8rem', background: 'rgba(61,255,181,0.04)', transition: 'all 0.3s', overflow: 'hidden' }}>
                {c.image_url
                  ? <img src={c.image_url} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : CERT_ICONS[i % CERT_ICONS.length]
                }
              </div>

              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{c.title}</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem', color: 'var(--green)', marginBottom: 4, letterSpacing: 1 }}>{c.issuer}</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: 2 }}>
                {c.issue_date ? c.issue_date.toUpperCase() : ''} • VERIFIED
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {modal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setModal(null); }}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2,27,20,0.95)', backdropFilter: 'blur(10px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', padding: '3rem', maxWidth: 500, width: '90%', position: 'relative', boxShadow: '0 0 60px rgba(61,255,181,0.1)', animation: 'fadeInUp 0.3s ease' }}>
            <button onClick={() => setModal(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: '1px solid var(--border)', color: 'var(--neon)', cursor: 'pointer', padding: '6px 12px', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', letterSpacing: 1 }}>
              ✕ CLOSE
            </button>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', color: 'var(--neon)', letterSpacing: 3, marginBottom: '1rem' }}>CERTIFICATE RECORD</div>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '1.2rem', color: 'var(--text)', marginBottom: 8 }}>{modal.title}</div>
            <div style={{ color: 'var(--green)', fontSize: '0.95rem', marginBottom: 4 }}>Issued by: {modal.issuer}</div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: 'var(--text3)', marginBottom: '1.5rem', letterSpacing: 2 }}>
              {modal.issue_date ? `DATE: ${modal.issue_date.toUpperCase()}` : ''}
            </div>
            <div style={{ height: 1, background: 'var(--border)', marginBottom: '1.5rem' }} />
            {modal.description && (
              <div style={{ color: 'var(--text2)', fontSize: '0.92rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                Skills covered: {modal.description}
              </div>
            )}
            {modal.image_url && (
              <img src={modal.image_url} alt={modal.title} style={{ width: '100%', maxHeight: 200, objectFit: 'contain', marginBottom: '1.5rem', border: '1px solid var(--border)' }} />
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
