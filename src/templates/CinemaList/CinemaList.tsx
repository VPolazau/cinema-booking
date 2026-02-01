'use client';

import Link from 'next/link';

import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { Cinema } from '@/store/types';

export const CinemaList = ({ data }: { data: Cinema[] | undefined }) => (
    <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
            Кинотеатры
        </Typography>

        <Grid container spacing={2}>
            {data &&
                data.map((cinema) => (
                    <Grid key={cinema.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    {cinema.name}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    {cinema.address}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ px: 2, pb: 2 }}>
                                <Button component={Link} href={`/cinemas/${cinema.id}`} variant="contained" fullWidth>
                                    Просмотреть сеансы
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
        </Grid>
    </Box>
);
