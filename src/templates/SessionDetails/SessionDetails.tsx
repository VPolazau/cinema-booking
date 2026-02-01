'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';

import { seatKey } from '@utils';
import { BasePage, Separator } from '@ui';

import { useSessionBooking } from './SessionDetails.hooks';
import { SeatMap } from './components/SeatMap';

export const SessionDetails = () => {
    const params = useParams<{ movieSessionId: string }>();
    const movieSessionId = Number(params.movieSessionId);

    const { isAuthed, data, isLoading, isError, bookedSet, selected, toggleSeat, onBook, actionError, isBooking } =
        useSessionBooking(movieSessionId);

    // подлагивало - сделалл Set
    const selectedKeySet = useMemo(() => new Set(selected.map(seatKey)), [selected]);

    return (
        <BasePage
            isPending={isLoading || !data}
            isError={isError}
            errorMessage="Не удалось загрузить сеанс"
            isShowScrollBtn={false}
        >
            <Box sx={{ p: 2, display: 'grid', gap: 2 }}>
                <Typography variant="h5">Выбор мест</Typography>

                {!isAuthed && (
                    <Alert severity="info">
                        Вы можете посмотреть занятые места. Для бронирования нужно войти или зарегистрироваться.
                    </Alert>
                )}

                {actionError && <Alert severity="error">{actionError}</Alert>}

                {data && (
                    <Paper sx={{ p: 2, overflow: 'auto' }}>
                        <Typography sx={{ mb: 1, opacity: 0.8 }}>
                            Сеанс #{data.id} • {new Date(data.startTime).toLocaleString()}
                        </Typography>

                        <Separator type="solid" />

                        <Box sx={{ mb: 2, textAlign: 'center', fontWeight: 600, opacity: 0.8 }}>Экран</Box>

                        <SeatMap
                            rows={data.seats.rows}
                            seatsPerRow={data.seats.seatsPerRow}
                            isAuthed={isAuthed}
                            bookedSet={bookedSet}
                            selectedKeySet={selectedKeySet}
                            onToggleSeat={toggleSeat}
                        />

                        <Separator type="solid" />

                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                            <Typography sx={{ opacity: 0.8 }}>
                                Выбрано мест: <b>{selected.length}</b>
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={onBook}
                                disabled={isBooking || (isAuthed && selected.length === 0)}
                            >
                                {isAuthed ? 'Забронировать' : 'Войти для бронирования'}
                            </Button>
                        </Stack>
                    </Paper>
                )}
            </Box>
        </BasePage>
    );
};
