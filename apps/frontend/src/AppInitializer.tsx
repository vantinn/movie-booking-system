'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { setCredentials, logout } from '@/features/auth/slices/authSlice';
import { useRefreshMutation } from '@/features/auth/api/authApi';

/**
 * Silently restores auth state on every page load by calling /auth/refresh.
 * The refresh token lives in an httpOnly cookie so no localStorage is needed.
 * Children are always rendered immediately — no blocking spinner.
 */
export default function AppInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const [refresh] = useRefreshMutation();
    const ran = useRef(false);

    useEffect(() => {
        // StrictMode fires effects twice in dev; guard with a ref
        if (ran.current) return;
        ran.current = true;

        const initAuth = async () => {
            try {
                const result = await refresh().unwrap();
                const refreshData = result?.data;
                if (refreshData?.user) {
                    dispatch(setCredentials(refreshData));
                } else {
                    dispatch(logout());
                }
            } catch {
                dispatch(logout());
            }
        };

        initAuth();
    }, [dispatch, refresh]);

    return <>{children}</>;
}
