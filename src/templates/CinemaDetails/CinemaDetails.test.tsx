import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CinemaDetails } from './CinemaDetails';

// mocks
jest.mock('next/link', () => {
    return ({ href, children, ...rest }: any) => (
        <a href={href} {...rest}>
            {children}
        </a>
    );
});

jest.mock('@utils', () => ({
    formatDateTime: (iso: string) => `FMT(${iso})`,
}));

describe('CinemaDetails', () => {
    const cinemaData = { id: 10, name: 'Mirage', address: 'Main street 10' };

    const moviesData = [
        { id: 1, title: 'Dark Knight' },
        { id: 2, title: 'Inception' },
    ];

    const sessionsData = [
        { id: 200, movieId: 2, cinemaId: 10, startTime: '2026-01-26T18:00:00.000Z' },
        { id: 100, movieId: 1, cinemaId: 10, startTime: '2026-01-26T16:00:00.000Z' },
        { id: 300, movieId: 999, cinemaId: 10, startTime: '2026-01-26T20:00:00.000Z' },
    ];

    it('renders back button linking to /cinemas', () => {
        render(
            <CinemaDetails
                cinemaData={cinemaData as any}
                moviesData={moviesData as any}
                sessionsData={[] as any}
            />
        );

        const backLink = screen.getByRole('link', { name: '← Назад' });
        expect(backLink).toHaveAttribute('href', '/cinemas');
    });

    it('renders cinema name and address', () => {
        render(
            <CinemaDetails
                cinemaData={cinemaData as any}
                moviesData={moviesData as any}
                sessionsData={[] as any}
            />
        );

        expect(screen.getByText('Mirage')).toBeInTheDocument();
        expect(screen.getByText('Main street 10')).toBeInTheDocument();
    });

    it('shows empty state when no sessions', () => {
        render(
            <CinemaDetails
                cinemaData={cinemaData as any}
                moviesData={moviesData as any}
                sessionsData={[] as any}
            />
        );

        expect(screen.getByText('Сеансов пока нет')).toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('renders table rows sorted by startTime and uses movie titles / fallback', () => {
        render(
            <CinemaDetails
                cinemaData={cinemaData as any}
                moviesData={moviesData as any}
                sessionsData={sessionsData as any}
            />
        );

        expect(screen.getByRole('table')).toBeInTheDocument();

        expect(screen.getByText('Dark Knight')).toBeInTheDocument();
        expect(screen.getByText('Inception')).toBeInTheDocument();
        expect(screen.getByText('Movie #999')).toBeInTheDocument();

        expect(screen.getByText('FMT(2026-01-26T16:00:00.000Z)')).toBeInTheDocument();
        expect(screen.getByText('FMT(2026-01-26T18:00:00.000Z)')).toBeInTheDocument();
        expect(screen.getByText('FMT(2026-01-26T20:00:00.000Z)')).toBeInTheDocument();

        const rows = screen.getAllByRole('row');
        const firstBodyRow = rows[1];
        expect(firstBodyRow).toHaveTextContent('Dark Knight');
        expect(firstBodyRow).toHaveTextContent('FMT(2026-01-26T16:00:00.000Z)');

        const sessionLinks = screen.getAllByRole('link', { name: 'Выбрать места' });
        expect(sessionLinks).toHaveLength(3);

        expect(sessionLinks[0]).toHaveAttribute('href', '/sessions/100');
        expect(sessionLinks[1]).toHaveAttribute('href', '/sessions/200');
        expect(sessionLinks[2]).toHaveAttribute('href', '/sessions/300');
    });
});