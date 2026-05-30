import { useState, useEffect, useRef } from 'react';

const PHRASES = [
  'Full-Stack Developer',
  'UI/UX Designer',
  'AI Enthusiast',
  'Open Source Contributor',
  'Problem Solver',
];

export function useTyping() {
  const [text, setText] = useState('');
  const state = useRef({ pi: 0, ci: 0, del: false });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const { pi, ci, del } = state.current;
      const word = PHRASES[pi];
      if (!del) {
        const next = ci + 1;
        setText(word.slice(0, next));
        state.current.ci = next;
        if (next === word.length) {
          state.current.del = true;
          timeout = setTimeout(tick, 1600);
        } else {
          timeout = setTimeout(tick, 85);
        }
      } else {
        const next = ci - 1;
        setText(word.slice(0, next));
        state.current.ci = next;
        if (next === 0) {
          state.current.del = false;
          state.current.pi = (pi + 1) % PHRASES.length;
        }
        timeout = setTimeout(tick, 55);
      }
    };

    timeout = setTimeout(tick, 600);
    return () => clearTimeout(timeout);
  }, []);

  return text;
}
