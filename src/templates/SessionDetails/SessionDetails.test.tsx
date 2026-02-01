import React, { JSX } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { SessionDetails } from './SessionDetails';

// mocks
jest.mock('next/navigation', () => ({
    useParams: () => ({ movieSessionId: '123' }),
}));

const useSessionBookingMock = jest.fn();

jest.mock('./SessionDetails.hooks', () => ({
    useSessionBooking: (id: number) => useSessionBookingMock(id),
}));

jest.mock('@ui', () => ({
    BasePage: ({ children }: any) => <div data-testid="base-page">{children}</div>,
    Separator: () => <div data-testid="separator" />,
}));

const seatMapMock: jest.Mock<JSX.Element, [any]> = jest.fn((props) => <div data-testid="seat-map" />);

jest.mock('./components/SeatMap', () => ({
    SeatMap: (props: any) => seatMapMock(props),
}));

describe('SessionDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const sessionData = {
        id: 123,
        startTime: '2026-01-26T16:30:44.776Z',
        seats: { rows: 10, seatsPerRow: 10 },
        bookedSeats: [{ rowNumber: 1, seatNumber: 1 }],
    };

    it('shows info alert for guest and renders login CTA text', () => {
        useSessionBookingMock.mockReturnValue({
            isAuthed: false,
            data: sessionData,
            isLoading: false,
            isError: false,
            bookedSet: new Set(['1:1']),
            selected: [],
            toggleSeat: jest.fn(),
            onBook: jest.fn(),
            actionError: null,
            isBooking: false,
        });

        render(<SessionDetails />);

        expect(screen.getByText(/Для бронирования нужно войти/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Войти для бронирования' })).toBeInTheDocument();
    });

    it('shows action error alert when actionError exists', () => {
        useSessionBookingMock.mockReturnValue({
            isAuthed: true,
            data: sessionData,
            isLoading: false,
            isError: false,
            bookedSet: new Set(),
            selected: [],
            toggleSeat: jest.fn(),
            onBook: jest.fn(),
            actionError: 'Не удалось забронировать места',
            isBooking: false,
        });

        render(<SessionDetails />);

        expect(screen.getByText('Не удалось забронировать места')).toBeInTheDocument();
    });

    it('renders SeatMap with correct props when data exists', () => {
        const toggleSeat = jest.fn();
        const bookedSet = new Set(['1:1']);

        useSessionBookingMock.mockReturnValue({
            isAuthed: true,
            data: sessionData,
            isLoading: false,
            isError: false,
            bookedSet,
            selected: [{ rowNumber: 2, seatNumber: 3 }],
            toggleSeat,
            onBook: jest.fn(),
            actionError: null,
            isBooking: false,
        });

        render(<SessionDetails />);

        expect(screen.getByTestId('seat-map')).toBeInTheDocument();

        expect(seatMapMock).toHaveBeenCalledWith(
            expect.objectContaining({
                rows: 10,
                seatsPerRow: 10,
                isAuthed: true,
                bookedSet,
                onToggleSeat: toggleSeat,
                selectedKeySet: expect.any(Set),
            })
        );

        const props = seatMapMock.mock.calls[0][0];
        expect(props.selectedKeySet.has('2:3')).toBe(true);
    });

    it('disables "Забронировать" when authed and no seats selected', () => {
        useSessionBookingMock.mockReturnValue({
            isAuthed: true,
            data: sessionData,
            isLoading: false,
            isError: false,
            bookedSet: new Set(),
            selected: [],
            toggleSeat: jest.fn(),
            onBook: jest.fn(),
            actionError: null,
            isBooking: false,
        });

        render(<SessionDetails />);

        const btn = screen.getByRole('button', { name: 'Забронировать' });
        expect(btn).toBeDisabled();
    });

    it('calls onBook on button click', () => {
        const onBook = jest.fn();

        useSessionBookingMock.mockReturnValue({
            isAuthed: true,
            data: sessionData,
            isLoading: false,
            isError: false,
            bookedSet: new Set(),
            selected: [{ rowNumber: 1, seatNumber: 2 }],
            toggleSeat: jest.fn(),
            onBook,
            actionError: null,
            isBooking: false,
        });

        render(<SessionDetails />);

        const btn = screen.getByRole('button', { name: 'Забронировать' });
        expect(btn).not.toBeDisabled();

        fireEvent.click(btn);
        expect(onBook).toHaveBeenCalledTimes(1);
    });

    it('passes isPending=true to BasePage when loading or no data', () => {
        useSessionBookingMock.mockReturnValue({
            isAuthed: true,
            data: undefined,
            isLoading: true,
            isError: false,
            bookedSet: new Set(),
            selected: [],
            toggleSeat: jest.fn(),
            onBook: jest.fn(),
            actionError: null,
            isBooking: false,
        });

        render(<SessionDetails />);

        expect(screen.getByTestId('base-page')).toBeInTheDocument();
        expect(screen.queryByTestId('seat-map')).not.toBeInTheDocument();
    });
});
