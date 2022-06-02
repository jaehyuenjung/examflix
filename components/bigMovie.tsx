import { NextPage } from "next";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import useSWR from "swr";
import { MovieDetailResponse } from "@types.ts";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Loading from "./loading";

const ReactPlayer = dynamic(() => import("react-player/youtube"), {
    ssr: false,
});

interface BigMovieProps {
    open: boolean;
    movieId?: number;
    onCloseCallback: () => void;
}

const BigMovie: NextPage<BigMovieProps> = ({
    open,
    movieId,
    onCloseCallback,
}) => {
    const router = useRouter();
    const { data } = useSWR<MovieDetailResponse>(
        movieId ? `/api/movies/${movieId}` : null
    );

    const onSearch = (keyword: string) => {
        router.push(`/search?q=${keyword}`);
    };

    if (!open) return null;
    return createPortal(
        <div
            onClick={onCloseCallback}
            className="fixed w-screen h-screen flex justify-center items-center top-0 z-50"
        >
            <motion.div
                layoutId={movieId + ""}
                className="absolute w-[40vw] h-[80vh] left-0 right-0 m-auto bg-black rounded-md overflow-y-auto will-change-transform overflow-x-hidden p-3"
            >
                {data ? (
                    <>
                        <div className="relative aspect-video overflow-hidden">
                            {data.movie?.video_path ? (
                                <>
                                    <ReactPlayer
                                        wrapper={({ children }) => (
                                            <div className="absolute w-full h-full left-0 top-0 bg-black">
                                                {children}
                                            </div>
                                        )}
                                        playing
                                        muted
                                        url={data.movie.video_path!}
                                        config={{
                                            playerVars: {
                                                cc_load_policy: 0,
                                                autoplay: 1,
                                                controls: 0,
                                                odestbranding: 1,
                                                fs: 0,
                                                rel: 0,
                                                iv_load_policy: 3,
                                                loop: 0,
                                                disablekb: 1,
                                                enablejsapi: 0,
                                            },
                                        }}
                                    />

                                    <div
                                        style={{
                                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))`,
                                        }}
                                        className="absolute w-full h-full bg-transparent"
                                    ></div>
                                </>
                            ) : (
                                <div
                                    style={{
                                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${
                                            data.movie?.poster_path
                                                ? `https://image.tmdb.org/t/p/original${data.movie.poster_path}`
                                                : ""
                                        })`,
                                        backgroundSize: "80% 100%",
                                    }}
                                    className="absolute w-full h-full left-0 top-0 bg-no-repeat bg-center"
                                />
                            )}
                            <div className="absolute bottom-[25%] left-[2.75rem]">
                                <h1 className="text-white text-2xl">
                                    {data.movie?.title}
                                </h1>
                            </div>
                        </div>
                        <div className="flex mb-5">
                            <div
                                style={{
                                    gridTemplateColumns: "70% 30%",
                                }}
                                className="grid"
                            >
                                <div className="">
                                    <div className="flex space-x-5 mx-11 text-gray-50 items-center">
                                        {data.movie &&
                                        data.movie?.certification !== -1 ? (
                                            <span>
                                                {data.movie?.certification}세
                                                이상
                                            </span>
                                        ) : null}
                                        {data.movie &&
                                        data.movie?.runtime !== -1 ? (
                                            <span>{data.movie.runtime}분</span>
                                        ) : null}
                                        <span>{data.movie?.release_date}</span>
                                    </div>
                                    <div className="text-gray-50 mx-11 flex-1">
                                        {data.movie?.overview}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="w-full space-x-1">
                                        <span className="text-gray-50 text-opacity-70">
                                            배우:
                                        </span>
                                        <span className="flex flex-wrap space-x-2 gap-y-2">
                                            {data.movie?.actors.map((actor) => (
                                                <span
                                                    onClick={() =>
                                                        onSearch(actor.name)
                                                    }
                                                    key={actor.id}
                                                    className="text-gray-50 bg-gray-400 bg-opacity-40 leading-5 rounded-md px-1 text-sm cursor-pointer"
                                                >
                                                    {actor.name}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                    <div className="w-full space-x-1">
                                        <span className="text-gray-50 text-opacity-70">
                                            장르:
                                        </span>
                                        <span className="flex flex-wrap space-x-2 gap-y-2">
                                            {data.movie?.genres.map((genre) => (
                                                <span
                                                    onClick={() =>
                                                        onSearch(genre.name)
                                                    }
                                                    key={genre.id}
                                                    className="text-gray-50 bg-gray-400 bg-opacity-40 leading-5 rounded-md px-1 text-sm cursor-pointer"
                                                >
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                    <div className="w-full space-x-1">
                                        <span className="text-gray-50 text-opacity-70">
                                            감독:
                                        </span>
                                        <span className="flex flex-wrap space-x-2 gap-y-2">
                                            {data.movie?.crews.map((crew) => (
                                                <span
                                                    onClick={() =>
                                                        onSearch(crew.name)
                                                    }
                                                    key={crew.id}
                                                    className="text-gray-50 bg-gray-400 bg-opacity-40 leading-5 rounded-md px-1 text-sm cursor-pointer"
                                                >
                                                    {crew.name}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <Loading />
                )}
            </motion.div>
        </div>,
        document.body
    );
};

export default BigMovie;
