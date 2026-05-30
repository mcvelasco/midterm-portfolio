import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  name?: string;
}

export default function Footer({ name = 'TERE VELASCO' }: FooterProps) {
  const initials = name.split(' ').map(n => n[0]).join('');
  const navigate = useNavigate();
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hint, setHint] = useState(false);

  // Triple-click the copyright text → go to admin
  const handleSecretClick = () => {
    clickCount.current += 1;

    if (clickCount.current === 2) {
      setHint(true); // show subtle hint after 2nd click
    }

    if (clickCount.current >= 3) {
      clickCount.current = 0;
      setHint(false);
      if (clickTimer.current) clearTimeout(clickTimer.current);
      navigate('/admin');
      return;
    }

    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
      setHint(false);
    }, 1500);
  };

  return (
    <footer>
      <div className="footer-logo">{initials}.DEV</div>
      <div className="footer-line" />
      <div
        onClick={handleSecretClick}
        style={{ cursor: 'default', userSelect: 'none', position: 'relative', display: 'inline-block' }}
        title=""
      >
        <div className="footer-text">© 2026 {name} — ALL SYSTEMS OPERATIONAL</div>
        {hint && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 6,
            fontFamily: "'Share Tech Mono',monospace",
            fontSize: '0.6rem',
            color: 'var(--neon)',
            letterSpacing: 2,
            opacity: 0.6,
            whiteSpace: 'nowrap',
            animation: 'fadeInUp 0.3s ease',
            pointerEvents: 'none',
          }}>
            CLICK ONCE MORE...
          </div>
        )}
      </div>
    </footer>
  );
}
