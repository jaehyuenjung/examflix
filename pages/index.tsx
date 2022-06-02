import type { NextPage, NextPageContext } from "next";
import { SWRConfig } from "swr";
import client from "@libs/server/client";
import Banner from "@components/banner";
import Slider from "@components/slider";
import Head from "next/head";
import { Movie } from "@prisma/client";

interface HomeProps {
    movies: Movie[];
}

const Home: NextPage<HomeProps> = ({ movies }) => {
    return (
        <div className="w-screen overflow-x-hidden min-w-[1000px] bg-black">
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
            {movies ? (
                <>
                    <SWRConfig
                        value={{
                            fallback: {
                                "/api/movies": { ok: true, movies },
                            },
                        }}
                    >
                        <Banner />
                    </SWRConfig>
                    <Slider title="신규 콘텐츠" movies={movies} />
                </>
            ) : null}
        </div>
    );
};

export async function getStaticProps({}: NextPageContext) {
    const movies = await client.movie.findMany();

    return {
        props: {
            movies,
        },

        revalidate: 60 * 24,
    };
}

export default Home;
