import { Cinema, Movie, MovieSession } from '@/store/types';

export interface IMovieDetails {
    movieData?: Movie;
    sessionsData: MovieSession[];
    cinemasData?: Cinema[];
}
