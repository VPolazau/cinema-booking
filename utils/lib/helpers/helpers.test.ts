import { buildBookedSet, callIfExist, getAssetUrl, seatKey } from '@utils';

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

describe('getAssetUrl', () => {
    const prevEnv = process.env.NEXT_PUBLIC_API_URL;

    beforeEach(() => {
        jest.resetModules();
        process.env.NEXT_PUBLIC_API_URL = prevEnv; // по умолчанию восстановим
    });

    afterAll(() => {
        process.env.NEXT_PUBLIC_API_URL = prevEnv;
    });

    it('returns empty string for empty input', () => {
        expect(getAssetUrl('')).toBe('');
        // @ts-expect-error - intentional
        expect(getAssetUrl(undefined)).toBe('');
        // @ts-expect-error - intentional
        expect(getAssetUrl(null)).toBe('');
    });

    it('returns as-is for absolute http/https url', () => {
        expect(getAssetUrl('http://example.com/a.png')).toBe('http://example.com/a.png');
        expect(getAssetUrl('https://example.com/a.png')).toBe('https://example.com/a.png');
    });

    it('joins base url and path (normalizes slashes)', () => {
        process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3022';

        expect(getAssetUrl('/static/a.png')).toBe('http://localhost:3022/static/a.png');
        expect(getAssetUrl('static/a.png')).toBe('http://localhost:3022/static/a.png');
    });

    it('removes trailing slash from base url', () => {
        process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3022/';

        expect(getAssetUrl('/static/a.png')).toBe('http://localhost:3022/static/a.png');
        expect(getAssetUrl('static/a.png')).toBe('http://localhost:3022/static/a.png');
    });

    it('works when base is not set (returns normalized path only)', () => {
        delete process.env.NEXT_PUBLIC_API_URL;

        expect(getAssetUrl('/static/a.png')).toBe('/static/a.png');
        expect(getAssetUrl('static/a.png')).toBe('/static/a.png');
    });
});

describe('seatKey', () => {
    it('builds key as "row:seat"', () => {
        expect(seatKey({ rowNumber: 1, seatNumber: 2 })).toBe('1:2');
        expect(seatKey({ rowNumber: 10, seatNumber: 30 })).toBe('10:30');
    });
});

describe('buildBookedSet', () => {
    it('returns empty set for empty input', () => {
        const set = buildBookedSet([]);
        expect(set).toBeInstanceOf(Set);
        expect(set.size).toBe(0);
    });

    it('adds keys for each seat', () => {
        const set = buildBookedSet([
            { rowNumber: 1, seatNumber: 1 },
            { rowNumber: 1, seatNumber: 2 },
            { rowNumber: 2, seatNumber: 1 },
        ]);

        expect(set.size).toBe(3);
        expect(set.has('1:1')).toBe(true);
        expect(set.has('1:2')).toBe(true);
        expect(set.has('2:1')).toBe(true);
    });

    it('deduplicates одинаковые места', () => {
        const set = buildBookedSet([
            { rowNumber: 1, seatNumber: 1 },
            { rowNumber: 1, seatNumber: 1 },
            { rowNumber: 1, seatNumber: 1 },
        ]);

        expect(set.size).toBe(1);
        expect(set.has('1:1')).toBe(true);
    });
});