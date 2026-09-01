import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/** Scrolls to a `#section` on the home page, or navigates home with the hash otherwise. */
export function useSectionNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = useCallback((href) => {
    const sectionId = href.replace('#', '');
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/${href}`);
    }
  }, [location.pathname, navigate]);

  return { scrollToSection };
}
