'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { MediaQueryProvider } from '@/context';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dynamic from 'next/dynamic';

import './globals.css';

const Sidebar = dynamic(() => import('@/templates').then((mod) => mod.Sidebar), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" style={{ minWidth: '320px', overflowX: 'auto' }} suppressHydrationWarning>
        <body style={{ minWidth: '320px', overflowX: 'auto' }}>
        <Provider store={store}>
            <MediaQueryProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
                        <Sidebar />
                        {children}
                    </div>
                </LocalizationProvider>
            </MediaQueryProvider>
        </Provider>
        </body>
        </html>
    );
}
