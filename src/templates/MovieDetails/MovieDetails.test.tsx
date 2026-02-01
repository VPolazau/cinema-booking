import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import { MovieDetails } from './MovieDetails';

// mocks
jest.mock('next/link', () => {
    return ({ href, children, ...rest }: any) => (
        <a href={href} {...rest}>
            {children}
        </a>
    );
});

const getAssetUrlMock: jest.Mock<string, [string]> = jest.fn();
const formatDateTimeMock: jest.Mock<string, [string]> = jest.fn();

jest.mock('@utils', () => ({
    getAssetUrl: (p: string) => getAssetUrlMock(p),
    formatDateTime: (iso: string) => formatDateTimeMock(iso),
}));

describe('MovieDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getAssetUrlMock.mockImplementation((p) => `http://localhost:3022${p}`);
        formatDateTimeMock.mockImplementation((iso) => `FMT:${iso}`);
    });

    const movieData = {
        id: 10,
        title: 'The Dark Knight',
        description: 'Some description',
        year: 2008,
        lengthMinutes: 152,
        posterImage: '/static/images/posters/dark_knight.jpg',
        rating: 8.9,
    };

    const cinemasData = [
        { id: 1, name: 'Cinema One', address: 'Addr 1' },
        { id: 2, name: 'Cinema Two', address: 'Addr 2' },
    ];

    it('renders back link to /movies', () => {
        render(<MovieDetails movieData={movieData as any} sessionsData={[]} cinemasData={cinemasData as any} />);

        const backLink = screen.getByRole('link', { name: '← Назад' });
        expect(backLink).toHaveAttribute('href', '/movies');
    });

    it('renders movie card with poster via getAssetUrl', () => {
        render(<MovieDetails movieData={movieData as any} sessionsData={[]} cinemasData={cinemasData as any} />);

        expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
        expect(screen.getByText('2008 • 152 мин')).toBeInTheDocument();
        expect(screen.getByText('Some description')).toBeInTheDocument();

        expect(getAssetUrlMock).toHaveBeenCalledTimes(1);
        expect(getAssetUrlMock).toHaveBeenCalledWith('/static/images/posters/dark_knight.jpg');

        const img = screen.getByAltText('The Dark Knight') as HTMLImageElement;
        expect(img).toHaveAttribute('src', 'http://localhost:3022/static/images/posters/dark_knight.jpg');
    });

    it('shows "Сеансов пока нет" when sessionsData is empty', () => {
        render(<MovieDetails movieData={movieData as any} sessionsData={[]} cinemasData={cinemasData as any} />);

        expect(screen.getByText('Сеансы')).toBeInTheDocument();
        expect(screen.getByText('Сеансов пока нет')).toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('renders sessions table sorted by startTime and links to sessions', () => {
        const sessionsData = [
            {
                id: 200,
                movieId: 10,
                cinemaId: 999,
                startTime: '2026-01-26T18:00:00.000Z',
            },
            {
                id: 100,
                movieId: 10,
                cinemaId: 1,
                startTime: '2026-01-26T10:00:00.000Z',
            },
            {
                id: 300,
                movieId: 10,
                cinemaId: 2,
                startTime: '2026-01-26T12:00:00.000Z',
            },
        ];

        render(
            <MovieDetails
                movieData={movieData as any}
                sessionsData={sessionsData as any}
                cinemasData={cinemasData as any}
            />
        );

        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();

        expect(screen.getByText('Кинотеатр')).toBeInTheDocument();
        expect(screen.getByText('Время')).toBeInTheDocument();
        expect(screen.getByText('Действие')).toBeInTheDocument();

        const rows = within(table).getAllByRole('row').slice(1);
        expect(rows).toHaveLength(3);

        expect(within(rows[0]).getByText('Cinema One')).toBeInTheDocument();
        expect(within(rows[0]).getByText('FMT:2026-01-26T10:00:00.000Z')).toBeInTheDocument();
        expect(within(rows[0]).getByRole('link', { name: 'Выбрать места' })).toHaveAttribute('href', '/sessions/100');

        expect(within(rows[1]).getByText('Cinema Two')).toBeInTheDocument();
        expect(within(rows[1]).getByText('FMT:2026-01-26T12:00:00.000Z')).toBeInTheDocument();
        expect(within(rows[1]).getByRole('link', { name: 'Выбрать места' })).toHaveAttribute('href', '/sessions/300');

        expect(within(rows[2]).getByText('Cinema #999')).toBeInTheDocument();
        expect(within(rows[2]).getByText('FMT:2026-01-26T18:00:00.000Z')).toBeInTheDocument();
        expect(within(rows[2]).getByRole('link', { name: 'Выбрать места' })).toHaveAttribute('href', '/sessions/200');

        expect(formatDateTimeMock).toHaveBeenCalledTimes(3);
        expect(formatDateTimeMock).toHaveBeenCalledWith('2026-01-26T18:00:00.000Z');
        expect(formatDateTimeMock).toHaveBeenCalledWith('2026-01-26T10:00:00.000Z');
        expect(formatDateTimeMock).toHaveBeenCalledWith('2026-01-26T12:00:00.000Z');
    });

    it('does not render movie card when movieData is null', () => {
        render(<MovieDetails movieData={null as any} sessionsData={[]} cinemasData={cinemasData as any} />);

        expect(screen.getByText('Сеансы')).toBeInTheDocument();

        expect(screen.queryByText('The Dark Knight')).not.toBeInTheDocument();
        expect(getAssetUrlMock).not.toHaveBeenCalled();
    });
});