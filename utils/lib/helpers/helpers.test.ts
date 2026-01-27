import { callIfExist } from '@utils';

describe('callIfExist', () => {
    it('calls function with provided arguments if fn exists', () => {
        const fn = jest.fn();

        callIfExist(fn, 1, 'test', true);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(1, 'test', true);
    });

    it('does nothing if fn is undefined', () => {
        expect(() => {
            callIfExist(undefined, 1, 2, 3);
        }).not.toThrow();
    });
});