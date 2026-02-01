'use client';

import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { authActions } from '@/store/slice/authSlice';

export function Providers({ children }: { children: ReactNode }) {
    const initedRef = useRef(false);

    if (!initedRef.current) {
        initedRef.current = true;
        store.dispatch(authActions.initFromStorage());
    }

    return <Provider store={store}>{children}</Provider>;
}
