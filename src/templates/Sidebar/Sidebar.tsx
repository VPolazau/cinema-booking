'use client';

import {
    Box,
    Drawer,
    IconButton
} from '@mui/material';
import { useState } from 'react';
import {Icon} from '@ui';
import { useCommonState, useDeviceMedia } from '@utils';
import { SidebarMenu } from '../SidebarMenu';

import './Sidebar.styles.scss'

const isActive = (pathname: string | null, href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
};

export const Sidebar = () => {
    const { isDesktop } = useDeviceMedia();
    const [open, setOpen] = useState(false);

    // const { token = 'qwqwrq' } = useCommonState();
    const token = 'qwe';
    const isAuthed = Boolean(token);

    const toggleDrawer = () => setOpen((b) => !b);

    const closeDrawer = () => setOpen(false);

    return (
        <>
            {/* mobile, tablet - Drawer */}
            {!isDesktop && (
                <Box sx={{ position: 'absolute' }}>
                    <IconButton onClick={toggleDrawer} className='sidebar__burger-btn'>
                        <Icon name="burger" />
                    </IconButton>
                    <Drawer anchor="left" open={open} onClose={toggleDrawer} className='sidebar__drawer'>
                        <SidebarMenu isAuthed={isAuthed} onAfterNavigate={closeDrawer} />
                        <IconButton onClick={toggleDrawer} className="back-btn">
                            <Icon name="arrow-chevron-down" rotate={90} />
                        </IconButton>
                    </Drawer>
                </Box>
            )}

            {/* desktop - fixed */}
            {isDesktop && (
                <Box className='sidebar-desktop'>
                    <SidebarMenu isAuthed={isAuthed} />
                </Box>
            )}
        </>
    );
};