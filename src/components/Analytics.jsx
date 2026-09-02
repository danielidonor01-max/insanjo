import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GA_ID } from '../utils/analytics';

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    window.gtag?.('config', GA_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null;
}