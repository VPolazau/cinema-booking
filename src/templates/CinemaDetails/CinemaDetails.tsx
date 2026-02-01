'use client';

import Link from 'next/link';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { FC, useMemo } from 'react';
import { ICinemaDetails } from '@/templates/CinemaDetails/CinemaDetails.declarations';
import { formatDateTime } from '@utils';

export const CinemaDetails: FC<ICinemaDetails> = ({ cinemaData, moviesData, sessionsData }) => {
    const moviesById = useMemo(() => {
        const map = new Map<number, string>();
        moviesData?.forEach((m) => map.set(m.id, m.title));
        return map;
    }, [moviesData]);

    return (
        <Box sx={{ p: 2, display: 'grid', gap: 2 }}>
            <Button component={Link} href="/cinemas" variant="text" sx={{ width: 'fit-content' }}>
                ← Назад
            </Button>

            <Box>
                <Typography variant="h5" sx={{ mb: 0.5 }}>
                    {cinemaData && cinemaData.name}
                </Typography>
                <Typography sx={{ opacity: 0.8 }}>{cinemaData && cinemaData.address}</Typography>
            </Box>

            <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Ближайшие сеансы
                </Typography>

                {sessionsData.length === 0 ? (
                    <Typography sx={{ opacity: 0.8 }}>Сеансов пока нет</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Фильм</TableCell>
                                <TableCell>Время</TableCell>
                                <TableCell align="right">Действие</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sessionsData
                                .slice()
                                .sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime))
                                .map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell>{moviesById.get(s.movieId) ?? `Movie #${s.movieId}`}</TableCell>
                                        <TableCell>{formatDateTime(s.startTime)}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                component={Link}
                                                href={`/sessions/${s.id}`}
                                                variant="contained"
                                                size="small"
                                            >
                                                Выбрать места
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                )}
            </Box>
        </Box>
    )
}