import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { commonReducer } from './slice';
import {cinemaApi} from "@/store/api";

export const store = configureStore({
    reducer: combineReducers({
        common: commonReducer,
        [cinemaApi.reducerPath]: cinemaApi.reducer,
    }),
    middleware: (getDefault) => getDefault().concat(cinemaApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;