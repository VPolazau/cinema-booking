import { FC } from 'react';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';

import { formatDateTime } from '@utils';

import { ITicketCard } from './TicketCard.declarations';
import { formatRemaining } from './TicketCard.utils';
import { Separator } from '@ui';

export const TicketCard: FC<ITicketCard> = ({
    vm,
    paymentSeconds,
    onPay,
    isPaying,
    movieTitle,
    cinemaName,
    cinemaAddress,
}) => {
    const b = vm.booking;

    return (
        <Paper sx={{ p: 2 }}>
            <Stack spacing={1}>
                <Typography sx={{ fontWeight: 700 }}>Бронирование #{b.id.slice(0, 8)}</Typography>

                <Typography sx={{ fontWeight: 700 }}>{movieTitle ?? `Фильм #${vm.session?.movieId ?? '—'}`}</Typography>

                <Typography sx={{ opacity: 0.8 }}>
                    Кинотеатр: {cinemaName ?? `#${vm.session?.cinemaId ?? '—'}`}
                    {cinemaAddress ? ` • ${cinemaAddress}` : ''}
                </Typography>

                <Typography sx={{ opacity: 0.8 }}>
                    Время: {vm.session ? formatDateTime(vm.session.startTime) : '—'}
                </Typography>

                <Typography sx={{ opacity: 0.8 }}>
                    Места: {b.seats.map((s) => `${s.rowNumber}-${s.seatNumber}`).join(', ')}
                </Typography>

                {!b.isPaid && (
                    <Box>
                        <Separator type="solid" />
                        {vm.isExpiredUnpaid ? (
                            <Alert severity="warning">Время на оплату вышло. Билет будет удален из списка.</Alert>
                        ) : (
                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                <Typography sx={{ opacity: 0.9 }}>
                                    Оплатить в течение:{' '}
                                    <b>{formatRemaining(vm.remainingMs ?? paymentSeconds * 1000)}</b>
                                </Typography>

                                <Button variant="contained" onClick={() => onPay(b.id)} disabled={isPaying}>
                                    Оплатить
                                </Button>
                            </Stack>
                        )}
                    </Box>
                )}

                {b.isPaid && <Typography sx={{ color: 'success.main', fontWeight: 600 }}>Оплачено</Typography>}
            </Stack>
        </Paper>
    );
};
