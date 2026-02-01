'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { MediaQueryProvider, Providers } from '@/context';

import './globals.css';

const Sidebar = dynamic(() => import('@/templates').then((mod) => mod.Sidebar), { ssr: false });

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" style={{ minWidth: '320px', overflowX: 'auto' }} suppressHydrationWarning>
            <body style={{ minWidth: '320px', overflowX: 'auto' }}>
                <Providers>
                    <MediaQueryProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Sidebar />
                                {children}
                            </div>
                        </LocalizationProvider>
                    </MediaQueryProvider>
                </Providers>
            </body>
        </html>
    );
}
