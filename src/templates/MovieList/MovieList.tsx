'use client';

import Link from 'next/link';

import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Rating, Typography } from '@mui/material';
import { getAssetUrl } from '@utils';
import { Movie } from '@/store/types';

export const MovieList = ({ data }: { data?: Movie[] }) => (
    <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
            Фильмы
        </Typography>

        <Grid container spacing={2}>
            {data &&
                data.map((movie) => (
                    <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="320"
                                image={getAssetUrl(movie.posterImage)}
                                alt={movie.title}
                                sx={{ objectFit: 'cover' }}
                            />

                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    {movie.title}
                                </Typography>

                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                                    {movie.year} • {movie.lengthMinutes} мин
                                </Typography>

                                <Box sx={{ mt: 'auto' }}>
                                    <Rating
                                        value={movie.rating != null ? movie.rating / 2 : null}
                                        max={5}
                                        precision={0.1}
                                        readOnly
                                    />
                                </Box>
                            </CardContent>

                            <CardActions sx={{ px: 2, pb: 2 }}>
                                <Button component={Link} href={`/movies/${movie.id}`} variant="contained" fullWidth>
                                    Просмотреть сеансы
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
        </Grid>
    </Box>
);
