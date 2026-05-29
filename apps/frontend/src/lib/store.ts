import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slices/authSlice';
import { authApi } from '@/features/auth/api/authApi';
import { moviesApi } from '@/features/movies/api/movie-api';
import { bookingApi } from '@/features/booking/api/showtime-api';
import bookingReducer from '@/features/booking/slices/bookingSlice';
import { bookingCreateApi } from '@/features/booking/api/booking-api';
import { baseTestApi } from '@/features/payment/api/payment-stripe-api';
import { baseTestApiInt } from '@/features/payment/api/payment-int-api';
import { accountApi } from "@/features/account/api/accountApi";
import accountReducer from "@/features/account/slices/accountSlice";
import { cinemasApi } from "@/features/cinemas/api/cinemasApi";

import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    booking: bookingReducer,
    [authApi.reducerPath]: authApi.reducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [bookingCreateApi.reducerPath]: bookingCreateApi.reducer,
    [baseTestApi.reducerPath]: baseTestApi.reducer,
    [baseTestApiInt.reducerPath]: baseTestApiInt.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [cinemasApi.reducerPath]: cinemasApi.reducer,

  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, moviesApi.middleware, bookingApi.middleware, bookingCreateApi.middleware, baseTestApi.middleware, baseTestApiInt.middleware, accountApi.middleware, cinemasApi.middleware),
});


setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


