export type ErrorResponse = {
    message: string;
    error?: string;
};

export type AuthPayload = {
    username: string;
    password: string;
};

export type TokenResponse = {
    token: string;
};

export type Movie = {
    id: number;
    title: string;
    description: string;
    year: number;
    lengthMinutes: number;
    posterImage: string;
    rating: number;
};

export type Cinema = {
    id: number;
    name: string;
    address: string;
};

export type MovieSession = {
    id: number;
    movieId: number;
    cinemaId: number;
    startTime: string; // ISO date-time
};

export type Seat = {
    rowNumber: number;
    seatNumber: number;
};

export type MovieSessionDetails = MovieSession & {
    seats: { rows: number; seatsPerRow: number };
    bookedSeats: Seat[];
};

export type Booking = {
    id: string; // uuid
    userId: number;
    movieSessionId: number;
    sessionId: number;
    bookedAt: string; // date
    seats: Seat[];
    isPaid: boolean;
};

export type Settings = {
    bookingPaymentTimeSeconds: number;
};