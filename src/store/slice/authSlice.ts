import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {LOCAL_STORAGE_CINEMA_KEY} from "@utils";

export type AuthState = {
    token: string | null;
};

const getInitialToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LOCAL_STORAGE_CINEMA_KEY);
};

const initialState: AuthState = {
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem(LOCAL_STORAGE_CINEMA_KEY, action.payload);
            }
        },
        logout(state) {
            state.token = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem(LOCAL_STORAGE_CINEMA_KEY);
            }
        },
        initFromStorage(state) {
            state.token = getInitialToken();
        },
    },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;