import type { Seat } from '@/store/types';

export const toSeat = (rowNumber: number, seatNumber: number): Seat => ({ rowNumber, seatNumber });