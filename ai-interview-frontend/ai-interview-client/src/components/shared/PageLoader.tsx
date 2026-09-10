import { LoadingSpinner } from './LoadingSpinner';

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex justify-center items-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}