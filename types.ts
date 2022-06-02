import { Actor, Crew, Genre, Movie } from "@prisma/client";

export interface ResponseType {
    ok: boolean;
    [key: string]: any;
}

export interface MovieResponse extends ResponseType {
    movies: Movie[];
}

export interface IMovieDetail extends Movie {
    actors: Actor[];
    genres: Genre[];
    crews: Crew[];
}

export interface MovieDetailResponse extends ResponseType {
    movie: IMovieDetail;
}
