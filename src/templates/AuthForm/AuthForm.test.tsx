import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import { AuthForm } from './AuthForm';

// ---------- mocks ----------
const replaceMock = jest.fn();
const useSearchParamsMock = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ replace: replaceMock }),
    useSearchParams: () => useSearchParamsMock(),
}));

const dispatchMock = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => dispatchMock,
}));

const loginTriggerMock = jest.fn();
const registerTriggerMock = jest.fn();

jest.mock('@/store/api', () => ({
    useLoginMutation: () => [loginTriggerMock, { isLoading: false }],
    useRegisterMutation: () => [registerTriggerMock, { isLoading: false }],
}));

jest.mock('@/store/slice/authSlice', () => ({
    authActions: {
        setToken: (token: string) => ({ type: 'auth/setToken', payload: token }),
    },
}));

describe('AuthForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useSearchParamsMock.mockReturnValue({
            get: (key: string) => (key === 'next' ? '/my-tickets' : null),
        });

        loginTriggerMock.mockImplementation(() => ({
            unwrap: () => Promise.resolve({ token: 'TOKEN_LOGIN' }),
        }));

        registerTriggerMock.mockImplementation(() => ({
            unwrap: () => Promise.resolve({ token: 'TOKEN_REGISTER' }),
        }));
    });

    const fillLogin = (username = 'username12345', password = 'password12345') => {
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: username } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: password } });
    };

    const fillRegister = (username = 'username12345', password = 'Password1', confirmation = 'Password1') => {
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: username } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: password } });
        fireEvent.change(screen.getByLabelText(/Password confirmation/i), { target: { value: confirmation } });
    };

    it('renders login tab by default (heading + selected tab + login submit)', () => {
        render(<AuthForm />);

        expect(screen.getByRole('heading', { level: 5, name: 'Вход' })).toBeInTheDocument();

        const loginTab = screen.getByRole('tab', { name: 'Вход' });
        expect(loginTab).toHaveAttribute('aria-selected', 'true');

        expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();

        expect(screen.queryByRole('button', { name: 'Зарегистрироваться' })).not.toBeInTheDocument();
    });

    it('switches to register tab and changes heading', () => {
        render(<AuthForm />);

        fireEvent.click(screen.getByRole('tab', { name: 'Регистрация' }));

        expect(screen.getByRole('heading', { level: 5, name: 'Регистрация' })).toBeInTheDocument();

        const registerTab = screen.getByRole('tab', { name: 'Регистрация' });
        expect(registerTab).toHaveAttribute('aria-selected', 'true');

        expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Войти' })).not.toBeInTheDocument();
    });

    it('successful login: dispatches token and redirects to next', async () => {
        useSearchParamsMock.mockReturnValue({
            get: (key: string) => (key === 'next' ? '/movies' : null),
        });

        render(<AuthForm />);

        fillLogin('user12345', 'password12345');

        fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

        await waitFor(() => {
            expect(loginTriggerMock).toHaveBeenCalledWith({ username: 'user12345', password: 'password12345' });
        });

        await waitFor(() => {
            expect(dispatchMock).toHaveBeenCalledWith({ type: 'auth/setToken', payload: 'TOKEN_LOGIN' });
            expect(replaceMock).toHaveBeenCalledWith('/movies');
        });
    });

    it('login error: shows required error message text', async () => {
        loginTriggerMock.mockImplementation(() => ({
            unwrap: () => Promise.reject(new Error('401')),
        }));

        render(<AuthForm />);

        fillLogin('user12345', 'password12345');
        fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

        expect(
            await screen.findByText('Неверный логин или пароль. Проверьте введенные данные и попробуйте снова')
        ).toBeInTheDocument();

        expect(dispatchMock).not.toHaveBeenCalled();
        expect(replaceMock).not.toHaveBeenCalled();
    });

    it('successful register: dispatches token and redirects to /my-tickets', async () => {
        render(<AuthForm />);

        fireEvent.click(screen.getByRole('tab', { name: 'Регистрация' }));

        fillRegister('user12345', 'Password1', 'Password1');
        fireEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

        await waitFor(() => {
            expect(registerTriggerMock).toHaveBeenCalledWith({ username: 'user12345', password: 'Password1' });
        });

        await waitFor(() => {
            expect(dispatchMock).toHaveBeenCalledWith({ type: 'auth/setToken', payload: 'TOKEN_REGISTER' });
            expect(replaceMock).toHaveBeenCalledWith('/my-tickets');
        });
    });

    it('register error: shows error message', async () => {
        registerTriggerMock.mockImplementation(() => ({
            unwrap: () => Promise.reject(new Error('409')),
        }));

        render(<AuthForm />);

        fireEvent.click(screen.getByRole('tab', { name: 'Регистрация' }));

        fillRegister('user12345', 'Password1', 'Password1');
        fireEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

        expect(await screen.findByText('Не удалось зарегистрироваться. Попробуйте ещё раз')).toBeInTheDocument();

        expect(dispatchMock).not.toHaveBeenCalled();
        expect(replaceMock).not.toHaveBeenCalled();
    });

    it('clears formError when switching tabs', async () => {
        loginTriggerMock.mockImplementation(() => ({
            unwrap: () => Promise.reject(new Error('401')),
        }));

        render(<AuthForm />);

        fillLogin('user12345', 'password12345');
        fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

        const errorText = 'Неверный логин или пароль. Проверьте введенные данные и попробуйте снова';
        expect(await screen.findByText(errorText)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('tab', { name: 'Регистрация' }));

        expect(screen.queryByText(errorText)).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 5, name: 'Регистрация' })).toBeInTheDocument();
    });

    it('uses default next=/my-tickets when query param is missing', async () => {
        useSearchParamsMock.mockReturnValue({
            get: () => null,
        });

        render(<AuthForm />);

        fillLogin('user12345', 'password12345');
        fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

        await waitFor(() => {
            expect(replaceMock).toHaveBeenCalledWith('/my-tickets');
        });
    });
});