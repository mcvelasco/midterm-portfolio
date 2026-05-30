import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Experience', path: '/experience' },
  { label: 'Education', path: '/education' },
  { label: 'Projects', path: '/projects' },
  { label: 'Certs', path: '/certificates' },
  { label: 'Contact', path: '/contact' },
];

interface NavbarProps {
  onMobileToggle: () => void;
}

export default function Navbar({ onMobileToggle }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      id="nav"
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
        padding: '0 2rem', transition: 'all 0.3s',
        ...(scrolled ? {
          background: 'rgba(2,27,20,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        } : {})
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        <a
          href="/"
          onClick={e => { e.preventDefault(); navigate('/'); }}
          style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: '1.4rem', color: 'var(--neon)', letterSpacing: 2, textDecoration: 'none' }}
        >
          TERE.DEV<span style={{ animation: 'blink 1s infinite', display: 'inline-block' }}>_</span>
        </a>

        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0 }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <li key={l.path}>
              <a
                onClick={e => { e.preventDefault(); navigate(l.path); window.scrollTo({ top: 0 }); }}
                href={l.path}
                style={{
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: '0.78rem',
                  color: location.pathname === l.path ? 'var(--neon)' : 'var(--text2)',
                  textDecoration: 'none',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  position: 'relative',
                  padding: '4px 0',
                  cursor: 'pointer',
                  transition: 'color 0.3s',
                }}
              >
                {l.label}
                <span style={{
                  position: 'absolute', bottom: 0, left: 0,
                  width: location.pathname === l.path ? '100%' : '0',
                  height: 1, background: 'var(--neon)',
                  transition: 'width 0.3s', boxShadow: '0 0 8px var(--neon)',
                  display: 'block',
                }} />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/contact"
          onClick={e => { e.preventDefault(); navigate('/contact'); }}
          className="desktop-nav"
          style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem', letterSpacing: 2,
            padding: '8px 20px', border: '1px solid var(--neon)', color: 'var(--neon)',
            background: 'transparent', cursor: 'pointer', textTransform: 'uppercase',
            transition: 'all 0.3s', textDecoration: 'none',
          }}
        >
          Hire Me
        </a>

        <button
          className="hamburger-btn"
          onClick={onMobileToggle}
          aria-label="Menu"
          style={{ display: 'none', flexDirection: 'column', gap: 5, cursor: 'pointer', padding: 4, background: 'none', border: 'none' }}
        >
          <span style={{ width: 24, height: 2, background: 'var(--neon)', display: 'block' }} />
          <span style={{ width: 24, height: 2, background: 'var(--neon)', display: 'block' }} />
          <span style={{ width: 24, height: 2, background: 'var(--neon)', display: 'block' }} />
        </button>
      </div>

      <style>{`
        @media(max-width:900px){
          .desktop-nav{ display: none !important; }
          .hamburger-btn{ display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
