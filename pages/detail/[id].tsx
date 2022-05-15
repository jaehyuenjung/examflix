import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import client from "@libs/server/client";
import { Movie } from "@prisma/client";

interface DetailProps {
    movie?: Movie;
}

const Detail: NextPage<DetailProps> = ({ movie }) => {
    return null;
};

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
    const id = ctx?.params?.id;
    if (!id || Number(id) === NaN) {
        return {
            notFound: true,
        };
    }

    const movie = await client.movie.findUnique({ where: { id: Number(id) } });

    if (!movie) return { notFound: true };
    return { props: { movie } };
};

export default Detail;
