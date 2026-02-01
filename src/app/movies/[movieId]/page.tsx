'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { useGetCinemasQuery, useGetMoviesQuery, useGetMovieSessionsQuery } from '@/store/api/cinemaApi';
import { BasePage } from '@ui';
import { MovieDetails } from '@/templates';

export default function MovieDetailsPage() {
    const params = useParams<{ movieId: string }>();
    const movieId = Number(params.movieId);

    const moviesQ = useGetMoviesQuery();
    const sessionsQ = useGetMovieSessionsQuery(movieId);
    const cinemasQ = useGetCinemasQuery();

    const movie = useMemo(() => moviesQ.data?.find((x) => x.id === movieId), [moviesQ.data, movieId]);

    const isLoading = moviesQ.isLoading || sessionsQ.isLoading || cinemasQ.isLoading || !movie;
    const isError = sessionsQ.isError || cinemasQ.isError || moviesQ.isError;

    const sessions = sessionsQ.data ?? [];

    return (
        <BasePage
            isPending={isLoading}
            isError={isError}
            errorMessage="Не удалось загрузить данные фильма"
        >
            <MovieDetails movieData={movie} sessionsData={sessions} cinemasData={cinemasQ?.data} />
        </BasePage>
    );
}
