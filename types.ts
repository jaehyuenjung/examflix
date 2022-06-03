import { Actor, Crew, Genre, Movie } from "@prisma/client";

export interface ResponseType {
    ok: boolean;
    [key: string]: any;
}

export interface MovieOnGenre extends Movie {
    genres: Genre[];
}

export interface MovieResponse extends ResponseType {
    movies: MovieOnGenre[];
}

export interface IMovieDetail extends Movie {
    actors: Actor[];
    genres: Genre[];
    crews: Crew[];
}

export interface MovieDetailResponse extends ResponseType {
    movie: IMovieDetail;
}
