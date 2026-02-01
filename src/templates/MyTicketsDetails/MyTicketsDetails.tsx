'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { BasePage, Separator } from '@ui';

import { TicketCardSection } from './components/TicketCardSection';
import { useMyTickets } from './MyTicketsDetails.hooks';

export const MyTicketsDetails = () => {
    const router = useRouter();
    const {
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
        isPaying,
    } = useMyTickets();

    useEffect(() => {
        if (!isAuthed) router.replace('/auth?next=/my-tickets');
    }, [isAuthed, router]);

    if (!isAuthed) return null;

    return (
        <BasePage isPending={isLoading} isError={isError} errorMessage="Не удалось загрузить билеты">
            <Box sx={{ p: 2, display: 'grid', gap: 3 }}>
                <Typography variant="h5">Мои билеты</Typography>

                <TicketCardSection
                    title="Неоплаченные"
                    items={unpaid}
                    paymentSeconds={paymentSeconds}
                    isPaying={isPaying}
                    onPay={onPay}
                    movieTitleById={movieTitleById}
                    cinemaById={cinemaById}
                />
                <Separator />
                <TicketCardSection
                    title="Будущие"
                    items={future}
                    paymentSeconds={paymentSeconds}
                    isPaying={isPaying}
                    onPay={onPay}
                    movieTitleById={movieTitleById}
                    cinemaById={cinemaById}
                />
                <Separator />
                <TicketCardSection
                    title="Прошедшие"
                    items={past}
                    paymentSeconds={paymentSeconds}
                    isPaying={isPaying}
                    onPay={onPay}
                    movieTitleById={movieTitleById}
                    cinemaById={cinemaById}
                />
            </Box>
        </BasePage>
    );
};
