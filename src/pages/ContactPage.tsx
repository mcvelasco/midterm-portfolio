import { useState, useEffect } from 'react';
import { sendContactMessage, getProfile, getSocialLinks } from '../services/api';
import type { Profile, SocialLink } from '../types';
import Footer from '../components/Footer';

interface ContactPageProps {
  showToast: (msg: string) => void;
}

export default function ContactPage({ showToast }: ContactPageProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    Promise.all([getProfile(), getSocialLinks()]).then(([p, s]) => {
      setProfile(p);
      setSocialLinks(s);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { showToast('⚠ Fill all required fields'); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { showToast('⚠ Invalid email address'); return; }
    setSending(true);
    try {
      await sendContactMessage(form);
      showToast('✓ Message transmitted successfully!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      showToast('⚠ Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(61,255,181,0.03)', border: '1px solid var(--border)',
    padding: '13px 16px', color: 'var(--text)', fontFamily: "'Rajdhani',sans-serif",
    fontSize: '1rem', transition: 'all 0.3s', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', color: 'var(--text3)',
    letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 8,
  };

  const contactItems = [
    profile?.email   && { icon: '✉', label: 'Email',    val: profile.email },
    profile?.phone   && { icon: '📱', label: 'Phone',    val: profile.phone },
    profile?.location && { icon: '📍', label: 'Location', val: profile.location },
    { icon: '⏱', label: 'Availability', val: 'Open to Opportunities', highlight: true },
  ].filter(Boolean) as { icon: string; label: string; val: string; highlight?: boolean }[];

  return (
    <div>
      <section className="section">
        <div className="section-header">
          <span className="section-tag">&gt; ESTABLISH_CONNECTION.init</span>
          <h2 className="section-title">Contact</h2>
          <p className="section-sub">Let's build something extraordinary together — reach out anytime</p>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '4rem', alignItems: 'start' }} className="contact-wrap">
          {/* Left */}
          <div>
            <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: '1.2rem', color: 'var(--neon)', marginBottom: '1.5rem' }}>Let's Connect</h3>
            {contactItems.map(d => (
              <div key={d.label}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}
                onMouseOver={e => { const ic = e.currentTarget.querySelector('.c-icon-el') as HTMLElement; if (ic) { ic.style.borderColor = 'var(--neon)'; ic.style.boxShadow = '0 0 15px rgba(61,255,181,0.2)'; } }}
                onMouseOut={e => { const ic = e.currentTarget.querySelector('.c-icon-el') as HTMLElement; if (ic) { ic.style.borderColor = 'var(--border2)'; ic.style.boxShadow = ''; } }}
              >
                <div className="c-icon-el" style={{ width: 42, height: 42, border: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0, transition: 'all 0.3s' }}>{d.icon}</div>
                <div>
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: 2, display: 'block', marginBottom: 2 }}>{d.label}</span>
                  <span style={{ color: d.highlight ? 'var(--neon)' : 'var(--text)', fontSize: '0.95rem' }}>{d.val}</span>
                </div>
              </div>
            ))}

            {socialLinks.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                {socialLinks.map(s => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{ minWidth: 44, height: 44, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px', fontSize: '0.75rem', color: 'var(--text2)', cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none', fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1 }}
                    onMouseOver={e => { const el = e.currentTarget; el.style.borderColor = 'var(--neon)'; el.style.color = 'var(--neon)'; el.style.boxShadow = '0 0 20px rgba(61,255,181,0.2)'; el.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text2)'; el.style.boxShadow = ''; el.style.transform = ''; }}
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(61,255,181,0.04)', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', color: 'var(--neon)', letterSpacing: 2, marginBottom: 8 }}>RESPONSE TIME</div>
              <div style={{ fontSize: '0.92rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                Usually responds within <span style={{ color: 'var(--neon)', fontWeight: 700 }}>24 hours</span>. Available for freelance projects, full-time roles, and open source collaboration.
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="cc tl" /><div className="cc tr" /><div className="cc bl" /><div className="cc br" />
            <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: '1.05rem', color: 'var(--neon)' }}>Send Message</h3>
            {['name', 'email', 'subject', 'message'].map(field => (
              <div key={field}>
                <label style={labelStyle}>{field.charAt(0).toUpperCase() + field.slice(1)}{field !== 'subject' ? ' *' : ''}</label>
                {field === 'message'
                  ? <textarea name={field} value={form[field as keyof typeof form]} onChange={handleChange} placeholder="Tell me about your project or idea..." rows={5}
                      style={{ ...inputStyle, resize: 'none' }}
                      onFocus={e => { e.target.style.borderColor = 'var(--neon)'; e.target.style.background = 'rgba(61,255,181,0.05)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'rgba(61,255,181,0.03)'; }}
                    />
                  : <input name={field} value={form[field as keyof typeof form]} onChange={handleChange}
                      type={field === 'email' ? 'email' : 'text'}
                      placeholder={field === 'email' ? 'your@email.com' : field === 'subject' ? "What's this about?" : 'Your full name'}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'var(--neon)'; e.target.style.background = 'rgba(61,255,181,0.05)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'rgba(61,255,181,0.03)'; }}
                    />
                }
              </div>
            ))}
            <button className="btn-primary" onClick={handleSubmit} disabled={sending} style={{ width: '100%', opacity: sending ? 0.7 : 1 }}>
              {sending ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE ›'}
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
