import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import { logout, setCredentials } from '@/features/auth/slices/authSlice';
import { RootState } from '@/lib/store';
import { AuthResponse } from '@/features/auth/types/auth';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3000/api/',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();

    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                const refreshResult = await baseQuery(
                    { url: 'public/auth/refresh', method: 'POST' },
                    api,
                    extraOptions
                );

                if (refreshResult.data) {
                    const payload = (refreshResult.data as { data: AuthResponse }).data;

                    if (payload?.accessToken) {
                        api.dispatch(setCredentials({
                            user: payload.user ?? (api.getState() as RootState).auth.user,
                            accessToken: payload.accessToken,
                            refreshToken: null,
                        }));

                        result = await baseQuery(args, api, extraOptions);
                    } else {
                        api.dispatch(logout());
                    }
                } else {
                    api.dispatch(logout());
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};
