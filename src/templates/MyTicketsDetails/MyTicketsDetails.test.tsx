import React, { JSX } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { MyTicketsDetails } from './MyTicketsDetails';

// mocks
const replaceMock = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        replace: replaceMock,
    }),
}));

const useMyTicketsMock: jest.Mock<any, []> = jest.fn();

jest.mock('./MyTicketsDetails.hooks', () => ({
    useMyTickets: () => useMyTicketsMock(),
}));

const basePageMock: jest.Mock<JSX.Element, [any]> = jest.fn(({ children }) => (
    <div data-testid="base-page">{children}</div>
));

jest.mock('@ui', () => ({
    BasePage: (props: any) => basePageMock(props),
    Separator: () => <div data-testid="separator" />,
}));

const ticketSectionMock: jest.Mock<JSX.Element, [any]> = jest.fn((props) => (
    <div data-testid={`ticket-section-${props.title}`} />
));

jest.mock('./components/TicketCardSection', () => ({
    TicketCardSection: (props: any) => ticketSectionMock(props),
}));

describe('MyTicketsDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const commonReturn = {
        isLoading: false,
        isError: false,
        paymentSeconds: 120,
        unpaid: [{ booking: { id: 'u1' } }],
        future: [{ booking: { id: 'f1' } }],
        past: [{ booking: { id: 'p1' } }],
        movieTitleById: new Map([[1, 'Movie 1']]),
        cinemaById: new Map([[1, { name: 'Cinema 1', address: 'Addr' }]]),
        onPay: jest.fn(),
        isPaying: false,
    };

    it('redirects to auth and renders null when not authed', () => {
        useMyTicketsMock.mockReturnValue({
            ...commonReturn,
            isAuthed: false,
        });

        const { container } = render(<MyTicketsDetails />);

        expect(container).toBeEmptyDOMElement();

        expect(replaceMock).toHaveBeenCalledTimes(1);
        expect(replaceMock).toHaveBeenCalledWith('/auth?next=/my-tickets');

        expect(screen.queryByTestId('base-page')).not.toBeInTheDocument();
        expect(ticketSectionMock).not.toHaveBeenCalled();
    });

    it('renders page and 3 sections when authed', () => {
        useMyTicketsMock.mockReturnValue({
            ...commonReturn,
            isAuthed: true,
        });

        render(<MyTicketsDetails />);

        expect(replaceMock).not.toHaveBeenCalled();

        expect(screen.getByTestId('base-page')).toBeInTheDocument();
        expect(screen.getByText('Мои билеты')).toBeInTheDocument();

        expect(screen.getByTestId('ticket-section-Неоплаченные')).toBeInTheDocument();
        expect(screen.getByTestId('ticket-section-Будущие')).toBeInTheDocument();
        expect(screen.getByTestId('ticket-section-Прошедшие')).toBeInTheDocument();

        expect(screen.getAllByTestId('separator')).toHaveLength(2);
    });

    it('passes correct props to BasePage and TicketCardSection', () => {
        const onPay = jest.fn();
        const movieTitleById = new Map<number, string>([[10, 'Interstellar']]);
        const cinemaById = new Map<number, { name: string; address: string }>([
            [7, { name: 'Cinema Park', address: 'Main st' }],
        ]);

        useMyTicketsMock.mockReturnValue({
            ...commonReturn,
            isAuthed: true,
            isLoading: true,
            isError: true,
            paymentSeconds: 300,
            unpaid: [{ booking: { id: 'u1' } }],
            future: [{ booking: { id: 'f1' } }],
            past: [{ booking: { id: 'p1' } }],
            movieTitleById,
            cinemaById,
            onPay,
            isPaying: true,
        });

        render(<MyTicketsDetails />);

        expect(basePageMock).toHaveBeenCalledWith(
            expect.objectContaining({
                isPending: true,
                isError: true,
                errorMessage: 'Не удалось загрузить билеты',
            })
        );

        expect(ticketSectionMock).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Неоплаченные',
                items: [{ booking: { id: 'u1' } }],
                paymentSeconds: 300,
                isPaying: true,
                onPay,
                movieTitleById,
                cinemaById,
            })
        );

        expect(ticketSectionMock).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Будущие',
                items: [{ booking: { id: 'f1' } }],
                paymentSeconds: 300,
                isPaying: true,
                onPay,
                movieTitleById,
                cinemaById,
            })
        );

        expect(ticketSectionMock).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Прошедшие',
                items: [{ booking: { id: 'p1' } }],
                paymentSeconds: 300,
                isPaying: true,
                onPay,
                movieTitleById,
                cinemaById,
            })
        );
    });
});