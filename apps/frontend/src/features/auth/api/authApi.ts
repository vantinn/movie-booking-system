import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/features/auth/api/baseQueryWithReauth';
import { AuthResponse, LoginPayload, RegisterPayload, SendOtpPayload, VerifyOtpPayload } from '../types/auth';
import { setCredentials, logout, updateUserInfo } from '../slices/authSlice';
import { User } from '../types/user';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (data) => ({
        url: 'public/auth/login',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          // handled in the calling hook
        }
      },
    }),

    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (data) => ({
        url: 'public/auth/register',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          // handled in the calling hook
        }
      },
    }),

    refresh: builder.mutation<{ data: AuthResponse }, void>({
      query: () => ({
        url: 'public/auth/refresh',
        method: 'POST',
        credentials: 'include',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const refreshData = result.data?.data;
          if (refreshData?.user) {
            dispatch(setCredentials(refreshData));
          } else {
            dispatch(logout());
          }
        } catch {
          dispatch(logout());
        }
      },
    }),

    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: 'public/auth/logout',
        method: 'POST',
        credentials: 'include',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
        }
      },
    }),

    updateUser: builder.mutation<{ data: User }, Partial<User> & { id: string }>({
      query: ({ id: _id, ...body }) => ({
        url: 'user/users/profile',
        method: 'PUT',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUserInfo(data.data));
        } catch {
          // handled in the calling hook
        }
      },
    }),

    changePassword: builder.mutation<{ data: { message: string } }, { currentPassword: string; newPassword: string }>({
      query: (body) => ({
        url: 'user/users/change-password',
        method: 'POST',
        body,
      }),
    }),

    sendOtp: builder.mutation<{ message: string }, SendOtpPayload>({
      query: (body) => ({
        url: 'public/auth/send-otp',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),

    verifyOtp: builder.mutation<{ message: string }, VerifyOtpPayload>({
      query: (body) => ({
        url: 'public/auth/verify-otp',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutUserMutation,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = authApi;
