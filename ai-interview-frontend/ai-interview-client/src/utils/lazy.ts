import { lazy } from 'react';

export const LazyDashboard = lazy(() => 
  import('../pages/Dashboard').then(module => ({ default: module.default }))
);

export const LazyInterviewSetup = lazy(() => 
  import('../pages/InterviewSetup').then(module => ({ default: module.default }))
);

export const LazyInterviewSession = lazy(() => 
  import('../pages/InterviewSession').then(module => ({ default: module.default }))
);

export const LazyInterviewReport = lazy(() => 
  import('../pages/InterviewReport').then(module => ({ default: module.default }))
);

export const LazyInterviewHistory = lazy(() => 
  import('../pages/InterviewHistory').then(module => ({ default: module.default }))
);

export const LazyAnalytics = lazy(() => 
  import('../pages/Analytics').then(module => ({ default: module.default }))
);

export const LazyPayment = lazy(() => 
  import('../pages/Payment').then(module => ({ default: module.default }))
);

export const LazyProfile = lazy(() => 
  import('../pages/Profile').then(module => ({ default: module.default }))
);