import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { SidebarMenu } from './SidebarMenu';

// моки
const pushMock = jest.fn();
const replaceMock = jest.fn();
const usePathnameMock = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: pushMock,
        replace: replaceMock,
    }),
    usePathname: () => usePathnameMock(),
}));

const dispatchMock = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => dispatchMock,
}));

jest.mock('@ui', () => ({
    Separator: () => <div data-testid="separator" />,
}));

const logoutAction = { type: 'auth/logout' };
jest.mock('@/store/slice/authSlice', () => ({
    authActions: {
        logout: () => logoutAction,
    },
}));

describe('SidebarMenu', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        usePathnameMock.mockReturnValue('/movies');
    });

    it('guest: renders Films/Cinemas, hides My tickets, shows Login', () => {
        render(<SidebarMenu isAuthed={false} />);

        expect(screen.getByText('Фильмы')).toBeInTheDocument();
        expect(screen.getByText('Кинотеатры')).toBeInTheDocument();
        expect(screen.queryByText('Мои билеты')).not.toBeInTheDocument();

        expect(screen.getByText('Вход')).toBeInTheDocument();
        expect(screen.queryByText('Выход')).not.toBeInTheDocument();
    });

    it('authed: renders My tickets and shows Logout', () => {
        render(<SidebarMenu isAuthed={true} />);

        expect(screen.getByText('Фильмы')).toBeInTheDocument();
        expect(screen.getByText('Кинотеатры')).toBeInTheDocument();
        expect(screen.getByText('Мои билеты')).toBeInTheDocument();

        expect(screen.getByText('Выход')).toBeInTheDocument();
        expect(screen.queryByText('Вход')).not.toBeInTheDocument();
    });

    it('guest: click Login navigates to auth and calls onAfterNavigate', () => {
        const after = jest.fn();

        render(<SidebarMenu isAuthed={false} onAfterNavigate={after} />);

        fireEvent.click(screen.getByText('Вход'));

        expect(pushMock).toHaveBeenCalledWith('/auth?next=/my-tickets');
        expect(replaceMock).not.toHaveBeenCalled();
        expect(dispatchMock).not.toHaveBeenCalled();

        expect(after).toHaveBeenCalledTimes(1);
    });

    it('authed: click Logout dispatches logout, replaces to /movies and calls onAfterNavigate', () => {
        const after = jest.fn();

        render(<SidebarMenu isAuthed={true} onAfterNavigate={after} />);

        fireEvent.click(screen.getByText('Выход'));

        expect(dispatchMock).toHaveBeenCalledWith(logoutAction);
        expect(replaceMock).toHaveBeenCalledWith('/movies');
        expect(pushMock).not.toHaveBeenCalled();

        expect(after).toHaveBeenCalledTimes(1);
    });

    it('navigates to route on menu item click', () => {
        const after = jest.fn();

        render(<SidebarMenu isAuthed={true} onAfterNavigate={after} />);

        fireEvent.click(screen.getByText('Кинотеатры'));

        expect(pushMock).toHaveBeenCalledWith('/cinemas');
        expect(after).toHaveBeenCalledTimes(1);
    });
});