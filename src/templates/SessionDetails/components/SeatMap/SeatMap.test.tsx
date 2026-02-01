import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { SeatMap } from './SeatMap';

jest.mock('@/templates/SessionDetails/SessionDetails.utils', () => ({
    toSeat: (rowNumber: number, seatNumber: number) => ({ rowNumber, seatNumber }),
}));

describe('SeatMap', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correct amount of seats', () => {
        const onToggleSeat = jest.fn();

        render(
            <SeatMap
                rows={2}
                seatsPerRow={3}
                isAuthed={true}
                bookedSet={new Set()}
                selectedKeySet={new Set()}
                onToggleSeat={onToggleSeat}
            />
        );

        const seats = screen.getAllByRole('button');
        expect(seats).toHaveLength(2 * 3);

        expect(screen.getByLabelText('seat-1-1')).toBeInTheDocument();
        expect(screen.getByLabelText('seat-1-3')).toBeInTheDocument();
        expect(screen.getByLabelText('seat-2-2')).toBeInTheDocument();
    });

    it('calls onToggleSeat for available seat when authed', () => {
        const onToggleSeat = jest.fn();

        render(
            <SeatMap
                rows={2}
                seatsPerRow={3}
                isAuthed={true}
                bookedSet={new Set()}
                selectedKeySet={new Set()}
                onToggleSeat={onToggleSeat}
            />
        );

        fireEvent.click(screen.getByLabelText('seat-1-2'));

        expect(onToggleSeat).toHaveBeenCalledTimes(1);
        expect(onToggleSeat).toHaveBeenCalledWith(1, 2);
    });

    it('does not call onToggleSeat when not authed (all seats disabled)', () => {
        const onToggleSeat = jest.fn();

        render(
            <SeatMap
                rows={1}
                seatsPerRow={3}
                isAuthed={false}
                bookedSet={new Set()}
                selectedKeySet={new Set()}
                onToggleSeat={onToggleSeat}
            />
        );

        const seat = screen.getByLabelText('seat-1-1');

        expect(seat).toHaveAttribute('aria-disabled', 'true');

        fireEvent.click(seat);
        expect(onToggleSeat).not.toHaveBeenCalled();
    });

    it('does not call onToggleSeat when seat is booked', () => {
        const onToggleSeat = jest.fn();

        const bookedSet = new Set<string>(['1:2']);

        render(
            <SeatMap
                rows={1}
                seatsPerRow={3}
                isAuthed={true}
                bookedSet={bookedSet}
                selectedKeySet={new Set()}
                onToggleSeat={onToggleSeat}
            />
        );

        const seat = screen.getByLabelText('seat-1-2');

        expect(seat).toHaveAttribute('aria-disabled', 'true');

        fireEvent.click(seat);
        expect(onToggleSeat).not.toHaveBeenCalled();
    });

    it('selected seat is enabled and clickable', () => {
        const onToggleSeat = jest.fn();

        const selectedKeySet = new Set<string>(['1:1']);

        render(
            <SeatMap
                rows={1}
                seatsPerRow={2}
                isAuthed={true}
                bookedSet={new Set()}
                selectedKeySet={selectedKeySet}
                onToggleSeat={onToggleSeat}
            />
        );

        const seat = screen.getByLabelText('seat-1-1');

        expect(seat).toHaveAttribute('aria-disabled', 'false');

        fireEvent.click(seat);
        expect(onToggleSeat).toHaveBeenCalledTimes(1);
        expect(onToggleSeat).toHaveBeenCalledWith(1, 1);
    });

    it('does not call onToggleSeat when seat is both selected and booked (booked wins)', () => {
        const onToggleSeat = jest.fn();

        const bookedSet = new Set<string>(['1:1']);
        const selectedKeySet = new Set<string>(['1:1']);

        render(
            <SeatMap
                rows={1}
                seatsPerRow={1}
                isAuthed={true}
                bookedSet={bookedSet}
                selectedKeySet={selectedKeySet}
                onToggleSeat={onToggleSeat}
            />
        );

        const seat = screen.getByLabelText('seat-1-1');

        expect(seat).toHaveAttribute('aria-disabled', 'true');

        fireEvent.click(seat);
        expect(onToggleSeat).not.toHaveBeenCalled();
    });
});