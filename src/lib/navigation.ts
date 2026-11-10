import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Global tracker to record distinct page transitions into sessionStorage.
 * This guarantees that back buttons can reliably navigate to the real previous page
 * instead of looping on the same page when URL search params or iframe reloads occur.
 */
export const RouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const current = location.pathname;
      const last = window.sessionStorage.getItem('lfjp_current_route');
      if (last && last !== current) {
        window.sessionStorage.setItem('lfjp_prev_route', last);
      }
      window.sessionStorage.setItem('lfjp_current_route', current);
    } catch {
      // ignore storage access errors
    }
  }, [location.pathname]);

  return null;
};

/**
 * Hook providing a robust back-navigation handler that:
 * 1. Checks the last distinct route in sessionStorage.
 * 2. Checks document.referrer if from the same origin.
 * 3. Checks browser history if it has genuine history depth.
 * 4. Falls back to a logical parent path (default: /plan-strategique).
 */
export const useSmartBack = (defaultFallback: string = '/plan-strategique') => {
  const navigate = useNavigate();
  const location = useLocation();

  return () => {
    if (typeof window !== 'undefined') {
      try {
        const prev = window.sessionStorage.getItem('lfjp_prev_route');
        if (prev && prev !== location.pathname) {
          navigate(prev);
          return;
        }

        if (typeof document !== 'undefined' && document.referrer) {
          try {
            const refUrl = new URL(document.referrer);
            if (refUrl.origin === window.location.origin && refUrl.pathname !== location.pathname) {
              navigate(refUrl.pathname + refUrl.search);
              return;
            }
          } catch {
            // ignore URL parse error
          }
        }

        if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
          navigate(-1);
          return;
        }
      } catch {
        // ignore
      }
    }

    navigate(defaultFallback);
  };
};
