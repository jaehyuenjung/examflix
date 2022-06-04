import Banner from "@components/banner";
import Slider from "@components/slider";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import { MovieResponse } from "@types.ts";
import Loading from "@components/loading";
import { useEffect } from "react";

const Search: NextPage = () => {
    const router = useRouter();
    const { data } = useSWR<MovieResponse>(
        typeof window === "undefined"
            ? null
            : router.query.q
            ? `/api/movies?q=${router.query.q}`
            : null
    );

    useEffect(() => {
        if (data && router) {
            if (!router.query.q) {
                router.push("/");
            }
        }
    }, [data, router]);

    return (
        <div className="w-screen overflow-x-hidden bg-black">
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
            {data ? (
                <>
                    <Banner />
                    <Slider title="검색 결과" movies={data.movies} />
                </>
            ) : (
                <div className="w-screen h-screen">
                    <Loading />
                </div>
            )}
        </div>
    );
};

export default Search;
