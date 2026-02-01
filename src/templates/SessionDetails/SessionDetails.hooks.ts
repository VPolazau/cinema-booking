'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useBookSeatsMutation, useGetMovieSessionDetailsQuery } from '@/store/api/cinemaApi';
import { buildBookedSet, useCommonState } from '@utils';
import { Seat } from '@/store/types';

export const useSessionBooking = (movieSessionId: number) => {
    const router = useRouter();

    const { auth } = useCommonState();
    const isAuthed = Boolean(auth.token);

    const sessionQ = useGetMovieSessionDetailsQuery(movieSessionId);
    const [bookSeats, bookState] = useBookSeatsMutation();

    const [selected, setSelected] = useState<Seat[]>([]);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => setSelected([]), [movieSessionId]);

    const bookedSet = useMemo(() => buildBookedSet(sessionQ.data?.bookedSeats ?? []), [sessionQ.data?.bookedSeats]);

    const toggleSeat = useCallback(
        (rowNumber: number, seatNumber: number) => {
            if (!isAuthed) return;

            const key = `${rowNumber}:${seatNumber}`;
            if (bookedSet.has(key)) return;

            setSelected((prev) => {
                const exists = prev.some((x) => `${x.rowNumber}:${x.seatNumber}` === key);
                return exists
                    ? prev.filter((x) => `${x.rowNumber}:${x.seatNumber}` !== key)
                    : [...prev, { rowNumber, seatNumber }];
            });
        },
        [isAuthed, bookedSet]
    );

    const onBook = useCallback(async () => {
        setActionError(null);

        if (!isAuthed) {
            router.push(`/auth?next=${encodeURIComponent(`/sessions/${movieSessionId}`)}`);
            return;
        }

        if (selected.length === 0) return;

        try {
            await bookSeats({ movieSessionId, seats: selected }).unwrap();
            router.replace('/my-tickets');
        } catch {
            setActionError('Не удалось забронировать места. Возможно, их уже заняли.');
        }
    }, [isAuthed, router, movieSessionId, selected, bookSeats]);

    return {
        isAuthed,
        data: sessionQ.data,
        isLoading: sessionQ.isLoading,
        isError: sessionQ.isError,
        refetch: sessionQ.refetch,
        bookedSet,
        selected,
        toggleSeat,
        onBook,
        actionError,
        isBooking: bookState.isLoading,
    };
};
