import Banner from "@components/banner";
import Slider from "@components/slider";
import { Movie } from "@prisma/client";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";
import { MovieResponse } from "@types.ts";

const Search: NextPage = () => {
    const router = useRouter();
    const { data } = useSWR<MovieResponse>(
        typeof window === "undefined"
            ? null
            : router.query.q
            ? `/api/movies?q=${router.query.q}`
            : null
    );

    if (!router.query.q) {
        router.replace("/");
    }
    return (
        <div className="w-screen overflow-x-hidden min-w-[1000px] bg-black">
            <Head>
                <title>{`${router.query.q} - Examflix Search`}</title>
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
                    <Banner />
                    <Slider title="검색 결과" movies={data.movies} />
                </>
            ) : null}
        </div>
    );
};

const Page: NextPage<{ movies: Movie[] }> = ({ movies }) => {
    return (
        <SWRConfig
            value={{
                fallback: {
                    "/api/movies": { ok: true, movies },
                },
            }}
        >
            <Search />
        </SWRConfig>
    );
};

export async function getServerSideProps({ query }: NextPageContext) {
    if (!query.q)
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: {},
        };
    const movies = await client.movie.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: query.q + "",
                    },
                },
                {
                    overview: {
                        contains: query.q + "",
                    },
                },
                {
                    actors: {
                        some: {
                            name: {
                                contains: query.q + "",
                            },
                        },
                    },
                },
                {
                    crews: {
                        some: {
                            name: {
                                contains: query.q + "",
                            },
                        },
                    },
                },
                {
                    genres: {
                        some: {
                            name: {
                                contains: query.q + "",
                            },
                        },
                    },
                },
            ],
        },
        include: {
            actors: true,
            crews: true,
            genres: true,
        },
    });
    return {
        props: {
            movies: JSON.parse(JSON.stringify(movies)),
        },
    };
}

export default Page;
