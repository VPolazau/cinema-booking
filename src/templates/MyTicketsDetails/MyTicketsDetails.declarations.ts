import type { Booking, MovieSessionDetails } from '@/store/types';

export interface ITicketVM {
    booking: Booking;
    session?: MovieSessionDetails;
    startTimeMs?: number;
    isExpiredUnpaid: boolean;
    remainingMs?: number;
};