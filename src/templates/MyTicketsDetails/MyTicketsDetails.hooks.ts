'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { cinemaApi } from '@/store/api/cinemaApi';
import {
    useGetCinemasQuery,
    useGetMoviesQuery,
    useGetMyBookingsQuery,
    useGetSettingsQuery,
    usePayBookingMutation,
} from '@/store/api/cinemaApi';
import { useCommonState } from '@utils';
import { getBookedAtMs } from './MyTicketsDetails.utils';
import type { ITicketVM } from './MyTicketsDetails.declarations';
import { MovieSessionDetails } from '@/store/types';

export const useMyTickets = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { auth } = useCommonState();
    const isAuthed = Boolean(auth.token);

    const bookingsQ = useGetMyBookingsQuery(undefined, { skip: !isAuthed });
    const settingsQ = useGetSettingsQuery(undefined, { skip: !isAuthed });
    const moviesQ = useGetMoviesQuery(undefined, { skip: !isAuthed });
    const cinemasQ = useGetCinemasQuery(undefined, { skip: !isAuthed });

    const [payBooking, payState] = usePayBookingMutation();

    const [nowMs, setNowMs] = useState(() => Date.now());
    const expiredRefetchedIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!isAuthed) return;

        const t = setInterval(() => setNowMs(Date.now()), 1000);
        return () => clearInterval(t);
    }, [isAuthed]);

    // детали сеансов в кеш
    useEffect(() => {
        const bookings = bookingsQ.data ?? [];
        if (!bookings.length) return;

        const uniqueSessionIds = Array.from(new Set(bookings.map((b) => b.movieSessionId)));

        uniqueSessionIds.forEach((id) => {
            const p = dispatch(cinemaApi.endpoints.getMovieSessionDetails.initiate(id, { forceRefetch: false }));
            p.unsubscribe();
        });
    }, [bookingsQ.data, dispatch]);

    // детали из кеша
    const sessionsById = useSelector((state: RootState) => {
        const bookings = bookingsQ.data ?? [];
        const uniqueIds = Array.from(new Set(bookings.map((b) => b.movieSessionId)));

        const map: Record<number, MovieSessionDetails | undefined> = {};
        uniqueIds.forEach((id) => {
            const res = cinemaApi.endpoints.getMovieSessionDetails.select(id)(state);
            map[id] = res.data;
        });

        return map;
    });

    const paymentSeconds = settingsQ.data?.bookingPaymentTimeSeconds ?? 0;

    const vms = useMemo<ITicketVM[]>(() => {
        const bookings = bookingsQ.data ?? [];

        return bookings.map((booking) => {
            const session = sessionsById[booking.movieSessionId];
            const startTimeMs = session ? Date.parse(session.startTime) : undefined;

            const isUnpaid = !booking.isPaid;
            const bookedAtMs = getBookedAtMs(booking.bookedAt);
            const deadlineMs = bookedAtMs + paymentSeconds * 1000;
            const remainingMs = deadlineMs - nowMs;
            const isExpiredUnpaid = isUnpaid && paymentSeconds > 0 && remainingMs <= 0;

            return { booking, session, startTimeMs, isExpiredUnpaid, remainingMs };
        });
    }, [bookingsQ.data, sessionsById, paymentSeconds, nowMs]);

    // скрываем просрочку
    useEffect(() => {
        if (!paymentSeconds) return;

        const expired = vms.filter((x) => x.isExpiredUnpaid).map((x) => x.booking.id);
        if (expired.length === 0) return;

        let needRefetch = false;
        expired.forEach((id) => {
            if (!expiredRefetchedIds.current.has(id)) {
                expiredRefetchedIds.current.add(id);
                needRefetch = true;
            }
        });

        if (needRefetch) bookingsQ.refetch();
    }, [vms, paymentSeconds, bookingsQ]);

    const cinemaById = useMemo(() => {
        const map = new Map<number, { name: string; address: string }>();
        (cinemasQ.data ?? []).forEach((c) => map.set(c.id, { name: c.name, address: c.address }));
        return map;
    }, [cinemasQ.data]);

    const movieTitleById = useMemo(() => {
        const map = new Map<number, string>();
        (moviesQ.data ?? []).forEach((m) => map.set(m.id, m.title));
        return map;
    }, [moviesQ.data]);

    const visibleVMs = useMemo(() => vms.filter((x) => !x.isExpiredUnpaid), [vms]);

    const now = nowMs;

    const unpaid = visibleVMs.filter((x) => !x.booking.isPaid);
    const paid = visibleVMs.filter((x) => x.booking.isPaid);

    const future = paid.filter((x) => (x.startTimeMs ?? Number.POSITIVE_INFINITY) > now);
    const past = paid.filter((x) => (x.startTimeMs ?? Number.POSITIVE_INFINITY) <= now);

    const onPay = useCallback(
        async (bookingId: string) => {
            await payBooking(bookingId).unwrap();
            bookingsQ.refetch();
        },
        [payBooking, bookingsQ]
    );

    const isLoading = bookingsQ.isLoading || settingsQ.isLoading || moviesQ.isLoading || cinemasQ.isLoading;

    const isError = bookingsQ.isError || settingsQ.isError || moviesQ.isError || cinemasQ.isError;

    return {
        isAuthed,
        isLoading,
        isError,
        paymentSeconds,
        unpaid,
        future,
        past,
        movieTitleById,
        cinemaById,
        onPay,
        isPaying: payState.isLoading,
    };
};
