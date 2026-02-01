'use client';

import { FC, useMemo } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import Link from 'next/link';
import { formatDateTime, getAssetUrl } from '@utils';

import { IMovieDetails } from './MovieDetails.declarations';

export const MovieDetails: FC<IMovieDetails> = ({ movieData, sessionsData, cinemasData }) => {
    const cinemasById = useMemo(() => {
        const map = new Map<number, string>();
        cinemasData?.forEach((c) => map.set(c.id, c.name));
        return map;
    }, [cinemasData]);

    return (
        <Box sx={{ p: 2, display: 'grid', gap: 2 }}>
            <Button component={Link} href="/movies" variant="text" sx={{ width: 'fit-content' }}>
                ← Назад
            </Button>

            {movieData && (
                <Card sx={{ display: 'flex', gap: 2 }}>
                    <CardMedia
                        component="img"
                        image={getAssetUrl(movieData.posterImage)}
                        alt={movieData.title}
                        sx={{ width: 240, height: 320, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            {movieData.title}
                        </Typography>

                        <Typography sx={{ opacity: 0.8, mb: 2 }}>
                            {movieData.year} • {movieData.lengthMinutes} мин
                        </Typography>

                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                            {movieData.description}
                        </Typography>
                    </CardContent>
                </Card>
            )}

            <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Сеансы
                </Typography>

                {sessionsData.length === 0 ? (
                    <Typography sx={{ opacity: 0.8 }}>Сеансов пока нет</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Кинотеатр</TableCell>
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
                                        <TableCell>{cinemasById.get(s.cinemaId) ?? `Cinema #${s.cinemaId}`}</TableCell>
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
    );
};
