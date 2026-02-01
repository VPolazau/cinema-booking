'use client';


import { useState } from 'react';
import {
    Box,
    Drawer,
    IconButton
} from '@mui/material';

import {Icon} from '@ui';
import { useCommonState, useDeviceMedia } from '@utils';

import { SidebarMenu } from '../SidebarMenu';

import './Sidebar.styles.scss'

export const Sidebar = () => {
    const { isDesktop } = useDeviceMedia();
    const { auth } = useCommonState();

    const [open, setOpen] = useState(false);
    const isAuthed = Boolean(auth.token);

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