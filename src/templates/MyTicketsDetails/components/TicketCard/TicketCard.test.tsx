import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TicketCard } from './TicketCard';

// mocks
const formatDateTimeMock: jest.Mock<string, [string]> = jest.fn();
jest.mock('@utils', () => ({
    formatDateTime: (iso: string) => formatDateTimeMock(iso),
}));

const formatRemainingMock: jest.Mock<string, [number]> = jest.fn();
jest.mock('./TicketCard.utils', () => ({
    formatRemaining: (ms: number) => formatRemainingMock(ms),
}));

jest.mock('@ui', () => ({
    Separator: () => <div data-testid="separator" />,
}));

describe('TicketCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        formatDateTimeMock.mockReturnValue('DATE_TIME');
        formatRemainingMock.mockReturnValue('0:30');
    });

    const baseVm = {
        booking: {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            bookedAt: '2026-01-26',
            isPaid: false,
            seats: [
                { rowNumber: 1, seatNumber: 2 },
                { rowNumber: 2, seatNumber: 3 },
            ],
        },
        session: {
            movieId: 10,
            cinemaId: 7,
            startTime: '2026-01-26T16:30:44.776Z',
        },
        isExpiredUnpaid: false,
        remainingMs: 30_000,
    };

    it('renders booking id prefix, movie/cinema names, time and seats', () => {
        render(
            <TicketCard
                vm={baseVm as any}
                paymentSeconds={120}
                onPay={jest.fn()}
                isPaying={false}
                movieTitle="Interstellar"
                cinemaName="Cinema Park"
                cinemaAddress="Main st"
            />
        );

        expect(screen.getByText('Бронирование #3fa85f64')).toBeInTheDocument();

        expect(screen.getByText('Interstellar')).toBeInTheDocument();
        expect(screen.getByText('Кинотеатр: Cinema Park • Main st')).toBeInTheDocument();

        expect(formatDateTimeMock).toHaveBeenCalledWith('2026-01-26T16:30:44.776Z');
        expect(screen.getByText('Время: DATE_TIME')).toBeInTheDocument();

        expect(screen.getByText('Места: 1-2, 2-3')).toBeInTheDocument();

        expect(screen.getByTestId('separator')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Оплатить' })).toBeInTheDocument();
    });

    it('uses fallback movie/cinema values when movieTitle/cinemaName not provided', () => {
        render(
            <TicketCard
                vm={baseVm as any}
                paymentSeconds={120}
                onPay={jest.fn()}
                isPaying={false}
            />
        );

        expect(screen.getByText('Фильм #10')).toBeInTheDocument();

        expect(screen.getByText('Кинотеатр: #7')).toBeInTheDocument();
    });

    it('shows "—" for time when session is missing', () => {
        const vmNoSession = {
            ...baseVm,
            session: undefined,
        };

        render(
            <TicketCard
                vm={vmNoSession as any}
                paymentSeconds={120}
                onPay={jest.fn()}
                isPaying={false}
            />
        );

        expect(screen.getByText('Время: —')).toBeInTheDocument();
        expect(formatDateTimeMock).not.toHaveBeenCalled();
    });

    it('renders warning when unpaid booking is expired and hides pay button', () => {
        const vmExpired = {
            ...baseVm,
            isExpiredUnpaid: true,
        };

        render(
            <TicketCard
                vm={vmExpired as any}
                paymentSeconds={120}
                onPay={jest.fn()}
                isPaying={false}
            />
        );

        expect(screen.getByText('Время на оплату вышло. Билет будет удален из списка.')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Оплатить' })).not.toBeInTheDocument();
    });

    it('renders timer using remainingMs when provided', () => {
        formatRemainingMock.mockReturnValue('0:45');

        render(
            <TicketCard
                vm={baseVm as any}
                paymentSeconds={120}
                onPay={jest.fn()}
                isPaying={false}
            />
        );

        expect(formatRemainingMock).toHaveBeenCalledWith(30_000);
        expect(screen.getByText('0:45')).toBeInTheDocument();
    });

    it('renders timer using paymentSeconds when remainingMs is undefined', () => {
        const vmNoRemaining = {
            ...baseVm,
            remainingMs: undefined,
        };

        formatRemainingMock.mockReturnValue('2:00');

        render(
            <TicketCard
                vm={vmNoRemaining as any}
                paymentSeconds={120}
                onPay={jest.fn()}
                isPaying={false}
            />
        );

        expect(formatRemainingMock).toHaveBeenCalledWith(120_000);
        expect(screen.getByText('2:00')).toBeInTheDocument();
    });

    it('calls onPay with booking id on click', () => {
        const onPay = jest.fn();

        render(
            <TicketCard
                vm={baseVm as any}
                paymentSeconds={120}
                onPay={onPay}
                isPaying={false}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Оплатить' }));
        expect(onPay).toHaveBeenCalledTimes(1);
        expect(onPay).toHaveBeenCalledWith('3fa85f64-5717-4562-b3fc-2c963f66afa6');
    });

    it('disables pay button when isPaying=true', () => {
        render(
            <TicketCard
                vm={baseVm as any}
                paymentSeconds={120}
                onPay={jest.fn()}
                isPaying={true}
            />
        );

        expect(screen.getByRole('button', { name: 'Оплатить' })).toBeDisabled();
    });

    it('shows "Оплачено" and hides pay block when booking is paid', () => {
        const vmPaid = {
            ...baseVm,
            booking: {
                ...baseVm.booking,
                isPaid: true,
            },
        };

        render(
            <TicketCard
                vm={vmPaid as any}
                paymentSeconds={120}
                onPay={jest.fn()}
                isPaying={false}
            />
        );

        expect(screen.getByText('Оплачено')).toBeInTheDocument();

        expect(screen.queryByRole('button', { name: 'Оплатить' })).not.toBeInTheDocument();
        expect(screen.queryByText(/Оплатить в течение/i)).not.toBeInTheDocument();
    });
});