import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    window.gtag?.('config', 'G-GD8BNQSQ1F', {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null;
}