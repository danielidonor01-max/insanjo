import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function HashScrollHandler() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    // Small delay to ensure the DOM has rendered
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [hash]);

  return null;
}