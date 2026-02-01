'use client';

import { useGetMoviesQuery } from '@/store/api';
import { BasePage } from '@ui';
import { MovieList } from '@/templates';

export default function MovieListPage() {
    const { data, isLoading, isError } = useGetMoviesQuery();

    return (
        <BasePage
            isPending={isLoading}
            isError={isError}
            errorMessage='Не удалось загрузить фильмы'
        >
            <MovieList data={data} />
        </BasePage>
    );
}
