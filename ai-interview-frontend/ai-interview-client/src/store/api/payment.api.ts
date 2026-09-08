import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Balance', 'Transactions'],
  endpoints: (builder) => ({
    getBalance: builder.query({
      query: () => '/payments/balance',
      providesTags: ['Balance'],
    }),
    getTransactions: builder.query({
      query: ({ page = 1, limit = 10 }) => `/payments/transactions?page=${page}&limit=${limit}`,
      providesTags: ['Transactions'],
    }),
    createOrder: builder.mutation({
      query: (data: { credits: number }) => ({
        url: '/payments/create-order',
        method: 'POST',
        body: data,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (data: { orderId: string; paymentId: string; signature: string }) => ({
        url: '/payments/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Balance', 'Transactions'],
    }),
  }),
});

export const {
  useGetBalanceQuery,
  useGetTransactionsQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} = paymentApi;