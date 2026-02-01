import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const commonReducer = combineReducers({
    auth: authReducer,
});

export type CommonState = ReturnType<typeof commonReducer>;