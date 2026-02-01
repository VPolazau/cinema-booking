'use client';

import { useGetCinemasQuery } from '@/store/api/cinemaApi';
import { BasePage } from '@ui';
import { CinemaList } from '@/templates';

export default function CinemaListPage() {
    const { data, isLoading, isError } = useGetCinemasQuery();

    return (
        <BasePage
            isPending={isLoading || !data || !data.length}
            isError={isError}
            errorMessage='Не удалось загрузить кинотеатры'
        >
            <CinemaList data={data} />
        </BasePage>
    );
}