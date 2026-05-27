import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/lib/store';
import { setCredentials, logout } from '@/features/auth/slices/authSlice';
import type { ApiResponse } from '@/features/types/api';
import { User } from '@/features/auth/types/auth';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_PUBLIC_API_URL || 'http://localhost:3000/api/public/',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;
        if (token) headers.set('authorization', `Bearer ${token}`);
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        const refreshResult = await rawBaseQuery({ url: 'auth/refresh', method: 'POST' }, api, extraOptions);

        if (refreshResult.data && typeof refreshResult.data === 'object') {
            const payload = (refreshResult.data as ApiResponse<{ accessToken: string; refreshToken?: string; user?: User }>).data;

            api.dispatch(
                setCredentials({
                    user: payload.user ?? (api.getState() as RootState).auth.user,
                    accessToken: payload.accessToken,
                    refreshToken: payload.refreshToken ?? (api.getState() as RootState).auth.refreshToken,
                })
            );

            result = await rawBaseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }

    return result;
};
