import React, { JSX } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TicketCardSection } from './TicketCardSection';

// mocks
const ticketCardMock: jest.Mock<JSX.Element, [any]> = jest.fn(({ vm }) => (
    <div data-testid={`ticket-${vm.booking.id}`} />
));

jest.mock('../TicketCard', () => ({
    TicketCard: (props: any) => ticketCardMock(props),
}));

const getBookedAtMsMock: jest.Mock<number, [string]> = jest.fn();
jest.mock('../../MyTicketsDetails.utils', () => ({
    getBookedAtMs: (s: string) => getBookedAtMsMock(s),
}));

describe('TicketCardSection', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mkVm = (id: string, bookedAt: string, startTimeMs?: number, movieId?: number, cinemaId?: number) => ({
        booking: {
            id,
            bookedAt,
            seats: [],
            isPaid: false,
        },
        startTimeMs,
        session:
            movieId != null && cinemaId != null
                ? {
                    movieId,
                    cinemaId,
                }
                : undefined,
    });

    it('renders title and "Пусто" when items are empty', () => {
        render(
            <TicketCardSection
                title="Неоплаченные"
                items={[]}
                paymentSeconds={120}
                movieTitleById={new Map()}
                cinemaById={new Map()}
                onPay={jest.fn()}
                isPaying={false}
            />
        );

        expect(screen.getByText('Неоплаченные')).toBeInTheDocument();
        expect(screen.getByText('Пусто')).toBeInTheDocument();
        expect(ticketCardMock).not.toHaveBeenCalled();
    });

    it('renders TicketCard for each item and passes derived titles/cinema info', () => {
        const movieTitleById = new Map<number, string>([
            [10, 'Interstellar'],
            [11, 'Dune'],
        ]);

        const cinemaById = new Map<number, { name: string; address: string }>([
            [7, { name: 'Cinema Park', address: 'Main st' }],
            [8, { name: 'IMAX Center', address: 'Big ave' }],
        ]);

        const items = [
            mkVm('b1', '2026-01-01', 1000, 10, 7),
            mkVm('b2', '2026-01-02', 2000, 11, 8),
        ];

        const onPay = jest.fn();

        render(
            <TicketCardSection
                title="Будущие"
                items={items as any}
                paymentSeconds={300}
                movieTitleById={movieTitleById}
                cinemaById={cinemaById}
                onPay={onPay}
                isPaying={true}
            />
        );

        expect(screen.getByText('Будущие')).toBeInTheDocument();
        expect(screen.queryByText('Пусто')).not.toBeInTheDocument();

        expect(ticketCardMock).toHaveBeenCalledTimes(2);

        expect(ticketCardMock).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                vm: expect.objectContaining({ booking: expect.objectContaining({ id: 'b1' }) }),
                paymentSeconds: 300,
                onPay,
                isPaying: true,
                movieTitle: 'Interstellar',
                cinemaName: 'Cinema Park',
                cinemaAddress: 'Main st',
            })
        );

        expect(ticketCardMock).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                vm: expect.objectContaining({ booking: expect.objectContaining({ id: 'b2' }) }),
                paymentSeconds: 300,
                onPay,
                isPaying: true,
                movieTitle: 'Dune',
                cinemaName: 'IMAX Center',
                cinemaAddress: 'Big ave',
            })
        );
    });

    it('sorts by startTimeMs when present', () => {
        const items = [
            mkVm('late', '2026-01-01', 5000),
            mkVm('early', '2026-01-01', 1000),
            mkVm('mid', '2026-01-01', 3000),
        ];

        render(
            <TicketCardSection
                title="Будущие"
                items={items as any}
                paymentSeconds={100}
                movieTitleById={new Map()}
                cinemaById={new Map()}
                onPay={jest.fn()}
                isPaying={false}
            />
        );

        expect(ticketCardMock).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({ vm: expect.objectContaining({ booking: expect.objectContaining({ id: 'early' }) }) })
        );
        expect(ticketCardMock).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({ vm: expect.objectContaining({ booking: expect.objectContaining({ id: 'mid' }) }) })
        );
        expect(ticketCardMock).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining({ vm: expect.objectContaining({ booking: expect.objectContaining({ id: 'late' }) }) })
        );
    });

    it('falls back to getBookedAtMs when startTimeMs is undefined', () => {
        getBookedAtMsMock.mockImplementation((s: string) => {
            if (s === '2026-01-10') return 10;
            if (s === '2026-01-05') return 5;
            if (s === '2026-01-20') return 20;
            return 0;
        });

        const items = [
            mkVm('t10', '2026-01-10', undefined),
            mkVm('t05', '2026-01-05', undefined),
            mkVm('t20', '2026-01-20', undefined),
        ];

        render(
            <TicketCardSection
                title="Неоплаченные"
                items={items as any}
                paymentSeconds={100}
                movieTitleById={new Map()}
                cinemaById={new Map()}
                onPay={jest.fn()}
                isPaying={false}
            />
        );

        expect(ticketCardMock).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({ vm: expect.objectContaining({ booking: expect.objectContaining({ id: 't05' }) }) })
        );
        expect(ticketCardMock).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({ vm: expect.objectContaining({ booking: expect.objectContaining({ id: 't10' }) }) })
        );
        expect(ticketCardMock).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining({ vm: expect.objectContaining({ booking: expect.objectContaining({ id: 't20' }) }) })
        );

        expect(getBookedAtMsMock).toHaveBeenCalledTimes(6);
    });

    it('mixes startTimeMs and bookedAt fallback correctly', () => {
        getBookedAtMsMock.mockImplementation((s: string) => {
            if (s === 'A') return 2000;
            if (s === 'B') return 4000;
            return 0;
        });

        const items = [
            mkVm('fallback-A', 'A', undefined), // 2000
            mkVm('explicit-1000', 'X', 1000), // 1000
            mkVm('fallback-B', 'B', undefined), // 4000
        ];

        render(
            <TicketCardSection
                title="Смешанная"
                items={items as any}
                paymentSeconds={100}
                movieTitleById={new Map()}
                cinemaById={new Map()}
                onPay={jest.fn()}
                isPaying={false}
            />
        );

        expect(ticketCardMock).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                vm: expect.objectContaining({ booking: expect.objectContaining({ id: 'explicit-1000' }) }),
            })
        );
        expect(ticketCardMock).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                vm: expect.objectContaining({ booking: expect.objectContaining({ id: 'fallback-A' }) }),
            })
        );
        expect(ticketCardMock).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining({
                vm: expect.objectContaining({ booking: expect.objectContaining({ id: 'fallback-B' }) }),
            })
        );
    });
});