import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthResponse, User } from '@/features/auth/types/auth';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {


    setCredentials(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.error = null;
    },
    updateUserInfo(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, updateUserInfo, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;

