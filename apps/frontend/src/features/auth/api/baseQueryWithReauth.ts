import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import { logout, setCredentials } from '@/features/auth/slices/authSlice';
import { RootState } from '@/lib/store';
import { AuthResponse } from '@/features/auth/types/auth';

const mutex = new Mutex();

/**
 * Base query for auth + protected API calls.
 *
 * BUG FIXED: was hardcoded to a dead ngrok tunnel URL
 *   'https://postmaxillary-variably-justa.ngrok-free.dev/api/v1'
 * causing ALL login / register / refresh requests to fail at the network level.
 *
 * Now reads NEXT_PUBLIC_AUTH_API_URL (set in .env.local / deployment env)
 * with a safe localhost fallback for local development.
 */
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

                /**
                 * BUG FIXED: the old code cast refreshResult.data to RefreshResponse
                 * which has `accessToken` at the top level.  The actual backend
                 * response is `{ data: { accessToken, refreshToken, user } }`, so
                 * `accessToken` was always `undefined` — every retry also got 401.
                 */
                if (refreshResult.data) {
                    const payload = (refreshResult.data as { data: AuthResponse }).data;

                    if (payload?.accessToken) {
                        api.dispatch(setCredentials({
                            user: payload.user ?? (api.getState() as RootState).auth.user,
                            accessToken: payload.accessToken,
                            refreshToken: null,
                        }));

                        // Retry the original request with the refreshed token
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
            // Another request already holds the mutex — wait for it to refresh, then retry
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};
