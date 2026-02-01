'use client';

import { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import { ITicketCardSection } from './TicketCardSection.declarations';
import { getBookedAtMs } from '../../MyTicketsDetails.utils';
import { TicketCard } from '../TicketCard';

export const TicketCardSection: FC<ITicketCardSection> = ({
    title,
    items,
    paymentSeconds,
    movieTitleById,
    onPay,
    isPaying,
    cinemaById,
}) => {
    return (
        <Box sx={{ display: 'grid', gap: 1 }}>
            <Typography variant="h6">{title}</Typography>
            {items.length === 0 ? (
                <Typography sx={{ opacity: 0.7 }}>Пусто</Typography>
            ) : (
                <Stack spacing={1.5}>
                    {items
                        .slice()
                        .sort((a, b) => {
                            const at = a.startTimeMs ?? getBookedAtMs(a.booking.bookedAt);
                            const bt = b.startTimeMs ?? getBookedAtMs(b.booking.bookedAt);
                            return at - bt;
                        })
                        .map((x) => {
                            const movieTitle = x.session ? movieTitleById.get(x.session.movieId) : undefined;
                            const cinema = x.session ? cinemaById.get(x.session.cinemaId) : undefined;
                            return (
                                <TicketCard
                                    key={x.booking.id}
                                    vm={x}
                                    paymentSeconds={paymentSeconds}
                                    onPay={onPay}
                                    isPaying={isPaying}
                                    movieTitle={movieTitle}
                                    cinemaName={cinema?.name}
                                    cinemaAddress={cinema?.address}
                                />
                            );
                        })}
                </Stack>
            )}
        </Box>
    );
};
