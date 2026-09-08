import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/analytics/dashboard',
      providesTags: ['Analytics'],
    }),
    getPerformanceTrend: builder.query({
      query: (days = 30) => `/analytics/trend?days=${days}`,
      providesTags: ['Analytics'],
    }),
    getSkillEvaluation: builder.query({
      query: () => '/analytics/skills',
      providesTags: ['Analytics'],
    }),
    getQuestionPerformance: builder.query({
      query: () => '/analytics/questions',
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetPerformanceTrendQuery,
  useGetSkillEvaluationQuery,
  useGetQuestionPerformanceQuery,
} = analyticsApi;