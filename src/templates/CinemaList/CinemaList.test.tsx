import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CinemaList } from './CinemaList';

// mocks
jest.mock('next/link', () => {
    return ({ href, children, ...rest }: any) => (
        <a href={href} {...rest}>
            {children}
        </a>
    );
});

describe('CinemaList', () => {
    const cinemas = [
        { id: 1, name: 'Cinema One', address: 'Street 1' },
        { id: 2, name: 'Cinema Two', address: 'Street 2' },
    ];

    it('renders title', () => {
        render(<CinemaList data={cinemas as any} />);
        expect(screen.getByText('Кинотеатры')).toBeInTheDocument();
    });

    it('renders cinema cards with name and address', () => {
        render(<CinemaList data={cinemas as any} />);

        expect(screen.getByText('Cinema One')).toBeInTheDocument();
        expect(screen.getByText('Street 1')).toBeInTheDocument();

        expect(screen.getByText('Cinema Two')).toBeInTheDocument();
        expect(screen.getByText('Street 2')).toBeInTheDocument();
    });

    it('renders correct links to cinema details', () => {
        render(<CinemaList data={cinemas as any} />);

        const links = screen.getAllByRole('link', { name: 'Просмотреть сеансы' });
        expect(links).toHaveLength(2);

        expect(links[0]).toHaveAttribute('href', '/cinemas/1');
        expect(links[1]).toHaveAttribute('href', '/cinemas/2');
    });

    it('does not render items when data is undefined', () => {
        render(<CinemaList data={undefined} />);

        expect(screen.getByText('Кинотеатры')).toBeInTheDocument();

        expect(screen.queryByRole('link', { name: 'Просмотреть сеансы' })).not.toBeInTheDocument();
    });
});