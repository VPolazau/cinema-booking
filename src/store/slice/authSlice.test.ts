import reducer, { authActions } from './authSlice';

jest.mock('@utils', () => ({
    LOCAL_STORAGE_CINEMA_KEY: 'cinema_token_test_key',
}));

const STORAGE_KEY = 'cinema_token_test_key';

describe('authSlice', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it('returns initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual({ token: null });
    });

    it('setToken - sets token in state and localStorage', () => {
        const state = reducer(undefined, authActions.setToken('abc123'));

        expect(state.token).toBe('abc123');
        expect(localStorage.getItem(STORAGE_KEY)).toBe('abc123');
    });

    it('logout - clears token in state and localStorage', () => {
        localStorage.setItem(STORAGE_KEY, 'abc123');

        const prevState = { token: 'abc123' };
        const state = reducer(prevState, authActions.logout());

        expect(state.token).toBe(null);
        expect(localStorage.getItem(STORAGE_KEY)).toBe(null);
    });

    it('initFromStorage - loads token from localStorage', () => {
        localStorage.setItem(STORAGE_KEY, 'from_storage');

        const state = reducer({ token: null }, authActions.initFromStorage());

        expect(state.token).toBe('from_storage');
    });

    it('initFromStorage - sets null when storage is empty', () => {
        localStorage.removeItem(STORAGE_KEY);

        const state = reducer({ token: 'something' }, authActions.initFromStorage());

        expect(state.token).toBe(null);
    });
});