import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate('/admin/dashboard');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(61,255,181,0.03)', border: '1px solid var(--border)',
    padding: '13px 16px', color: 'var(--text)', fontFamily: "'Rajdhani',sans-serif",
    fontSize: '1rem', outline: 'none', marginBottom: '1.5rem',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', padding: '3rem', maxWidth: 440, width: '100%', boxShadow: '0 0 60px rgba(61,255,181,0.1)' }}>
        <div className="cc tl" /><div className="cc tr" /><div className="cc bl" /><div className="cc br" />
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '2rem', fontWeight: 900, color: 'var(--neon)', marginBottom: 8 }}>ADMIN</div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: 3 }}>SECURE ACCESS PORTAL</div>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.4)', padding: '0.75rem 1rem', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem', color: '#ff6b6b', marginBottom: '1.5rem', letterSpacing: 1 }}>
            ⚠ {error}
          </div>
        )}

        <label style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', color: 'var(--text3)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>EMAIL</label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="admin@email.com" style={inputStyle}
          onFocus={e => { e.target.style.borderColor = 'var(--neon)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
        />

        <label style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', color: 'var(--text3)', letterSpacing: 2, display: 'block', marginBottom: 8 }}>PASSWORD</label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="••••••••" style={inputStyle}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          onFocus={e => { e.target.style.borderColor = 'var(--neon)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
        />

        <button className="btn-primary" onClick={handleLogin} disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM ›'}
        </button>
      </div>
    </div>
  );
}
