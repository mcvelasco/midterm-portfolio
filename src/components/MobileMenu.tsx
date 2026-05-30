import { useNavigate } from 'react-router-dom';

const LINKS = [
  { label: 'HOME', path: '/' },
  { label: 'ABOUT', path: '/about' },
  { label: 'EXPERIENCE', path: '/experience' },
  { label: 'EDUCATION', path: '/education' },
  { label: 'PROJECTS', path: '/projects' },
  { label: 'CERTS', path: '/certificates' },
  { label: 'CONTACT', path: '/contact' },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0 });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
      background: 'rgba(2,27,20,0.98)', backdropFilter: 'blur(30px)',
      zIndex: 200, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '2rem',
      transform: open ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'none', border: '1px solid var(--border)',
          color: 'var(--neon)', cursor: 'pointer', padding: '8px 16px',
          fontFamily: "'Share Tech Mono',monospace", fontSize: '1rem', letterSpacing: 2,
        }}
      >
        ✕ CLOSE
      </button>
      {LINKS.map(l => (
        <a
          key={l.path}
          onClick={() => go(l.path)}
          style={{
            fontFamily: "'Orbitron',monospace", fontSize: '1.4rem',
            color: 'var(--text2)', textDecoration: 'none', letterSpacing: 4,
            cursor: 'pointer', transition: 'all 0.3s',
          }}
          onMouseOver={e => {
            (e.target as HTMLElement).style.color = 'var(--neon)';
            (e.target as HTMLElement).style.textShadow = '0 0 20px var(--neon)';
          }}
          onMouseOut={e => {
            (e.target as HTMLElement).style.color = 'var(--text2)';
            (e.target as HTMLElement).style.textShadow = 'none';
          }}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
