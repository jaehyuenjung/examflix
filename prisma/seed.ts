import { Actor, Crew, Genre, Movie, PrismaClient } from "@prisma/client";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const client = new PrismaClient();

const BASE_URL = `https://api.themoviedb.org/3`;
const PAGE_LENGTH = 3;

interface movieResult extends Movie {
    genre_ids: number[];
}

interface RatingResult {
    iso_3166_1: string;
    release_dates: { certification: string }[];
}

interface VideoResult {
    site: string;
    type: string;
    key: string;
}

function CertificationOfUSRating(rating: string) {
    if (rating === "G") return 0; // 0세 이상(모든 연령)
    else if (rating === "PG-13") return 14; // 14세 이상
    else if (rating === "R") return 18; // 18세 이상
    else if (rating === "NC-17") return 20; //20세 이상
    else if (rating === "NR") return -1; // 정보가 없음
    else if (rating === "PG") return 11; // 11세 이상
    return -1;
}

async function main() {
    // TMDB에 있는 모든 장르를 현재 DB에 저장
    // const {
    //     data: { genres },
    // } = await axios(
    //     `${BASE_URL}/genre/movie/list?api_key=${process.env.API_KEY}`
    // );
    // const genrePromises = await Promise.all(
    //     genres.map(
    //         (genre: Genre) =>
    //             new Promise(async (resolve, reject) => {
    //                 await client.genre.create({ data: genre });
    //                 resolve(null);
    //             })
    //     )
    // );

    Array.from({ length: PAGE_LENGTH }, (_, k) => k + 1).forEach((p) => {
        axios({
            method: "get",
            url: `${BASE_URL}/movie/popular?api_key=${process.env.API_KEY}&page=${p}`,
        }).then(({ data: { results: movieResults } }) => {
            movieResults.forEach((movie: movieResult) => {
                axios({
                    method: "get",
                    url: `${BASE_URL}/movie/${movie.id}/release_dates?api_key=${process.env.API_KEY}`,
                })
                    .then(({ data: { results: ratingResults } }) => {
                        const USRating = ratingResults.find(
                            (rating: RatingResult) => rating.iso_3166_1 === "US"
                        );
                        movie.certification = CertificationOfUSRating(
                            USRating?.release_dates[0].certification
                        );
                    })
                    .then(() => {
                        axios({
                            method: "get",
                            url: `${BASE_URL}/movie/${movie.id}/videos?api_key=${process.env.API_KEY}`,
                        })
                            .then(({ data: { results: videoResults } }) => {
                                const youtubeTrailer = videoResults.find(
                                    (video: VideoResult) =>
                                        video.site === "YouTube"
                                );
                                if (youtubeTrailer) {
                                    movie.video_path = `https://www.youtube.com/watch?v=${youtubeTrailer.key}`;
                                }
                            })
                            .then(() => {
                                axios({
                                    method: "get",
                                    url: `${BASE_URL}/movie/${movie.id}?api_key=${process.env.API_KEY}`,
                                })
                                    .then(({ data: { runtime } }) => {
                                        if (runtime) movie.runtime = runtime;
                                        else movie.runtime = -1;
                                    })
                                    .then(() => {
                                        axios({
                                            method: "get",
                                            url: `${BASE_URL}/movie/${movie.id}/credits?api_key=${process.env.API_KEY}`,
                                        }).then(
                                            async ({
                                                data: { cast, crew },
                                            }) => {
                                                await client.movie.create({
                                                    data: {
                                                        id: movie.id,
                                                        title: movie.title,
                                                        overview:
                                                            movie.overview,
                                                        poster_path:
                                                            movie.poster_path,
                                                        video_path:
                                                            movie.video_path,
                                                        release_date:
                                                            movie.release_date,
                                                        runtime: movie.runtime,
                                                        certification:
                                                            movie.certification,
                                                        genres: {
                                                            connect:
                                                                movie.genre_ids.map(
                                                                    (
                                                                        genre_id
                                                                    ) => ({
                                                                        id: genre_id,
                                                                    })
                                                                ),
                                                        },
                                                        actors: {
                                                            connectOrCreate:
                                                                cast
                                                                    .slice(0, 5)
                                                                    .map(
                                                                        (
                                                                            actor: Actor
                                                                        ) => ({
                                                                            where: {
                                                                                id: actor.id,
                                                                            },
                                                                            create: {
                                                                                id: actor.id,
                                                                                name: actor.name,
                                                                            },
                                                                        })
                                                                    ),
                                                        },
                                                        crews: {
                                                            connectOrCreate:
                                                                crew
                                                                    .filter(
                                                                        (c: {
                                                                            job: string;
                                                                        }) =>
                                                                            c.job ===
                                                                            "Director"
                                                                    )
                                                                    .map(
                                                                        (
                                                                            c: Crew
                                                                        ) => ({
                                                                            where: {
                                                                                id: c.id,
                                                                            },
                                                                            create: {
                                                                                id: c.id,
                                                                                name: c.name,
                                                                            },
                                                                        })
                                                                    ),
                                                        },
                                                    },
                                                });
                                            }
                                        );
                                    });
                            });
                    });
            });
        });
    });
}

main()
    .catch((e) => console.log(e))
    .finally(() => client.$disconnect());
