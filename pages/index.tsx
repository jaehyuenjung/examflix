import type { NextPage, NextPageContext } from "next";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";
import { Movie } from "@prisma/client";
import { useRouter } from "next/router";
import { ResponseType } from "@libs/server/withHandler";
import { useEffect, useState } from "react";

// 한 페이지(skip) 당 영화 개수
const take = 5;

interface MovieResponse extends ResponseType {
    movies: Movie[];
    totalCount?: number;
}

const Home: NextPage = () => {
    const router = useRouter();
    const [totalCount, setTotalCount] = useState(0);
    const { data } = useSWR<MovieResponse>(
        `/api/movies?page=${router.query.page ? router.query.page : 1}`
    );

    useEffect(() => {
        if (data && data.totalCount) {
            setTotalCount(data.totalCount);
        }
    }, [data]);

    return (
        <div className="flex space-x-5">
            {data?.movies.map((movie, key) => (
                <div key={key} className="flex">
                    <img
                        src={`https://image.tmdb.org/t/p/w220_and_h330_face/${movie.poster_path}`}
                    />
                </div>
            ))}
        </div>
    );
};

const Page: NextPage<{ response: { [key: string]: MovieResponse } }> = ({
    response,
}) => {
    return (
        <SWRConfig
            value={{
                fallback: response,
            }}
        >
            <Home />
        </SWRConfig>
    );
};

export async function getServerSideProps({ query }: NextPageContext) {
    const { page } = query;
    const response: { [key: string]: MovieResponse } = {};
    const totalCount = await (await client.movie.findMany({})).length;
    if (page && Number(page) !== NaN) {
        response[`/api/movies?page=${page}`] = {
            ok: true,
            movies: await client.movie.findMany({
                take,
                skip: Number(page),
            }),
            totalCount,
        };
    } else {
        response[`/api/movies?page=${1}`] = {
            ok: true,
            movies: await client.movie.findMany({
                take,
                skip: 1,
            }),
            totalCount,
        };
    }
    return { props: { response } };
}

export default Page;
