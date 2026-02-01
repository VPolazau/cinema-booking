import { Seat } from '@/store/types';


export const seatKey = (seat: Seat) => `${seat.rowNumber}:${seat.seatNumber}`;

export const buildBookedSet = (booked: Seat[]) => {
    const set = new Set<string>();
    booked.forEach((s) => set.add(seatKey(s)));
    return set;
};