import { useEffect, useRef } from 'react';

interface ToastProps {
  message: string;
  onHide: () => void;
}

export default function Toast({ message, onHide }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (message) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onHide, 3500);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [message, onHide]);

  return (
    <div className={`toast ${message ? 'show' : ''}`}>
      {message}
    </div>
  );
}
