import { memo, useCallback } from 'react';

import { Box, Stack } from '@mui/material';
import { seatKey } from '@utils';

import { ISeatMap } from './SeatMap.declarations';
import { toSeat } from '@/templates/SessionDetails/SessionDetails.utils';

export const SeatMap = memo<ISeatMap>(({
    rows,
    seatsPerRow,
    isAuthed,
    bookedSet,
    selectedKeySet,
    onToggleSeat,
}) => {
    const handleToggle = useCallback(
        (rowNumber: number, seatNumber: number) => onToggleSeat(rowNumber, seatNumber),
        [onToggleSeat]
    );

    return (
        <Box sx={{ pb: 2, overflowY: 'auto' }}>
            <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
                {Array.from({ length: rows }).map((_, rowIdx) => {
                    const rowNumber = rowIdx + 1;

                    return (
                        <Stack key={rowNumber} direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 32, textAlign: 'right', opacity: 0.7 }}>{rowNumber}</Box>

                            {Array.from({ length: seatsPerRow }).map((__, seatIdx) => {
                                const seatNumber = seatIdx + 1;
                                const seat = toSeat(rowNumber, seatNumber);
                                const key = seatKey(seat);

                                const isBooked = bookedSet.has(key);
                                const isSelected = selectedKeySet.has(key);
                                const disabled = !isAuthed || isBooked;

                                return (
                                    <Box
                                        key={key}
                                        role="button"
                                        aria-label={`seat-${rowNumber}-${seatNumber}`}
                                        aria-disabled={disabled ? 'true' : 'false'}
                                        onClick={disabled ? undefined : () => handleToggle(rowNumber, seatNumber)}
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 1,
                                            userSelect: 'none',
                                            cursor: disabled ? 'not-allowed' : 'pointer',
                                            border: '1px solid',
                                            borderColor: isSelected ? 'transparent' : 'divider',
                                            bgcolor: isSelected ? 'primary.main' : 'transparent',
                                            color: isSelected ? 'primary.contrastText' : 'text.primary',
                                            opacity: disabled ? 0.4 : 1,
                                            '&:hover': disabled ? {} : { bgcolor: isSelected ? 'primary.dark' : 'action.hover' },
                                        }}
                                    >
                                        {seatNumber}
                                    </Box>
                                );
                            })}
                        </Stack>
                    );
                })}
            </Stack>
        </Box>
    )
});
