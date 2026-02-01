import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { MovieList } from './MovieList';

// mocks

jest.mock('next/link', () => {
    return ({ href, children, ...rest }: any) => (
        <a href={href} {...rest}>
            {children}
        </a>
    );
});

const getAssetUrlMock: jest.Mock<string, [string]> = jest.fn();
jest.mock('@utils', () => ({
    getAssetUrl: (path: string) => getAssetUrlMock(path),
}));

jest.mock('@mui/material', () => {
    const actual = jest.requireActual('@mui/material');
    return {
        ...actual,
        Rating: ({ value, readOnly }: any) => (
            <div data-testid="rating" data-value={String(value)} data-readonly={String(Boolean(readOnly))} />
        ),
    };
});

describe('MovieList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getAssetUrlMock.mockImplementation((p) => `http://localhost:3022${p}`);
    });

    const movies = [
        {
            id: 1,
            title: 'The Dark Knight',
            description: '...',
            year: 2008,
            lengthMinutes: 152,
            posterImage: '/static/images/posters/dark_knight.jpg',
            rating: 8.9,
        },
        {
            id: 2,
            title: 'Interstellar',
            description: '...',
            year: 2014,
            lengthMinutes: 169,
            posterImage: '/static/images/posters/interstellar.jpg',
            rating: 9.0,
        },
    ];

    it('renders title', () => {
        render(<MovieList data={movies as any} />);
        expect(screen.getByText('Фильмы')).toBeInTheDocument();
    });

    it('renders cards for each movie', () => {
        render(<MovieList data={movies as any} />);

        expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
        expect(screen.getByText('Interstellar')).toBeInTheDocument();

        expect(screen.getByText('2008 • 152 мин')).toBeInTheDocument();
        expect(screen.getByText('2014 • 169 мин')).toBeInTheDocument();
    });

    it('calls getAssetUrl for each poster and sets img src', () => {
        render(<MovieList data={movies as any} />);

        expect(getAssetUrlMock).toHaveBeenCalledTimes(2);
        expect(getAssetUrlMock).toHaveBeenCalledWith('/static/images/posters/dark_knight.jpg');
        expect(getAssetUrlMock).toHaveBeenCalledWith('/static/images/posters/interstellar.jpg');

        const img1 = screen.getByAltText('The Dark Knight') as HTMLImageElement;
        const img2 = screen.getByAltText('Interstellar') as HTMLImageElement;

        expect(img1).toHaveAttribute('src', 'http://localhost:3022/static/images/posters/dark_knight.jpg');
        expect(img2).toHaveAttribute('src', 'http://localhost:3022/static/images/posters/interstellar.jpg');
    });

    it('renders link to movie sessions page', () => {
        render(<MovieList data={movies as any} />);

        const buttons = screen.getAllByRole('link', { name: 'Просмотреть сеансы' });
        expect(buttons).toHaveLength(2);

        expect(buttons[0]).toHaveAttribute('href', '/movies/1');
        expect(buttons[1]).toHaveAttribute('href', '/movies/2');
    });

    it('renders rating value as rating/2 and readOnly=true', () => {
        render(<MovieList data={movies as any} />);

        const ratings = screen.getAllByTestId('rating');
        expect(ratings).toHaveLength(2);

        expect(ratings[0]).toHaveAttribute('data-value', '4.45');
        expect(ratings[0]).toHaveAttribute('data-readonly', 'true');

        expect(ratings[1]).toHaveAttribute('data-value', '4.5');
        expect(ratings[1]).toHaveAttribute('data-readonly', 'true');
    });

    it('renders nothing besides layout when data is undefined', () => {
        render(<MovieList />);

        expect(screen.getByText('Фильмы')).toBeInTheDocument();

        expect(screen.queryByText('Просмотреть сеансы')).not.toBeInTheDocument();
        expect(getAssetUrlMock).not.toHaveBeenCalled();
    });
});