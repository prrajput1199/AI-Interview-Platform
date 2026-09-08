import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const resumeApi = createApi({
  reducerPath: 'resumeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Resume'],
  endpoints: (builder) => ({
    uploadResume: builder.mutation({
      query: (formData) => ({
        url: '/resume/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Resume'],
    }),
    getResume: builder.query({
      query: () => '/resume',
      providesTags: ['Resume'],
    }),
    deleteResume: builder.mutation({
      query: (resumeId) => ({
        url: `/resume/${resumeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resume'],
    }),
  }),
});

export const { useUploadResumeMutation, useGetResumeQuery, useDeleteResumeMutation } = resumeApi;