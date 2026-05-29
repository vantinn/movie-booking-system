import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/features/account/types/user";

interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null,
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = accountSlice.actions;
export default accountSlice.reducer;
