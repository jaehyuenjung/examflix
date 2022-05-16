import type { NextPage, NextPageContext } from "next";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";
import { Actor, Crew, Genre, Movie } from "@prisma/client";
import { useRouter } from "next/router";
import { ResponseType } from "@libs/server/withHandler";
import Banner from "@components/banner";
import Slider from "@components/slider";
import Head from "next/head";

export interface IMovieDetail extends Movie {
    actors: Actor[];
    genres: Genre[];
    crews: Crew[];
}

interface MovieResponse extends ResponseType {
    movies: IMovieDetail[];
}

const Home: NextPage = () => {
    const router = useRouter();
    const { keyword } = router.query;
    const { data } = useSWR<MovieResponse>("/api/movies");

    let filterMovies = data?.movies ? data.movies : [];
    if (keyword) {
        const titleResult = filterMovies.filter((movie) =>
            movie.title.includes(String(keyword))
        );
        const genreResult = filterMovies.filter((movie) =>
            movie.genres.some((g) => g.name.includes(String(keyword)))
        );
        const actorResult = filterMovies.filter((movie) =>
            movie.actors.some((a) => a.name === String(keyword))
        );
        const crewResult = filterMovies.filter((movie) =>
            movie.crews.some((c) => c.name.includes(String(keyword)))
        );
        filterMovies = [];

        titleResult.forEach((movie) => {
            if (!filterMovies.find((m) => m.id === movie.id)) {
                filterMovies.push(movie);
            }
        });
        genreResult.forEach((movie) => {
            if (!filterMovies.find((m) => m.id === movie.id)) {
                filterMovies.push(movie);
            }
        });
        actorResult.forEach((movie) => {
            if (!filterMovies.find((m) => m.id === movie.id)) {
                filterMovies.push(movie);
            }
        });
        crewResult.forEach((movie) => {
            if (!filterMovies.find((m) => m.id === movie.id)) {
                filterMovies.push(movie);
            }
        });
    }
    return (
        <div className="relative w-screen h-screen overflow-hidden min-w-[1000px]">
            <Head>
                <title>Examflix</title>
                <link
                    rel="shortcut icon"
                    href="https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico"
                ></link>
                <link
                    rel="apple-touch-icon"
                    href="https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png"
                ></link>
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0"
                />
            </Head>
            {data?.movies ? (
                <>
                    <Banner movies={data.movies} />
                    <Slider movies={filterMovies} />
                </>
            ) : null}
        </div>
    );
};

const Page: NextPage<{ movies: IMovieDetail[] }> = ({ movies }) => {
    return (
        <SWRConfig
            value={{
                fallback: {
                    "/api/movies": { ok: true, movies },
                },
            }}
        >
            <Home />
        </SWRConfig>
    );
};

export async function getServerSideProps({}: NextPageContext) {
    const movies = await client.movie.findMany({
        include: {
            actors: true,
            genres: true,
            crews: true,
        },
    });
    return { props: { movies } };
}

export default Page;
