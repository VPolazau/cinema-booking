import { Cinema, Movie, MovieSession } from '@/store/types';

export interface ICinemaDetails {
    cinemaData?: Cinema;
    moviesData?:  Movie[];
    sessionsData:  MovieSession[];
}