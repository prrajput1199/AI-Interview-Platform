// Lazy load components
import { lazy } from 'react';

export const lazyLoad = (importFn: () => Promise<any>) => {
  return lazy(() =>
    importFn().catch(() => ({
      default: () => (
        <div className="p-8 text-center">
          <p className="text-gray-500">Failed to load component</p>
        </div>
      ),
    }))
  );
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};