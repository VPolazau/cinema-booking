import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import {
    AuthPayload,
    Booking,
    Cinema,
    Movie,
    MovieSession,
    MovieSessionDetails,
    Seat, Settings,
    TokenResponse,
} from '@/store/types';
import { BASE_URL } from '@utils';

export const cinemaApi = createApi({
    reducerPath: 'cinemaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).common.auth.token;
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Bookings', 'SessionDetails'],
    endpoints: (builder) => ({
        login: builder.mutation<TokenResponse, AuthPayload>({
            query: (body) => ({ url: '/login', method: 'POST', body }),
        }),
        register: builder.mutation<TokenResponse, AuthPayload>({
            query: (body) => ({ url: '/register', method: 'POST', body }),
        }),

        getMovies: builder.query<Movie[], void>({
            query: () => '/movies',
        }),
        getMovieSessions: builder.query<MovieSession[], number>({
            query: (movieId) => `/movies/${movieId}/sessions`,
        }),

        getCinemas: builder.query<Cinema[], void>({
            query: () => '/cinemas',
        }),
        getCinemaSessions: builder.query<MovieSession[], number>({
            query: (cinemaId) => `/cinemas/${cinemaId}/sessions`,
        }),

        getMovieSessionDetails: builder.query<MovieSessionDetails, number>({
            query: (movieSessionId) => `/movieSessions/${movieSessionId}`,
            providesTags: (_res, _err, id) => [{ type: 'SessionDetails', id }],
        }),
        bookSeats: builder.mutation<{ bookingId: string }, { movieSessionId: number; seats: Seat[] }>({
            query: ({ movieSessionId, seats }) => ({
                url: `/movieSessions/${movieSessionId}/bookings`,
                method: 'POST',
                body: { seats },
            }),
            invalidatesTags: (_res, _err, args) => [
                { type: 'SessionDetails', id: args.movieSessionId },
                { type: 'Bookings', id: 'LIST' },
            ],
        }),

        getMyBookings: builder.query<Booking[], void>({
            query: () => '/me/bookings',
            providesTags: [{ type: 'Bookings', id: 'LIST' }],
        }),
        payBooking: builder.mutation<{ message: string }, string>({
            query: (bookingId) => ({
                url: `/bookings/${bookingId}/payments`,
                method: 'POST',
            }),
            invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
        }),

        getSettings: builder.query<Settings, void>({
            query: () => '/settings',
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetMoviesQuery,
    useGetMovieSessionsQuery,
    useGetCinemasQuery,
    useGetCinemaSessionsQuery,
    useGetMovieSessionDetailsQuery,
    useBookSeatsMutation,
    useGetMyBookingsQuery,
    usePayBookingMutation,
    useGetSettingsQuery,
} = cinemaApi;