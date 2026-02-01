import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import * as utils from '@utils';

jest.mock('@mui/material', () => {
    const actual = jest.requireActual('@mui/material');
    return {
        ...actual,
        Drawer: ({ open, children }: any) => (open ? <div data-testid="drawer">{children}</div> : null),
    };
});

jest.mock('@ui', () => ({
    Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}));

jest.mock('../SidebarMenu', () => ({
    SidebarMenu: ({ isAuthed }: { isAuthed: boolean }) => (
        <div data-testid="sidebar-menu">{isAuthed ? 'authed' : 'guest'}</div>
    ),
}));

jest.mock('@utils', () => ({
    ...jest.requireActual('@utils'),
    useDeviceMedia: jest.fn(),
    useCommonState: jest.fn(),
}));

import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders fixed sidebar on desktop and hides burger', () => {
        (utils.useDeviceMedia as jest.Mock).mockReturnValue({ isDesktop: true });
        (utils.useCommonState as jest.Mock).mockReturnValue({ auth: { token: null } });

        render(<Sidebar />);

        expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument();
        expect(screen.getByText('guest')).toBeInTheDocument();

        expect(screen.queryByTestId('icon-burger')).not.toBeInTheDocument();
        expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    });

    it('renders burger button on mobile', () => {
        (utils.useDeviceMedia as jest.Mock).mockReturnValue({ isDesktop: false });
        (utils.useCommonState as jest.Mock).mockReturnValue({ auth: { token: null } });

        const { container } = render(<Sidebar />);

        expect(screen.getByTestId('icon-burger')).toBeInTheDocument();
        expect(container.querySelector('.sidebar__burger-btn')).toBeInTheDocument();

        expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    });

    it('opens drawer on burger click', () => {
        (utils.useDeviceMedia as jest.Mock).mockReturnValue({ isDesktop: false });
        (utils.useCommonState as jest.Mock).mockReturnValue({ auth: { token: 'token' } });

        const { container } = render(<Sidebar />);

        const burgerBtn = container.querySelector('.sidebar__burger-btn') as HTMLElement;
        fireEvent.click(burgerBtn);

        expect(screen.getByTestId('drawer')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument();
        expect(screen.getByText('authed')).toBeInTheDocument();
    });

    it('closes drawer on back button click', () => {
        (utils.useDeviceMedia as jest.Mock).mockReturnValue({ isDesktop: false });
        (utils.useCommonState as jest.Mock).mockReturnValue({ auth: { token: null } });

        const { container } = render(<Sidebar />);

        const burgerBtn = container.querySelector('.sidebar__burger-btn') as HTMLElement;
        fireEvent.click(burgerBtn);

        expect(screen.getByTestId('drawer')).toBeInTheDocument();

        const backBtn = container.querySelector('.back-btn') as HTMLElement;
        fireEvent.click(backBtn);

        expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    });
});