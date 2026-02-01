'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { useGetCinemasQuery, useGetCinemaSessionsQuery, useGetMoviesQuery } from '@/store/api/cinemaApi';
import { BasePage } from '@ui';
import { CinemaDetails } from '@/templates';

export default function CinemaDetailsPage() {
    const params = useParams<{ cinemaId: string }>();
    const cinemaId = Number(params.cinemaId);

    const cinemasQ = useGetCinemasQuery();
    const sessionsQ = useGetCinemaSessionsQuery(cinemaId);
    const moviesQ = useGetMoviesQuery();

    const cinema = useMemo(() => cinemasQ.data?.find((c) => c.id === cinemaId), [cinemasQ.data, cinemaId]);

    const isLoading = cinemasQ.isLoading || sessionsQ.isLoading || moviesQ.isLoading;

    return (
        <BasePage
            isPending={isLoading || !cinema}
            isError={sessionsQ.isError || moviesQ.isError}
            errorMessage="Не удалось загрузить кинотеатры"
        >
            <CinemaDetails cinemaData={cinema} moviesData={moviesQ?.data} sessionsData={sessionsQ?.data ?? []} />
        </BasePage>
    );
}
